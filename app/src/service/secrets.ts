import { Effect } from "effect";
import { Env } from "./env.js";

class Secrets extends Effect.Service<Secrets>()('Service/Secrets', {
    effect: Effect.gen(function* () {
        const { fpe: { key, tweak } } = yield* Env;
        return {
            fpe: { key, tweak }
        };
    })
}) {}

export { Secrets };