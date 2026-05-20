import type { PolyOptional} from '@fp-ts/optic';
import { Effect, Either, pipe} from 'effect';

const modifyEffect =
<S,T, A,B>(o: PolyOptional<S,T,A,B>) =>
<E,R>(f: (a:A) => Effect.Effect<B,E,R>) =>
(s: S): Effect.Effect<T,E,R> =>
pipe(
 0.getOptic(s),
Either.match({
   onLeft: ([_,t]) => Effect.succeed(t),
onRight:a => 
  Effect.map(f(a), b =>
   Either.getOrElse(o.setOptic(b)(s), ([_, t]) => t),
),

}),

);

export {modifyEffect} ;