const User = require('../../models/userModel');
//const Product = require('../../models/productModel');
var Excel = require('exceljs');
import { clean } from 'rut.js'
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
    // if (userRut === '111111111' && userPassword === '1234') {
    //     return {
    //         _id: '12312312213123123123',
    //         rut: '111111111',
    //         name: 'admin',
    //         password: 'leica666'
    //     }
    // }

    let userExist = await User.find({
        rut: userRut,
        password: userPassword,
        status: 'enabled',
        scope: {
            $in: ['sadmin', 'admin']
        }
    }).lean();
    //await apiTes()
    // console.log("cargando excel");
    // await excelCom()

    if (userExist[0]) return userExist[0];

    return null
}

async function excelCom() {
    // read from a file
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile('plan.xlsx')
        .then(async function () {
            //console.log("rows", workbook._worksheets[1]._rows[1]._cells[13]._value.model.value)
            let arraydata = []
            // if cells > 12 = atributos

            let data = workbook._worksheets[1]._rows

            let final = []
            let keyobj = []
            let keyobjRaw = []
            data.forEach((ed, i) => {
                if (i == 1) {
                    ed._cells.forEach((el) => {
                        keyobj.push(
                            (removeAccents2(removeSpecials2((el._value.model.value).trim()))).toLowerCase()
                        )
                        keyobjRaw.push(
                            el._value.model.value
                        )
                    })
                }
            });

            data.forEach((ed, i) => {
                if (i !== 0 && i !== 1) {
                    let rowProd = {}
                    ed._cells.forEach((cell, o) => {
                        //console.log("waaataa",cell._value.model.value);
                        if (cell._value.model.value !== '') {
                            rowProd[keyobj[o]] = cell._value.model.value;
                            //console.log("wat", rowProd);
                        }
                        if (o === ed._cells.length - 1) {
                            final.push(rowProd)
                        }
                    })
                }
            })

            final.forEach((el, i) => {
                let a = {}
                //let xEl = workbook._worksheets[1]._rows[1]._cells[i]._value.model.value
                if (el.infostatus == 'COMPLETADO' && el.descripcion) {
                    let copyEl = el
                    a.sku = el.sku
                    a.productId = el.productid
                    a.title = el.titulo
                    a.category = el.categoriapadrecategorianodefinidaensap
                    a.subCategory = el.categoriacategoriapadresap
                    a.subCategory2 = el.subcategoriacategoriasap
                    if ((el.descripcion) ? a.description = el.descripcion : a.description = '')
                    if ((el.uso) ? a.use = el.uso : a.use = '')
                    if ((el.beneficio) ? a.benefits = el.beneficio : a.benefits = '')

                    delete copyEl.sku
                    delete copyEl.productid
                    delete copyEl.infostatus
                    delete copyEl.titulo
                    delete copyEl.caracteristicas
                    delete copyEl.categoriapadrecategorianodefinidaensap
                    delete copyEl.categoriacategoriapadresap
                    delete copyEl.subcategoriacategoriasap
                    delete copyEl.descripcion
                    delete copyEl.uso
                    delete copyEl.beneficio


                    let infoFin = []
                    Object.keys(copyEl).forEach(e => {
                        let dataNam = {}
                        keyobjRaw.forEach(ell => {
                            let clare = (removeAccents2(removeSpecials2((ell).trim()))).toLowerCase()
                            if (e == clare){
                                dataNam.name = ell
                                dataNam.data = copyEl[e]
                                infoFin.push(dataNam)
                            }
                        });

                    });

                    // a.info = copyEl
                    a.info = infoFin
                    arraydata.push(a)
                }
            })
            console.log("aaaa", arraydata[0]);
            // try {
            //     let res = await Product.insertMany(arraydata)
            //     console.log("indi", res)
            // } catch (error) {
            //     console.log("err", error)
            // }

        });
}

