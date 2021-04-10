export default {
    method: ['GET'],
    path: '/info',
    options: {
        auth: false,
        handler: (request, h) => {

            return h.view('info')
        }
    }
}