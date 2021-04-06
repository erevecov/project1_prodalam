export default {
    method: ['GET'],
    path: '/restore_password',
    options: {
        handler: (request, h) => {

            return h.view('restore_password_step_2')
        }
    }
}