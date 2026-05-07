import { Effect } from "effect";
import { Env } from '../service/env.js'
import { Secrets } from "./secrets.js";
class Encryption extends Effect.Service<Encryption>()(
    'Service/Encryption', {
        effect: Effect.gen(function* () {
            return {
                FPE: (value: string): Effect.Effect<string, Error, Secrets> =>
                    Secrets.pipe(
                        Effect.flatMap(({ fpe: { key, tweak } }) =>
                            Effect.gen(function* () {
                                yield* Effect.log(
                                    `Encrypting ${value} with key ${key} tweak ${tweak}`,
                                );
                                return `${value}_fpe`;
                            }),
                        ),
                    ),
                EMAIL: (a: string): Effect.Effect<string, Error, never> =>
                    Effect.succeed(`${a}_email`),
                TEXT: (a: string): Effect.Effect<string, Error, never> =>
                    Effect.succeed(`${a}_text`),
            };
        }),
    },
) {}

export { Encryption };