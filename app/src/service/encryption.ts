import { Effect } from "effect";
import { Secrets } from "./secrets.js";
import { fpeString,hexByteString } from "../data/encryption/fpe/string.js";

class Encryption extends Effect.Service<Encryption>()(
    'Service/Encryption', {
        effect: Effect.gen(function* () {
            
            return {
                FPE:(value: string): Effect.Effect<string, Error, Secrets> =>
                Effect.gen(function* () {
                    const { key, tweak } = yield* Secrets;
                    return yield* Effect.try({
                        try: () => fpeString(
                            hexByteString(key),
                            new TextEncoder().encode(tweak),
                            value
                        ),
                        catch: error => new Error(`FPE encryption failed: ${error}`),
                    })
                }),
                EMAIL:(a: string): Effect.Effect<string, Error, never> =>
                Effect.succeed(`${a}_email`),
                TEXT:(a: string): Effect.Effect<string, Error, never> =>
                    Effect.succeed(`${a}_text`)             
                
            }
        })
    }) {}
    
    export { Encryption };