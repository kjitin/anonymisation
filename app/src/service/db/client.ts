import { Effect, Redacted } from "effect";
import { number } from "effect/Equivalence";
import { FileSystem, Path } from "@effect/platform";
import { Signer } from "@aws-sdk/rds-signer";
import { PgClient } from "@effect/sql-pg";
import { Reactivity } from "@effect/experimental";
import { Env } from "../env.js";

const make =(
    { base, caFile } : {base :string; caFile: string },
    {
        database,
        host,
        port,
        username,
    }: {
        database: string;
        host: string;
        port: number;
        username: string;
    },
) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const path = yield* Path.Path;

        const [ca, password] = yield* Effect.all([
            fs.readFileString(path.join(base, caFile), 'utf-8'),
            Effect.tryPromise({
                try: () =>
                    new Signer({ hostname: host, port, username}).getAuthToken(),
                catch: err => new Error(`unable to sign rds token:${err}`), 
            }).pipe(Effect.map(Redacted.make)),
        ]);

        return yield* PgClient.make({
            host,
            port,
            database,
            username,
            password,
            ssl: { rejectUnauthorized: false, ca},
        });            
        }).pipe(Effect.provide(Reactivity.layer));

        class ClientSrc extends Effect.Service<ClientSrc>()('Service/Db/ClientSrc', {
            scoped: Effect.gen(function* () {
                const { src: { rds }, config } = yield* Env;
                return yield* make(config, rds);
            })
        }) {}

        class ClientDst extends Effect.Service<ClientDst>()('Service/Db/ClientDst', {
            scoped: Effect.gen(function* () {
                const { src: { rds }, config } = yield* Env;
                return yield* make(config, rds);
            })
        }) {}

export {ClientDst, ClientSrc};
