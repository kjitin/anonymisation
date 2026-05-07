import {Model} from '@effect/sql';
import { Schema } from 'effect';

import {Meta} from './meta.js'

const Applicant = Schema.Struct({
    forenames: Schema.NonEmptyString,
    surname: Schema.NonEmptyString,
    emailAddress: Schema.NonEmptyString,
});

const Application = Schema.Struct({
    applicant: Applicant,
});

class ApplicationModel extends Model.Class<ApplicationModel>('Application')({
    application_id: Model.Generated(Schema.NonEmptyString),
    meta: Schema.optionalWith(Meta, {nullable:true}),
    search: Schema.Struct({
        'application.applicant.forenames': Schema.NonEmptyString
    }),
    domain: Schema.Struct({
        application: Application
    })
}) {}

export {Application, ApplicationModel}