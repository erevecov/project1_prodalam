//import User from '../../models/User'
import { clean } from 'rut.js'

export default {
    method: ['GET', 'POST'],
    path: '/login',
    options: {
        auth: {
            mode: 'try'
        },
        plugins: {
            '@hapi/cookie': {
                redirectTo: false
            }
        }
    },
    handler: async (request, h) => {
        if (request.auth.isAuthenticated) return h.redirect('/')

        let account = null

        if (request.method === 'post') {
            let payload = request.payload || { rut: null, password: null }

            if (!payload.rut || !payload.password) {
                return h.view('login', 
                    {
                        message: 'Debe ingresar su rut y contraseña'
                    },
                    { layout: 'no-loged-layout' }
                )
            }

            let cleanRut = clean(payload.rut).toUpperCase()
            let encodedPassword = payload.password // falta encriptar

            let userExist = await findUserByRutAndPassword(cleanRut, encodedPassword)
            
            if (userExist) {
                account = userExist
            }

            if (!account) {
                return h.view('login', 
                    {
                        message: 'Rut o contraseña incorrectos'
                    },
                    { layout: 'no-loged-layout' }
                )
            }

            const sid = account._id.toString()

            delete account.password

            await request.server.app.cache.set(sid, { account }, 0)

            request.cookieAuth.set({ sid })

            return h.redirect('/')
        }
        return h.view('login', {}, { layout: 'no-loged-layout' })
    }
}

async function findUserByRutAndPassword(userRut, userPassword) {
    if (userRut === '111111111' && userPassword === '1234') {
        return {
            _id: '12312312213123123123',
            rut: '111111111',
            name: 'admin',
            password: 'leica666'
        }
    }
    return null
}