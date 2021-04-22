
const Banner = require('../../models/bannerModel');

const Joi = require('joi')
const moment = require('moment')
import { writeFile } from 'fs/promises';
import { readdir } from 'fs/promises'
const fs = require('fs')

module.exports = [
    {
        method: 'POST',
        path: '/api/uploadImg',
        options: {
            payload: {
                maxBytes: 1000 * 1000 * 10 // 10mb
            },
            handler: async (request, h) => {
                let reado = await readdir('./public/modules/banner/imgBan/')
                if (reado.length >= 6) {
                    return { err: "El maximo de imagenes de banner es 6, elimine alguna imagen e intentelo nuevamente" };
                }

                let nameVeri = await Banner.find({nameFile: request.payload.filename}).lean();

                if (nameVeri[0]) {
                    return { err: "Ya existe una imagen de este nombre, modifiquelo e intentelo nuevamente" };
                }

                let img = request.payload.img
                let name = removeSpecials(moment().format('YYYY-MM-DDTHH:mm:ss.SSSSS'))
                try {
                    await writeFile('./public/modules/banner/imgBan/' + name + '.txt', img);


                    let saveBan = {
                        nameFile: request.payload.filename,
                        nameNew: name
                    }

                    let banner = await Banner(saveBan);
                    let newBanImg = await banner.save();

                    return { ok: newBanImg };
                } catch (error) {
                    return { err: "error en la subida" };
                }

            },
            validate: {
                payload: Joi.object().keys({
                    img: Joi.string().required(),
                    filename: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/getBanner',
        options: {
            handler: async (request, h) => {
                try {
                    let reado = await readdir('./public/modules/banner/imgBan/')
                    if (reado.length == 0) {
                        return { err: "No se han encontrado imagenes" };
                    }
                    let images = []

                    reado.forEach((el, i) => {
                        const data = fs.readFileSync('./public/modules/banner/imgBan/' + el);
                        images.push(data.toString())
                    })

                    return { ok : images }

                } catch (error) {
                    return { err: "error al traer imagen" };
                }

            }
        }
    },
    {
        method: 'GET',
        path: '/api/bannerNames',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let result = await Banner.find({}).lean();

                    return result
                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar banners, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/deleteBanner',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {

                    let query = {
                        nameFile: request.payload.filename
                    }

                    let result = await Banner.find(query).lean();

                    fs.unlinkSync('./public/modules/banner/imgBan/' + result[0].nameNew + '.txt')

                    await Banner.deleteOne(query)


                    return result
                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al eliminar banner, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            },
            validate: {
                payload: Joi.object().keys({
                    filename: Joi.string().required()
                })
            }
        }
    }
]


// const getImgServer = (rut) => {
//     return new Promise(resolve => {
//         fs.readFile('./images/students/' + rut + '.txt', function read(err, data) {
//             if (err) {
//                 resolve({ err: 'error' })
//             }

//             resolve({ ok: data })
//         });
//     })
// }

function removeSpecials(data) {
    data = data.replace(/[^0123456789]/g, '');
    data = data.replace(/\s/g, '')
    data = data.replace(/-/g, '')
    return data
};