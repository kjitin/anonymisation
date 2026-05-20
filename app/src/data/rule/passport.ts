import type {Passport } from "../domain/passport.js"
import { EncryptionMethod, EncryptionStruct,EncryptionOptional } from "../encryption.js"


const PassportRule = EncryptionStruct<typeof Passport.Type>()({
    passportNumber:  EncryptionOptional(EncryptionMethod.Number),
    forenames: EncryptionOptional(EncryptionMethod.String),
    surname: EncryptionOptional(EncryptionMethod.String),
});

export {PassportRule};