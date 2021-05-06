const User = require('../../models/userModel');
//const Product = require('../../models/productModel');
var Excel = require('exceljs');
import { clean } from 'rut.js'
import { validatePassword } from '../../utils/passwordHandler'
import { listenerCount } from '../../models/userModel';
//import parseXlsx from 'excel'

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
                    { layout: 'no-loged' }
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
                    { layout: 'no-loged' }
                )
            }

            const sid = account._id.toString()

            delete account.password

            await request.server.app.cache.set(sid, { account }, 0)

            request.cookieAuth.set({ sid })

            return h.redirect('/admin')
        }
        return h.view('login', {}, { layout: 'no-loged' })
    }
}

async function findUserByRutAndPassword(userRut, userPassword) {
    let userExist = await User.find({
        rut: userRut,
        status: 'enabled',
        scope: {
            $in: ['sadmin', 'admin', 'dev']
        }
    }).lean();

    if (!userExist[0]) {
        return null
    }

    if (validatePassword(userExist[0].password, userPassword)) {
        return userExist[0]
    }
}