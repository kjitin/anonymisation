import type {Application } from "../domain/application.js"
import { EncryptionMethod, EncryptionStruct } from "../encryption.js"


const ApplicationRule = EncryptionStruct<typeof Application.Type>()({
    applicant: EncryptionStruct<(typeof Application.Type)['applicant']>()({
        forenames: EncryptionMethod.String,
        surname: EncryptionMethod.String,
        emailAddress: EncryptionMethod.String,
    }),
});

export {ApplicationRule};