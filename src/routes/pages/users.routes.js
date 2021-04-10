export default {
    method: ['GET'],
    path: '/users',
    options: {
        handler: (request, h) => {
            let credentials = request.auth.credentials

            return h.view('users', {credentials}, { layout: 'admin-layout' })
        }
    }
}