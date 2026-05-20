import { Effect } from "effect";
import { Secrets } from "./secrets.js";
import { encryptFpe } from "../data/encryption/fpe/string.js";
import { encryptPostcode } from "../data/encryption/postcode.js";
import { Random } from "./random.js";
import { encryptFpeNumber } from "../data/encryption/fpe/number.js";
import { encryptDate } from "../data/encryption/date.js";

class Encryption extends Effect.Service<Encryption>()(
    'Service/Encryption', {
        effect: Effect.gen(function* () {
            
            return {
                FPE: encryptFpe,
                EMAIL:(a: string): Effect.Effect<string, Error, never> =>
                Effect.succeed(`${a}_email`),
                TEXT:(a: string): Effect.Effect<string, Error, never> =>
                    Effect.succeed(`${a}_text`),
                POSTCODE: encryptPostcode as (
                    a: string,
                ) => Effect.Effect<string, Error,Random|Secrets>,
                FPE_PN: encryptFpeNumber,
                DATE: encryptDate            
                
            }
        })
    }) {}
    
    export { Encryption };