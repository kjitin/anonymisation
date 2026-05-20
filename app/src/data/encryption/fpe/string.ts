import { FF1 } from '@noble/ciphers/ff1.js'
import { Secrets } from '../../../service/secrets.js';
import { Effect, Redacted } from 'effect';
import { AZ, hexToBytestring } from '@util/encryption.js'

const expectedChars = AZ.concat(' ', '-', "'");

const encryptFpe = (value:string): Effect.Effect<string, Error, Secrets> => 
    Effect.gen(function* () {
       const {key, tweak } = yield* Secrets;

       return yield* Effect.try({
        try: () =>
            fpeString(
                hexByteString(Redacted.value(key)),
            new TextEncoder().encode(Redacted.value(tweak)),
            value,            
            ),
            catch: error => new Error(`FPE encryption failed: ${error}`),
       })
    })


const fpeString = (key:Uint8Array, tweak: Uint8Array, value:string) => {
    const chars:string[]  = value? Array.from(value.toUpperCase().trim()): [];
    const passthroughPosition = new Map<number, string>();
    const toEncrypt:string[] = []

    chars.forEach((c, i) => {
        const idx = expectedChars.indexOf(c);
        if(idx === -1) {
            passthroughPosition.set(i, c);
        } else {
            toEncrypt.push(c);
        }
    })

    const indices = toEncrypt.map(c => expectedChars.indexOf(c));
    const encryptedChars = FF1(expectedChars.length, key, tweak)
    .encrypt(indices)
    .map(i => expectedChars[i]);

    let encryptedIndex = 0;
    return chars.map((_, i) => 
    passthroughPosition.has(i)? passthroughPosition.get(i)! : encryptedChars[encryptedIndex++]
   ).join('');
}

export { encryptFpe };