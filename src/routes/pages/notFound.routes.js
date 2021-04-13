export default {
    method: ['GET'],
    path: '/notFound',
    options: {
        auth: false,
        handler: (request, h) => {

            return h.view('notFound')
        }
    }
}