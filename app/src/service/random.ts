import { randomInt } from 'node:crypto';

import {Effect} from 'effect';

class Random extends Effect.Service<Random>()('Service/Random', {
  accessors:true,
   succeed: {
     next: Effect.sync(() =>
       randomInt(Number.MIN_SAFE_INTEGER, Number,MAX_SAFE_INTEGER),
 ),
  nextIntBetween: (min: number, max: number) =>
    Effect.sync(() => randomInt(min, max)),
 
  },
}) {}

export {Random};