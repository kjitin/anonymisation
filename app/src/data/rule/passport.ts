import type {Passport } from "../domain/passport.js"
import { EncryptionMethod, EncryptionStruct } from "../encryption.js"


const PassportRule = EncryptionStruct<typeof Passport.Type>()({
    passportNumber:  EncryptionMethod.Number,
    forenames: EncryptionMethod.String,
    surname: EncryptionMethod.String
});

export {PassportRule};