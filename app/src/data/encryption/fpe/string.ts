import { FF1 } from '@noble/ciphers/ff1.js'
import { Secrets } from '../../../service/secrets.js';
import { Effect, Redacted } from 'effect';

const STRING_ALPHABET=  "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
const PASSTHROUGH =  new Set([' ', '-']);

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
            catch: error => new Error(),
       })
    })

const hexByteString =(hex: string) =>
    Uint8Array.from(Buffer.from(hex, 'hex'));

const fpeString = (key:Uint8Array, tweak: Uint8Array, value:string) => {
    const chars:string[]  = value? Array.from(value.toUpperCase().trim()): [];
    const passthroughPosition = new Map<number, string>();
    const toEncrypt:string[] = []

    chars.forEach((c, i) => {
        if(PASSTHROUGH.has(c)) {
            passthroughPosition.set(i, c);
        } else {
            const idx = STRING_ALPHABET.indexOf(c);
            if (idx === -1) throw new Error(`Invalid character: ${c}`);
            toEncrypt.push(c);
        }
    })

    const indices = toEncrypt.map(c => STRING_ALPHABET.indexOf(c));
    const encryptedChars = FF1(STRING_ALPHABET.length, key, tweak)
    .encrypt(indices)
    .map(i => STRING_ALPHABET[i]);

    let encryptedIndex = 0;
    return chars.map((_, i) => 
    passthroughPosition.has(i)? passthroughPosition.get(i)! : encryptedChars[encryptedIndex++]
   ).join('');
}

export { encryptFpe };