import { Effect, Schema, Layer } from "effect";
import { ClientDst, ClientSrc } from "../client.js";
import { PassportModel} from '../../../data/domain/passport.js'
import { SqlSchema } from "@effect/sql";

class PassportSrc extends Effect.Service<PassportSrc>()(
    'Service/Db/Domain/PassportSrc',
    {
        accessors: true,
        scoped: Effect.gen(function* () {
            const sql = yield* ClientSrc;

            return {
                getAll: () => 
                    sql`select passport_id, meta, search, domain from pp.passport`.pipe(
                        Effect.flatMap(
                            Schema.decodeUnknown(Schema.Array(PassportModel)),
                        ),
           };
        }),
    },
) {}

class PassportDst extends Effect.Service<PassportDst>()(
    'Service/Db/Domain/PassportDst',
    {
        accessors: true,
        scoped: Effect.gen(function* () {
            const sql = yield* ClientDst;

            return {
                insert: SqlSchema.findOne({
                    Request: PassportModel,
                    Result: PassportModel.select.pick('passport_id'),
                    execute: ps => sql `
                       insert into pp.application(passport_id, meta, search, domain)
                       values (${ps.passport_id}
                               , ${ps.meta}
                               , ${ps.search}
                               , ${ps.domain}
                           ) on conflict(passport_id) do nothing
                           returning passport_id;
                    `
                })
            }
        }),
    },
){}

const PassportLayer = Layer.mergeAll(
    PassportSrc.Default,
    PassportDst.Default,
).pipe(Layer.provide(ClientSrc.Default), Layer.provide(ClientDst.Default));

export { PassportDst, PassportLayer, PassportModel, PassportSrc };