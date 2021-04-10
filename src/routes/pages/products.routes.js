export default {
    method: ['GET'],
    path: '/products',
    options: {
        auth: false,
        handler: (request, h) => {

            return h.view('products', { pageSelectedProducts: true })
        }
    }
}