async function apiTes() {
    // read from a file
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile('products.xlsx')
        .then(async function () {
            //console.log("rows", workbook._worksheets[1]._rows[1]._cells[3]._value.model.value)
            let arraydata = []


            let data = workbook._worksheets[1]._rows

            data.forEach((ed, i) => {
                if (i !== 0) {
                    let objData = {}
                    ed._cells.forEach((el, p) => {

                        if (p == 1) objData.id = el._value.model.value
                        if (p == 2) objData.productId = el._value.model.value
                        if (p == 3) objData.sku = el._value.model.value
                        if (p == 4) objData.attributeId = el._value.model.value
                        if (p == 5) objData.attributeLabel = el._value.model.value
                        if (p == 10) objData.data = el._value.model.value
                        //if (p==11) objData.position = el._value.model.value
                        if (p == 12) objData.createdAt = el._value.model.value
                        if (p == 13) {
                            objData.updatedAt = el._value.model.value
                            arraydata.push(objData)
                        }
                    })
                }
            });

            // //separar datos
            var indices = [];
            let skuList = []

            arraydata.forEach((el) => {
                if (!skuList.includes(el.sku)) {
                    skuList.push(el.sku)
                }
            })

            skuList.forEach((ed) => {
                let aux = []
                arraydata.forEach((el, i) => {
                    if (el.sku == ed) {
                        aux.push(el)
                    }
                    if (i == arraydata.length - 1) {
                        let aux2 = {}

                        aux2.sku = aux[0].sku
                        aux2.productId = aux[0].productId
                        //aux2._id = moment.tz('America/Santiago').format('YYYY-MM-DDTHH:mm:ss.SSSSS');
                        aux2.info = []

                        aux.forEach((ep) => {
                            let aux3 = {}
                            aux3.id = ep.id
                            //aux3.productId = ep.productId
                            aux3.attributeId = ep.attributeId
                            aux3.attributeLabel = ep.attributeLabel
                            aux3.data = ep.data

                            aux2.info.push(aux3)
                        })

                        indices.push(aux2)
                    }
                })
            })

            try {
                let res = await Product.insertMany(indices)
                console.log("indi", res)
            } catch (error) {
                console.log("err", error)
            }

        });

}

async function fusion() {
    var workbook2 = new Excel.Workbook();
    workbook2.xlsx.readFile('newProd.xlsx')
    .then(async function () {
        //console.log("rows", workbook._worksheets[1]._rows[1]._cells[3]._value.model.value)
        let arraydata = []


        let data = workbook2._worksheets[1]._rows

        data.forEach((ed,i) => {
            if(i!==0 || i!==1){
                let objData={}
                ed._cells.forEach((el,p) => {
                
                    if (p==1) objData.sku = el._value.model.value
                    if (p==3) objData.title = el._value.model.value
                    if (p==5) objData.category = el._value.model.value
                    if (p==6) {
                        objData.categoryFather = el._value.model.value
                        arraydata.push(objData)
                    }
                })
            }
        });

        let result = await Product.find({}).lean();
        
        
        let aux = []
        result.forEach((el) => {
            let aux2 = {}
            arraydata.forEach((ed, i) => {
                if (ed.sku == el.sku) {
                    delete el._id
                    delete el.__v
                    delete el.createdAt
                    delete el.updatedAt
                    

                    if (typeof ed.categoryFather !== 'string' ) {
                        ed.categoryFather = '-'
                    }

                    aux2 = Object.assign(ed, el)
                }
                if (i == arraydata.length - 1) {
                    aux.push(aux2)
                }
            })
        })

        await Product.collection.drop()

        //console.log("prods final", aux);

        try {
            let res = await Product.insertMany(aux)
            console.log("indi", res)
        } catch (error) {
            console.log("err", error)
        }


        
    });

}

function removeSpecials2(data) {
    data = data.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    data = data.replace(/\s/g,'')
    data = data.replace(/-/g,'')
    return data
}
function removeAccents2(data) {
    data = data.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return data
  }