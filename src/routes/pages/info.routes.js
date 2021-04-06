export default {
    method: ['GET'],
    path: '/info',
    options: {
        handler: (request, h) => {

            return h.view('info')
        }
    }
}