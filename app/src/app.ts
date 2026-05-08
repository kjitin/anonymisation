import type {SqlError} from '@effect/sql';

import {DomainName} from './data/domain.js'
import { Effect, Either, Match, type Option } from 'effect';
import { Encryption } from './service/encryption.js';
import { Secrets } from './service/secrets.js';
import { Rule } from './service/rule.js';
import { ApplicationDst, ApplicationSrc} from './service/db/domain/application.js'
import { PassportDst, PassportSrc } from './service/db/domain/passport.js';
import { separate } from 'effect/Chunk';
import { Env } from './service/env.js';
import type { ConfigError } from 'effect/ConfigError';

const app: Effect.Effect<
void,
Error| ConfigError | SqlError.SqlError,
|Encryption
|Secrets
| Rule
| ApplicationSrc
| ApplicationDst
| PassportSrc
| PassportDst
> = Effect.gen(function* () {
    const { domain }= yield* Env;
    yield* Effect.log('encrypting domain:', domain);

    const res = yield* Match.type<typeof DomainName.Type>().pipe(
        Match.when('application', () =>
            processWith(ApplicationSrc, ApplicationDst, Rule.application),
        ),
        Match.when('passport', () =>
            processWith(PassportSrc, PassportDst, Rule.passport),
        ),
        Match.exhaustive,
    )(domain);
    const [conflicted, inserted] = separate(res);
    yield* Effect.log('conflicted ', conflicted);
    yield* Effect.log('inserted ', inserted);
});

const processWith = <A, B, SE, SR, DE, DR, RE, RR>(
    source: { getAll:() => Effect.Effect<readonly A[], SE,SR> },
    destination: { insert: (a: A) => Effect.Effect<Option.Option<B>, DE,DR> },
    rule: (a:A) => Effect.Effect<A, RE, RR>,
):Effect.Effect<Either.Either<B,A>[], SE| DE| RE, SR|DR|RR> =>
    Effect.gen(function* () {
        const rows = yield* source.getAll();
        return yield* Effect.forEach(
            rows,
            row =>
                Effect.gen(function* () {
                    const encrypted = yield* rule(row);
                    const res = yield* destination.insert(encrypted);
                    return Either.fromOption(res, () => row);
                }),
                {concurrency: 1},
        );
    });

export {app};