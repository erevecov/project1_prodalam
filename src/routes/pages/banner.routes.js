export default {
    method: ['GET'],
    path: '/banner',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials

            return h.view('banner', {credentials}, { layout: 'admin-layout' })
        }
    }
}