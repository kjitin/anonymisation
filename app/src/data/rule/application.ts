import { emailAddress } from "effect/FastCheck";
import type {Application,Applicant } from "../domain/application.js"
import { EncryptionMethod, EncryptionOptional, EncryptionStruct } from "../encryption.js"


const ApplicationRule = EncryptionStruct<typeof Application.Type>()({
    applicant: EncryptionOptional(
        EncryptionStruct<typeof Applicant.Type>()({
            forenames: EncryptionOptional(EncryptionMethod.String),
            emailAddress: EncryptionOptional(EncryptionMethod.String),
            surname: EncryptionOptional(EncryptionMethod.String),
        })
    ),
});

export {ApplicationRule};