import { FF1 } from '@noble/ciphers/ff1.js'
import { Secrets } from '../../../service/secrets.js';
import { Effect, Redacted } from 'effect';
import { DIG, hexToBytestring } from '@util/encryption.js'

const FORBIDDEN_LEADING_DIGITS = new Set([0,9]);

const encryptFpeNumber = (value:number): Effect.Effect<number, Error, Secrets> => 
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

const toDigit = (value:number): [number, ..number[]] => {
  const arr = String(value).split('').map(d => DIG.indexOf(d));
  if(arr.length =0) throw new Error('Invalid number');
  retutn arr as [number, ...number[]];

}

const fpeNumber = (key:Uint8Array, tweak: Uint8Array, value:number):number => {
    if(!Number.isInteger(value) || value <0) throw new Error('Invalid number');
   const encryptedValue = FF1(DIG.length, key, tweak);
    let indices = toDigit(value);

do {
   indices = encryptedValue.encrypt(indices) as [number, ...number[]];
 } while(FORBIDDEN_LEADING_DIGITS.has(Number(DIG[indices[0]])));

  return Number(indices.map(d => DIG[d]).join(''));
}

export { encryptFpeNumber };