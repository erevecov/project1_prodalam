
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
                try {
                    let ban = request.payload.mod

                    if (request.payload.img !== '') {
                        let reado = await readdir('./public/modules/banner/imgBan/')
                        if (reado.length >= 12) {
                            return { err: "El maximo de imagenes de banner es 12 (6 principales y 6 mobiles), elimine alguna imagen e intentelo nuevamente" };
                        }
                    }

                    let nameVeri = await Banner.find({nameFile: request.payload.filename}).lean();

                    if (nameVeri[0]) {
                        return { err: "Ya existe una imagen de este nombre, modifiquelo e intentelo nuevamente" };
                    }

                    let img = request.payload.img
                    let name = removeSpecials(moment().format('YYYY-MM-DDTHH:mm:ss.SSSSS'))
                
                    if (ban) {
                        name = ban.nameNew+"M"
                    }

                    if (request.payload.img !== '') {
                        await writeFile('./public/modules/banner/imgBan/' + name + '.txt', img);
                    }
                    

                    let saveBan = {
                        nameFile: request.payload.filename,
                        nameNew: name
                    }

                    if (ban) {
                        let saveMod = ban
                        if (ban.nameFileM !== '') {
                            request.payload.filename = ban.nameFileM
                        }
                        saveMod.nameFileM = request.payload.filename
                        saveMod.nameNewM = name
                        saveMod.urlBanner = request.payload.urlBanner
                        let banner = await Banner(saveMod);
                        await Banner.findByIdAndUpdate(ban._id, banner)
                        return { ok: saveMod };

                    } else {
                        let banner = await Banner(saveBan);
                        let newBanImg = await banner.save();
                        return { ok: newBanImg };
                    }
                    
                } catch (error) {
                    console.log(error)

                    return { err: "error en la subida de banner" };
                }

            },
            validate: {
                payload: Joi.object().keys({
                    img: Joi.string().allow(''),
                    filename: Joi.string().allow(''),
                    urlBanner: Joi.string().allow(''),
                    mod: Joi.object()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/getBanner',
        options: {
            auth: false,
            handler: async (request, h) => {
                try {
                    let result = await Banner.find({}).lean();
                    let reado = await readdir('./public/modules/banner/imgBan/')
                    if (reado.length == 0) {
                        return { err: "No se han encontrado imagenes" };
                    }
                    let images = []

                    


                    reado.forEach((el, i) => {
                        const data = fs.readFileSync('./public/modules/banner/imgBan/' + el);
                        if (!el.includes("M")) {
                            images.push({
                                name: el.replace(".txt", ""),
                                banner: data.toString()
                            })
                        } else {
                            images.push({
                                name: el.replace("M.txt", ""),
                                bannerM: data.toString()
                            })
                        }
                    })

                    let final = []

                    result.forEach(el => {
                        let banData = {
                            banner: '',
                            bannerMovil: '',
                            ulrBan: ''
                        }
                        images.forEach(elban => {
                            if (el.nameNew == elban.name) {
                                if (elban.bannerM) {
                                    banData.bannerMovil = elban.bannerM
                                } else{
                                    banData.banner = elban.banner
                                }
                                banData.ulrBan = el.urlBanner
                            }
                        });
                        final.push(banData)
                    });

                    return { ok : final }

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

                    if (result[0].nameNewM !== '') {
                        fs.unlinkSync('./public/modules/banner/imgBan/' + result[0].nameNewM + '.txt')
                    }

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