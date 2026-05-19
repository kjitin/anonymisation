import {Model} from '@effect/sql';
import { getOption, id } from '@fp-ts/optic';
import { Schema } from 'effect';

import {Meta} from './meta.js'

const Applicant = Schema.Struct({
    forenames: Schema.optionalWith(Schema.NonEmptyString, {as: 'Option'}),
    surname: Schema.optionalWith(Schema.NonEmptyString,{as: 'Option'}),
    emailAddress: Schema.optionalWith(Schema.NonEmptyString,{as: 'Option'}),
});

const Applicant_ = id<typeof Applicant.Type>();

const Application = Schema.Struct({
    applicant:  Schema.optionalWith(Applicant,{as: 'Option'}),
});

const Application_ =id<typeof Application.Type>();

const ApplicationSearch = Schema.Struct({
    'application.applicant.forenames': Schema.optionalWith(
        Schema.NonEmptyString,
        {as: 'Option'},
    ),
    'application.applicant.surname': Schema.optionalWith(
        Schema.NonEmptyString,
        {as: 'Option'}
    ),
})
class ApplicationModel extends Model.Class<ApplicationModel>('Application')({
    application_id: Model.Generated(Schema.NonEmptyString),
    meta: Schema.optionalWith(Meta, {nullable:true}),
    search: Schema.optionalWith(ApplicationSearch, {
        nullable: true,
        as: 'Option'
    }),
    domain: Schema.Struct({
        application: Application
    })
}) {}

const ApplicationModel_ = id<typeof ApplicationModel.Type>();

const application_ = id<Omit<typeof ApplicationModel.Type, 'search'>>()
.at('domain')
.at('application')
.some();

const deriveSearch = (
    app:typeof Application.Type,
): typeof ApplicationSearch.Type => ({
    'application.applicant.forenames': getOption(
        Application_.at('applicant').some().at('forenames').some(),
    )(app),
    'application.applicant.surname':getOption(
        Application_.at('applicant').some().at('forenames').some(),
    )(app),
});

export {Applicant, Applicant_, Application, Application_, ApplicationModel, deriveSearch}