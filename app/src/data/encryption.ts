
import { Effect, Option, type Types } from "effect";
import { decodeUnknown, Forbidden, fail, map } from "effect/ParseResult";
import { isUndefined } from "effect/Predicate";
import { toEntries } from "effect/Record";
import {
    declare,
    format,
    Literal,
    partial,
    type Schema,
    Struct,
    Union
} from 'effect/Schema';

import { Encryption } from "../service/encryption.js";

type EncryptionFn = <A, E, R>(a: A) => Effect.Effect<A, E, R>;
const EncryptionAll = Literal('NONE', 'NULL');
const EncryptionDate = Literal('DATE');
const EncryptionNumber = Literal('FPE_PN');
const EncryptionString  = Literal(
'FPE','EMAIL','TEXT','MRZ','CONSTANT_DATA_ITEM','IMAGE',
);
const EncryptionLiteral= Union(EncryptionDate,EncryptionNumber,EncryptionString,);

const allMethod = <A>(): Schema<
(a: A) => Effect.Effect<A|null, Error, Encryption>,
        typeof EncryptionAll.Type
> =>
 declare<
 (a:A) => Effect.Effect<A|null, Error, Encryption>,
    typeof EncryptionAll.Type,
    [typeof EncryptionAll]
>(
    [EncryptionAll],
        {
    decode: item => (input , parseOptions, _ast) =>
    decodeUnknown(item)(input, parseOptions).pipe(
        map (
            name => a =>
            Encryption.pipe(Effect.flatMap(( { [name]: fn }) => fn(a))),
    ),
    ),
    encode: _item => (fn, _parseOptions, ast) =>
    fail(
        new Forbidden(ast, fn, 'Unale to serialise encryption functions'),
    ),
},
{description: `EncryptionMethod<${format(EncryptionAll)}>` },
);

const dateMethod: Schema<
(a: Date) => Effect.Effect<Date, Error, Encryption>,
        typeof EncryptionDate.Type
> =
 declare<
 (a:Date) => Effect.Effect<Date, Error, Encryption>,
    typeof EncryptionDate.Type,
    [typeof EncryptionDate]
>(
    [EncryptionDate],
        {
    decode: item => (input , parseOptions, _ast) =>
    decodeUnknown(item)(input, parseOptions).pipe(
        map (
            name => a =>
            Encryption.pipe(Effect.flatMap(( { [name]: fn }) => fn(a))),
    ),
    ),
    encode: _item => (fn, _parseOptions, ast) =>
    fail(
        new Forbidden(ast, fn, 'Unale to serialise encryption functions'),
    ),
},
{description: `EncryptionMethod<${format(EncryptionDate)}>` },
);

const numberMethod: Schema<
(a: number) => Effect.Effect<number, Error, Encryption>,
        typeof EncryptionNumber.Type
> =
 declare<
 (a:number) => Effect.Effect<number, Error, Encryption>,
    typeof EncryptionNumber.Type,
    [typeof EncryptionNumber]
>(
    [EncryptionNumber],
        {
    decode: item => (input , parseOptions, _ast) =>
    decodeUnknown(item)(input, parseOptions).pipe(
        map (
            name => a =>
            Encryption.pipe(Effect.flatMap(( { [name]: fn }) => fn(a))),
    ),
    ),
    encode: _item => (fn, _parseOptions, ast) =>
    fail(
        new Forbidden(ast, fn, 'Unale to serialise encryption functions'),
    ),
},
{description: `EncryptionMethod<${format(EncryptionNumber)}>` },
);

const stringMethod: Schema<
(a: string) => Effect.Effect<string, Error, Encryption>,
        typeof EncryptionString.Type
> =
 declare<
 (a:string) => Effect.Effect<string, Error, Encryption>,
    typeof EncryptionString.Type,
    [typeof EncryptionString]
