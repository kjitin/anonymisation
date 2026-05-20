import { Effect } from 'effect';
import {makeBy} from 'effect/Array';

import { Random} from '@/service/random.js'

const A = 'A'.codePointAt(0)??0;
const AZ = makeBy(26, i => String.fromCodePoint(A+i));
const a = 'a'.codePointAt(0)??0;
const az = makeBy(26, i => String.fromCodePoint(a+i));
const DIG = makeBy(10, i => `${i}`);

const WS = /\s/;

const hexToBytestring = (hex:string) =>
Uint8Array.from(Buffer.from(hex, 'hex'));

const mapItem = <A>(
  out: A[],
fallback: A,
current:A,
allowCollision = false,
) : Effect.Effect<A, never, Random> =>
Effect.gen(function* () {
const values = allowCollision ? out: out.filter(n => n!== current);
const i = yield* Random.nextIntBetween(0, values.length);
return values.at(i)?? fallback;

});

export { AZ, az, DIG, hexToBytestring, mapItem, WS };