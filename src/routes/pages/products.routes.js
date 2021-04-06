export default {
    method: ['GET'],
    path: '/',
    options: {
        handler: (request, h) => {

            return h.view('products')
        }
    }
}