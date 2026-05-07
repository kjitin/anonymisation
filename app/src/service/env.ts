import { Config,Schema } from "effect";
import { DomainName } from "../data/domain.js";

const client = Config.all({
    rds: Config.nested(
    Config.all({
        database: Config.string('DATABASE'),
        host: Config.string('HOST'),
        port: Config.number('PORT'),
        username: Config.string('USERNAME')
    }),
    'RDS'
),
});

const Env = Config.all({
    src: Config.nested(client, 'SRC'),
    dst: Config.nested(client, 'DST'),

    domain: Schema.Config('DOMAIN', DomainName),

    fpe: Config.nested(
        Config.all({
            key: Config.string('KEY'),
            tweak: Config.string('TWEAK'),
        }),
        'FPE'
    ),

    config: Config.nested(
        Config.all({
            base: Config.string('BASE'),
            caFile: Config.string('CA_FILE'),
            rule: Config.nested(
                Config.all({
                    application: Config.string('APPLICATION'),
                    passport: Config.string('PASSPORT')
                }),
                'RULE',
            ),
        }),
        'CONFIG'
    )

});

export {Env};