//import '@babel/polyfill'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import hapiRouter from 'hapi-router'
import Pack  from '../package'
import Handlebars from 'handlebars'
import HandlebarsExtendBlock from 'handlebars-extend-block'
import dotEnv from 'dotenv'

// import './database'

dotEnv.config()

const internals = {}
// const swaggerOptions = {
//     info: {
//         title: 'API Documentation',
//         version: Pack.version,
//     }
// }

internals.server = async () => {
    try {
        let server = await Hapi.server({
            host: '0.0.0.0',
            port: process.env.SERVER_PORT || 3000,
            // cache: {
            //     provider: {
            //         constructor: catboxRedis,
            //         options: {
            //             partition: 'movitroniaservercookies',
            //             host: process.env.REDIS_HOST || '127.0.0.1',
            //             port: 6379,
            //             password: process.env.REDIS_PASSWORD,
            //             db: 11
            //         }
            //     }
            // },
            routes: {
                payload: {
                    maxBytes: 100485760,
                },
                cors: {
                    origin: ['*'],
                    credentials: true
                },
                validate: {
                    failAction: (request, h, err) => {
                        console.error('ValidationError:', err.message)
                        throw Boom.badRequest(err)
                    }
                }
            }
        })


        await server.register([
            Inert,
            Vision,
            // hapiCookie,
            // hapiAuthJWT,
            // {
            //     plugin: HapiSwagger,
            //     options: swaggerOptions
            // },
            // {
            //     plugin: hapiRedis,
            //     options: {
            //         settings: {
            //             port: 6379,
            //             host: process.env.REDIS_HOST || '127.0.0.1',
            //             family: 4,
            //             password: process.env.REDIS_PASSWORD,
            //             db: 11
            //         },
            //         decorate: true
            //     }
            // }
        ])

        // const cache = server.cache({
        //     segment: 'sessions',
        //     expiresIn: moment.duration(24, 'hours').asMilliseconds()
        // })

        // server.app.cache = cache

        // server.auth.strategy('session', 'cookie', {
        //     cookie: {
        //         name: 'sid-movitronia',
        //         password: process.env.SECRET_KEY,
        //         isSecure: false,
        //     },
        //     redirectTo: '/login',
        //     validateFunc: async (request, session) => {
        //         const cached = await cache.get(session.sid)
        //         const out = {
        //             valid: !!cached
        //         }

        //         if (out.valid) {
        //             out.credentials = cached.account
        //         }

        //         return out
        //     }
        // })

        // server.auth.strategy('jwt', 'jwt', {
        //     key: process.env.SECRET_KEY,          // Never Share your secret key
        //     validate: async function (decoded, request) {
        //         // do your checks to see if the person is valid

        //         if (decoded.aud && decoded.aud == 'mobileuser') { // esto en caso de que ya esté autentificado
        //             let tokenredis = await request.redis.client.hget('movitroniamobile', decoded.iss)

        //             if (!tokenredis) {
        //                 return { isValid: false }
        //             } else {
        //                 return { isValid: true }
        //             }
        //         }

        //         if(decoded.aud && decoded.aud == 'restorepassword') {
        //             let tokenredis = await request.redis.client.get(`movitroniarestorepassword-${decoded.id}`)

        //             if (!tokenredis) {
        //                 return { isValid: false }
        //             } else {
        //                 return { isValid: true }
        //             }
        //         }
        //     },            // validate function defined above
        //     verifyOptions: { algorithms: [ 'HS512' ] } 
        // })

        // server.auth.default('session')

        await server.register([
            {
                plugin: hapiRouter,
                options: {
                    routes: (!process.env.STATUS || process.env.STATUS === 'dev') ? 'src/routes/**/*.routes.js' : 'dist/routes/**/*.routes.js'
                }
            }
        ])

        await server.views({
            engines: {
                html: {
                    module: HandlebarsExtendBlock(Handlebars),
                    isCached: false
                }
            },
            path: 'views',
            layoutPath: 'views/layout',
            layout: 'default'
        })

        await server.initialize()
        await server.start()
        console.log('Server running on %s', server.info.uri)

        process.on('unhandledRejection', (err) => {
            console.log(err)
            process.exit(1)
        })

    } catch (error) {
        console.log(error)
    }
}

internals.start = async function() {
    try {
        await internals.server()
    }
    catch (error) {
        console.error(error.stack)
        process.exit(1)
    }
}

internals.start()