>(
    [EncryptionString],
        {
    decode: item => (input , parseOptions, _ast) => 
        decodeUnknown(item)(input, parseOptions).pipe(
        map (
            name => a =>
            Encryption.pipe(Effect.flatMap(( { [name]: fn }) => fn(a))),
    ),
    ),
    encode: _item => (fn, _parseOptions, ast) =>
    fail(
        new Forbidden(ast, fn, 'Unale to serialise encryption functions'),
    ),
},
{description: `EncryptionMethod<${format(EncryptionString)}>` },
);

const EncryptionMethod = {
    All:allMethod,
    Date:dateMethod,
    Number: numberMethod,
    String: stringMethod
};

const EncryptionOptional =  <S, A, E, R>(
    schema: Schema<(a: A) => Effect.Effect<A, E, R>, S>,
): Schema<(a: A| undefined) => Effect.Effect< A| undefined, E, R>, S> =>
    declare<
    (a: A| undefined) => Effect.Effect< A| undefined, E, R>, 
    S, 
    [typeof schema]
    >(
        [schema],
        {
            decode: item => (input,parseOptions,_ast) =>
                decodeUnknown(item)(input,parseOptions).pipe(
                    map(fn => a => (isUndefined(a)? Effect.succeed(a): fn(a))),
                ),
            encode: _item => (fn, _parseOptions, ast) =>
                fail(
                    new Forbidden(ast, fn, 'Unable to serialise lists')),    
                },
                { description: `EncryptionOptional<${format(schema)}>` }
    );


const EncryptionList =  <S, A, E, R>(
    schema: Schema<(a: A) => Effect.Effect<A, E, R>, S>,
): Schema<(a: readonly A[]) => Effect.Effect<readonly A[], E, R>, S> =>
    declare<
    (a:readonly A[]) => Effect.Effect<readonly A[], E, R>, 
    S, 
    [typeof schema]
    >(
        [schema],
        {
            decode: item => (input,parseOptions,_ast) =>
                decodeUnknown(item)(input,parseOptions).pipe(
                    map(fn => a => Effect.all(a.map()x => fn(x))),
                ),
            encode: _item => (fn, _parseOptions, ast) =>
                fail(
                    new Forbidden(ast, fn, 'Unable to serialise lists')),    
                },
                { description: `EncryptionList<${format(schema)}>` }
    );


const EncryptionStruct = <A>() =>
<
 S extends {
    readonly [K in keyof A]: Schema<
    (a: A[K]) => Effect.Effect<A[K], E, R>,
     Schema.Encoded<S[K]>
     >;
 },
 E extends Effect.Effect.Error<ReturnType<Schema.Type<S[keyof A]>>>,
 R extends Effect.Effect.Context<ReturnType<Schema.Type<S[keyof A]>>>,
>(
    fields: S,
): Schema<
(a: A) => Effect.Effect<A, E, R>,
Types.UnionToIntersection<S[keyof A]>,
Schema.Context<S[keyof A]>
> =>
declare<
(a: A) => Effect.Effect<A, E, R>,
Types.UnionToIntersection<S[keyof A]>,
[Struct<S>]
>(
[Struct(fields)],
    {
        decode: item => (input, parseOptions,_ast) =>
        decodeUnknown(partial(item))(input, parseOptions).pipe(
         map(
             struct => a =>
              Effect.reduce(
                  toEntries(struct) as [keyof A, Schema.Type<S[keyof A]>][],
                  a,
                  (b, [key, fn]) =>
                      Option.fromNullable(a[key]).pipe(
                          Option.match({
                              onNone: () => Effect.succeed(b),
                              onSome: x =>
                              fn?.(x as any).pipe(
                                  Effect.map(value => ({
                                      ...b,
                                      [key]: value,
                                  })) as any,
                              ),
                          }),
                      ),
                ),
            ),            
),
encode: _item => (fn, _parseOptions, ast) =>
  fail(
       new Forbidden(ast, fn, 'Unable to serialise structures'),
  ),
},
{ description: `EncryptionStruct<${format(Struct(fields))}>`},
); 

export {
    type EncryptionFn,
    EncryptionList,
    EncryptionLiteral,
    EncryptionMethod,
    EncryptionOptional,
    EncryptionStruct
}