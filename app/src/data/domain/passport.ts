import {Model} from '@effect/sql';
import { Schema } from 'effect';

import { Meta } from './meta.js'


const Passport = Schema.Struct({
    surname: Schema.NonEmptyString,
});

class PassportModel extends Model.Class<PassportModel>('Passport')({
    passport_id: Model.Generated(Schema.NonEmptyString),
    meta: Schema.optionalWith(Meta, {nullable:true}),
    search: Schema.Struct({
        'passport.status': Schema.NonEmptyString
    }),
    domain: Schema.Struct({
        passport: Passport
    })
}) {}

export {Passport, PassportModel}