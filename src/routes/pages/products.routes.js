export default {
    method: ['GET'],
    path: '/products',
    options: {
        handler: (request, h) => {

            return h.view('products')
        }
    }
}