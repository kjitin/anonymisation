import { Effect, Layer } from "effect";
import { ApplicationLayer } from "./service/db/domain/application.js";
import { PassportLayer } from "./service/db/domain/passport.js";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Encryption } from "./service/encryption.js";
import { Secrets } from "./service/secrets.js";
import { Rule } from "./service/rule.js";

const LiveLayer = Layer.mergeAll(
    ApplicationLayer,
    PassportLayer
);

const main = ():void =>
    NodeRuntime.runMain(
        app.pipe(
            Effect.provide(Encryption.Default),
            Effect.provide(Secrets.Default),
            Effect.provide(Rule.Default),
            Effect.provide(LiveLayer),
            Effect.provide(NodeContext.layer),
        ),
    );
   
export {main};    