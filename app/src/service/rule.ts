import { Effect } from "effect";
import { FileSystem, Path } from "@effect/platform";
import { decodeUnknown, parseJson, type Schema } from "effect/Schema";
import type { ApplicationModel } from "../data/domain/application.js";
import type { PassportModel } from "../data/domain/passport.js";
import {ApplicationRule } from "../data/rule/application.js"
import {PassportRule } from "../data/rule/passport.js"
import { Encryption } from "./encryption.js";
import { Env } from "./env.js";

class Rule extends Effect.Service<Rule>() (
    'Service/Rule', {
        accessors:true,
        effect: Effect.gen(function* () {
            const fs = yield* FileSystem.FileSystem;
            const path = yield* Path.Path;
            const {
                config: {base, rule},
            } = yield* Env;
            
            const readRule = <I, O, R>(domain:string, schema:Schema<I,O,R>) =>
            fs.
              readFileString(path.join(base,domain), 'utf-8')
              .pipe(
                  Effect.flatMap(
                      decodeUnknown(parseJson(schema), {onExcessProperty: 'error'})
                  ),
              );
              
              const applicationRule = yield* readRule(rule.application, ApplicationRule);
              const passportRule = yield* readRule(rule.passport, PassportRule);
              
              const application =({
                  domain,
                  ...db
              }: ApplicationModel): Effect.Effect<ApplicationModel, Error, Encryption> =>
              applicationRule(domain.application).pipe(
                  Effect.map(application => ({ ...db, domain: { application}}))
              );
              
              const passport =({
                  domain,
                  ...db
              }: PassportModel): Effect.Effect<PassportModel, Error, Encryption> =>
              passportRule(domain.passport).pipe(
                  Effect.map(passport => ({ ...db, domain: { passport}}))
              );
              
              return {
                  application,
                  passport
              };
        }),
    }) {}
    
    export {Rule};