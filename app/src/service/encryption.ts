import { Effect } from "effect";
import { Env } from '../service/env.js'
class Encryption extends Effect.Service<Encryption>()(
    'Service/Encryption', {
        effect: Effect.gen(function* () {
            const {
                fpe: {key, tweak},
            } = yield* Env;
            
            
            return {
                FPE:(value: string): Effect.Effect<string, Error, never> =>
                Effect.gen(function* () {
                    yield* Effect.log(
                        `Encrypting ${value} with key ${key} tweak ${tweak}`,
                    );
                    return `${value}_fpe`;
                }),
                EMAIL:(a: string): Effect.Effect<string, Error, never> =>
                Effect.succeed(`${a}_email`)            
                
            }
        })
    }) {}
    
    export { Encryption };