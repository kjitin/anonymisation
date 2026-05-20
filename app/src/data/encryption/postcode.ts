import { Effect } from 'effect';

import type { Random} from '@/service/random.js';
import { AZ, DIG, mapItem, WS } from '@/util/encryption.js';

const CHARS = DIG.concat(AZ);

const encryptPostcode =(input:string): Effect.Effect<string, never, Random> =>
 Effect.reduceRight(
  input.split(''),
 {out: '', transformed:0},
 (c, { out, transformed}) =>
   transformed <3 && !c.match(WS)
    ? mapItem(CHARS, '', c.toUpperCase()).pipe(
       Effect.map(cn =>({
         out: `${cn}${out}`,
 transformed: transformed +1,
      
    })),  
   )
: Effect.succeed({ out: `${c}${out}`, transformed}),
).pipe(Effect.map((${out}) => out));


export {encryptPostcode};