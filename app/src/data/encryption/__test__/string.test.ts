import { describe, it, expect } from 'vitest';
import { Effect, Redacted } from 'effect';
import { encryptFpe } from '../fpe/string.js'
import { Secrets } from '../../../service/secrets.js';
import { effect } from 'effect/Layer';
import { cons } from 'effect/List';


// Helper: run an Effect that needs Secrets, return a Promise for vitest
const run = (effect: Effect.Effect<string, Error, Secrets>): string =>
    Effect.runSync(
        Effect.provideService(effect, Secrets, {
            key: Redacted.make('0123456789ABCDEF0123456789ABCDEF'),
            tweak: Redacted.make('test-tweak')
        } as unknown as Secrets
    )
    );

describe('encryptFpe', () => {

    describe('format preservation', () => {
        it('output is the same length as the input', async () => {
            const result = await run(encryptFpe('JOHN'));
            expect(result).toHaveLength(4);
        });

        it('output only contains alphabet characters and passthrough chars', async () => {
            const result = await run(encryptFpe('JOHN SMITH'));
            expect(result).toMatch(/^[A-Z_ -]+$/);
        });

        it('preserves space position', async () => {
            const result = await run(encryptFpe('LESLIE BLUE'));
            expect(result[6]).toBe(' ');
            expect(result).toHaveLength(11);
        });

        it('preserves hyphen position', async () => {
            const result = await run(encryptFpe('WIZA-CRONA'));
            expect(result[4]).toBe('-');
            expect(result).toHaveLength(10);
        });

        it('preserves multiple passthrough characters', async () => {
            const result = await run(encryptFpe('ANNE-MARIE SMITH'));
            expect(result[4]).toBe('-');
            expect(result[10]).toBe(' ');
            expect(result).toHaveLength(16);
        });
    });

    describe('normalisation', () => {
        it('uppercases lowercase input', async () => {
            const lower = await run(encryptFpe('john'));
            const upper = await run(encryptFpe('JOHN'));
            expect(lower).toBe(upper);
        });

        it('trims leading and trailing whitespace', async () => {
            const trimmed   = await run(encryptFpe('JOHN'));
            const untrimmed = await run(encryptFpe('  JOHN  '));
            expect(trimmed).toBe(untrimmed);
        });

        it('handles empty string', async () => {
            const result = await run(encryptFpe(''));
            expect(result).toBe('');
        });
    });

    describe('determinism', () => {
        it('same input always produces the same output', async () => {
            const first  = await run(encryptFpe('SMITH'));
            const second = await run(encryptFpe('SMITH'));
            expect(first).toBe(second);
        });

        it('different values produce different output', async () => {
            const a = await run(encryptFpe('JOHN'));
            const b = await run(encryptFpe('JANE'));
            expect(a).not.toBe(b);
        });

        it('different keys produce different output', async () => {
            const otherSecret = (
                effect:Effect.Effect<string, Error, Secrets>,
            ): string => 
                Effect.runSync(
                    Effect.provideService(effect, Secrets, {
                        key: Redacted.make('0123456789ABCDEF0123456789ABBBCD'),
                        tweak: Redacted.make('test-tweak'),

                    } as unknown as Secrets
                )
                )
            const a = await run(encryptFpe('JOHN'));
            const b = otherSecret(encryptFpe('JOHN'))
            
            expect(a).not.toBe(b);
        });

        it('pins output against regression', async () => {
            expect(await run(encryptFpe('JOHN'))).toMatchSnapshot();
        });
    });

    describe('error handling', () => {
        it('fails for digits', async () => {
            await expect(run(encryptFpe('JOHN1'))).rejects.toThrow();
        });

        it('fails for special characters not in alphabet', async () => {
            await expect(run(encryptFpe('TEST@'))).rejects.toThrow();
        });
    });
});