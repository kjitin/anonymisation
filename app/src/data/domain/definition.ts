import {id } from '@fp-ts/optic';
import { Schema } from 'effect';

const DefinitionAddress = Schema.Struct({
    line1: Schema.optionalWith(Schema.String, { as: 'Option'}),
    line2: Schema.optionalWith(Schema.String, { as: 'Option'}),
    line3: Schema.optionalWith(Schema.String, { as: 'Option'}),
    county: Schema.optionalWith(Schema.String, { as: 'Option'}),
    postcode: Schema.optionalWith(Schema.String, { as: 'Option'}),
    country: Schema.optionalWith(Schema.String, { as: 'Option'}),
});

const DefinitionAddress_ = id<typeof DefinitionAddress.Type>();

const DefinitionGender = Schema.Literal('M', 'F');

const DefinitionImageType = Schema.Literal(
    'A',
    'NS',
    'P',
    'SA'
);

const DefinitionReferenceType = Schema.Struct({
    code:Schema.NonEmptyString,
    description: Schema.optionalWith(Schema.String, {as: 'Option'})
});

const DefinitionReferenceType_ = id<typeof DefinitionReferenceType.Type>();

export { DefinitionAddress, DefinitionAddress_,DefinitionGender,DefinitionImageType,DefinitionReferenceType,DefinitionReferenceType_}