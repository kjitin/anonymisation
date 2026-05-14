import { Effect } from "effect";
import { Secrets } from "./secrets.js";
import { encryptFpe } from "../data/encryption/fpe/string.js";

class Encryption extends Effect.Service<Encryption>()(
    'Service/Encryption', {
        effect: Effect.gen(function* () {
            
            return {
                FPE: encryptFpe as (
                    a: string
                ) => Effect.Effect<string,Error, Secrets>,
                EMAIL:(a: string): Effect.Effect<string, Error, never> =>
                Effect.succeed(`${a}_email`),
                TEXT:(a: string): Effect.Effect<string, Error, never> =>
                    Effect.succeed(`${a}_text`)             
                
            }
        })
    }) {}
    
    export { Encryption };