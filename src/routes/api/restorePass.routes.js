import Joi from 'joi'
import jwt from 'jsonwebtoken'
import dotEnv from 'dotenv'
import sgMail from '@sendgrid/mail'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import User from '../../models/User'
import { hashPassword } from '../../utils/passwordHandler'

dotEnv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = [
{
    method: 'POST',
    path: '/restore_password',
    options: {
        description: 'Restore user password',
        notes: 'Send email to user and restore password',
        tags: ['api'],
        auth: false,
        handler: async (request, h) => {
            try {
                let payload = request.payload

                let userExist = await User.find({
                    email: payload.email.toLowerCase().trim()
                })

                if (!userExist[0]) {
                    if (payload.entity === 'mobile') {
                        return h.response({
                            error: 'El usuario no existe.'
                        }).code(404)
                    }

                    return h.view('restore-password', {
                        message: 'El email ingresado no está registrado en el sistema',
                        responseType: 'danger'
                    }, { layout: 'no-loged-layout' })
                }

                let token = await jwt.sign(
                    {
                        iss: uuidv4(),
                        aud: 'restorepassword',
                        iat: moment().unix(),
                        id: userExist[0]._id,
                        rut: userExist[0].rut || '',
                        email: userExist[0].email,
                        name: userExist[0].name,
                        scope: userExist[0].scope
                    },
                    process.env.SECRET_KEY,
                    {
                        algorithm: 'HS512'
                    }
                )

                await request.redis.client.set(`movitroniarestorepassword-${userExist[0]._id}`, token, 'EX', moment.duration(1, 'weeks').asSeconds())

                let emailResponse = await sendRestorePasswordEmail(payload.email, token)

                if (emailResponse) {
                    if (payload.entity === 'mobile') {
                        return h.response({
                            message: 'Hemos enviado un enlace a tu correo para que puedas cambiar tu contraseña.'
                        }).code(200)
                    }

                    return h.view('restore-password', {
                        message: 'Hemos enviado un enlace a tu correo para que puedas cambiar tu contraseña.',
                        responseType: 'success'
                    }, { layout: 'no-loged-layout' })
                }

                return h.response({
                    error: 'Ha ocurrido un error al enviar el email'
                }).code(500)

            } catch (error) {
                console.log(error)

                return h.response({
                    error: 'Ha ocurrido un error al enviar el email'
                }).code(500)
            }
        },
        validate: {
            payload: Joi.object().keys({
                email: Joi.string().email().required(),
                entity: Joi.string()
            })
        }
    }
},
{
    method: 'POST',
    path: '/restore_password_step_2',
    options: {
        auth: 'jwt',
        description: 'restore password change password',
        notes: 'restore password change password',
        tags: ['api'],
        handler: async (request, h) => {
            try {
                const credentials = request.auth.credentials
                const token = request.auth.token
                let payload = request.payload

                if (payload.password1 !== payload.password2) {
                    return h.view('restore-password-step-2', {
                        ...credentials,
                        restorePasswordToken: token,
                        message: 'Las contraseñas no son iguales.',
                        responseType: 'danger'
                    }, { layout: 'no-loged-layout' })
                }

                if (payload.password1.length < 6) {
                    return h.view('restore-password-step-2', {
                        ...credentials,
                        restorePasswordToken: token,
                        message: 'El largo minimo de la contraseña debe ser de 6 caracteres.',
                        responseType: 'danger'
                    }, { layout: 'no-loged-layout' })
                }

                let password = hashPassword(payload.password1)

                await User.findByIdAndUpdate(credentials.id, {
                    password
                })

                await request.redis.client.del(`movitroniarestorepassword-${credentials.id}`)

                return h.view('restore-password-step-2', {
                    ...credentials,
                    restorePasswordToken: token,
                    message: 'Se ha creado tu nueva contraseña.',
                    responseType: 'success'
                }, { layout: 'no-loged-layout' })

            } catch (error) {
                console.log(error)

                return h.view('restore-password-step-2', {
                    ...credentials,
                    restorePasswordToken: token,
                    message: 'Ha ocurrido un error al cambiar la contraseña. Por favor intentalo mas tarde',
                    responseType: 'danger'
                }, { layout: 'no-loged-layout' })
            }
        },
        validate: {
            payload: Joi.object().keys({
                password1: Joi.string(),
                password2: Joi.string()
            })
        }
    }
}
]

const sendRestorePasswordEmail = async (userEmail, token) => {
    try {
        const msg = {
            to: userEmail,
            from: process.env.EMAIL_SENDER || 'no-reply@movitronia.com',
            subject: 'Recuperar contraseña',
            text: 'Recuperar contraseña',
            html: `
                <h1>¿Necesitas cambiar tu contraseña?</h1>

                <a href="https://intranet.movitronia.com/restore-password-step-2?token=${token}">Crear nueva contraseña</a>

                <p>Si tu no solicitaste el cambio de contraseña, ignora este correo. Tu contraseña continuará siendo la misma.</p>
            `
        }

        let res = await sgMail.send(msg)

        return res
    } catch (error) {
        console.log(error)
        return null
    }
}