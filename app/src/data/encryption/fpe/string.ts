import { FF1 } from '@noble/ciphers/ff1.js'

const STRING_ALPHABET=  "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
const PASSTHROUGH =  new Set([' ', '-']);

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

export { fpeString, hexByteString };