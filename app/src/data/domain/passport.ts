import {Model} from '@effect/sql';
import {id, getOption,get} from '@fp-ts/optic';
import { Schema } from 'effect';

import { Meta } from './meta.js'
import { DefinitionGender, DefinitionImageType, DefinitionReferenceType } from './definition.js';

const DataItem = Schema.Struct({
  dataItem: Schema.String,
  dataItemId:DefinitionReferenceType
});

const DataItem_ = id<typeof DataItem.Type>();

const Image =  Schema.Struct({
 type:DefinitionImageType,
 imageKey: Schema.optionalWith(Schema.String. {as:'Option'})
});

const Image_ = id<typeof Image.Type>();

const Passport = Schema.Struct({
    type:DefinitionReferenceType,
    nationalityStatus: DefinitionReferenceType,
    surname: Schema.NonEmptyString,
    forenames: Schema.optionalWith(Schema.NonEmptyString, {as: 'Option'}),
    gender: Schema.optionalWith(DefinitionGender, {as: 'Option'}),
    mrz: Schema.optionalWith(Schema.NonEmptyString, {as: 'Option'}),
    dataItems: Schema.optionalWith(Schema.Array(DataItem), {as: 'Option'}),
    images: Schema.optionalWith(Schema.Array(Image), {as: 'Option'}),
});

const Passport_ = id<typeof Passport.Type>();

const PassportSearch = Schema.Struct({
    'passport.surname': Schema.NonEmptyString,
    'passport.passportNumber': Schema.optionalWith(Schema.Number, {
        as:'Option'
    }),
    'passport.forenames':Schema.optionalWith(Schema.NonEmptyString, {
        as:'Option'
    }),
    'passport.address.line1': Schema.optionalWith(Schema.String, {
        as: 'Option'
    }),
    'passport.address.line2': Schema.optionalWith(Schema.String, {
        as: 'Option'
    }),
    'passport.address.line3': Schema.optionalWith(Schema.String, {
        as: 'Option'
    }),
    'passport.address.postcode': Schema.optionalWith(Schema.String, {
        as: 'Option'
    }),
    'passport.address.county': Schema.optionalWith(Schema.String, {
        as: 'Option'
    }),
});

class PassportModel extends Model.Class<PassportModel>('Passport')({
    passport_id: Model.Generated(Schema.NonEmptyString),
    meta: Schema.optionalWith(Meta, {nullable:true}),
    search: Schema.optionalWith(PassportSearch, {nullable:true, as:'Option'}),
    domain: Schema.Struct({
        passport: Passport
    })
}) {}

const PassportModel_ = id<typeof PassportModel.Type>();
const passport_ = id<Omit<typeof PassportModel.Type, 'search'>>()
.at('domain')
.at('passport')
.some();

export {Passport, PassportModel}