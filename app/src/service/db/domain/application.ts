import { Effect, Schema } from "effect";
import { ClientDst, ClientSrc } from "../client.js";
import { ApplicationModel} from '../../../data/domain/application.js'
import { SqlSchema } from "@effect/sql";
import { Layer } from "effect";

class ApplicationSrc extends Effect.Service<ApplicationSrc>()(
    'Service/Db/Domain/ApplicationSrc',
    {
        accessors: true,
        scoped: Effect.gen(function* () {
            const sql = yield* ClientSrc;

            return {
                getAll: () => 
                    sql`select application_id, meta, search, domain from pp.application`.pipe(
                        Effect.flatMap(
                            Schema.decodeUnknown(Schema.Array(ApplicationModel)),
                        ),
           };
        }),
    },
) {}

class ApplicationDst extends Effect.Service<ApplicationDst>()(
    'Service/Db/Domain/ApplicationDst',
    {
        accessors: true,
        scoped: Effect.gen(function* () {
            const sql = yield* ClientDst;

            return {
                insert: SqlSchema.findOne({
                    Request: ApplicationModel,
                    Result: ApplicationModel.select.pick('application_id'),
                    execute: app => sql `
                       insert into pp.application(application_id, meta, search, domain)
                    `
                })
            }
        }),
    },
){}


const ApplicationLayer = Layer.mergeAll(
    ApplicationSrc.Default,
    ApplicationDst.Default,
).pipe(Layer.provide(ClientSrc.Default), Layer.provide(ClientDst.Default));

export { ApplicationDst, ApplicationSrc, ApplicationLayer, ApplicationModel};