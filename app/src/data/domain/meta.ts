import { Schema } from "effect"


const Meta = Schema.Struct({
    action:Schema.Literal('C', 'D', 'U'),
    createdBy: Schema.NonEmptyString
})

export {Meta};