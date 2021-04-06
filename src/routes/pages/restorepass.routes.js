import jwt from 'jsonwebtoken'
import dotEnv from 'dotenv'

dotEnv.config()

export default [
{
    method: ['GET'],
    path: '/restore_password',
    options: {
        auth: {
            mode: 'try'
        },
        handler: (request, h) => {
            if (request.auth.isAuthenticated) return h.redirect('/')

            return h.view('restore-password', {}, { layout: 'no-loged-layout' })
        }
    }
},
{
    method: ['GET'],
    path: '/restore_password_step_2',
    options: {
        auth: 'jwt',
        handler: async (request, h) => {
            try {
                const credentials = request.auth.credentials
                const token = request.auth.token

                // let decoded = jwt.verify(params.restorePasswordToken, process.env.SECRET_KEY)

                // let verifyTokenRedis = await request.redis.client.get(`movitroniarestorepassword-${decoded.id}`)

                // if (!verifyTokenRedis) {
                //     return h.redirect('/restore-password')
                // }

                return h.view(
                    'restore-password-step-2',
                    {
                        iss: credentials.iss,
                        aud: credentials.aud,
                        id: credentials.id,
                        name: credentials.name.split(' ')[0].toUpperCase(),
                        rut: credentials.rut || '',
                        email: credentials.email,
                        scope: credentials.scope,
                        restorePasswordToken: token
                    },
                    {
                        layout: 'no-loged-layout'
                    }
                )

            } catch (error) {
                console.log(error)

                return h.redirect('/restore-password')
            }
        }
    }
}
]