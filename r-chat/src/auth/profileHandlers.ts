import { userAuth } from './auth'

export const profileHandlers = {
    sendVerificationEmail: userAuth.sendVerificationEmail,
    resetPassword: userAuth.resetPassword,
    editUsername: userAuth.editUsername,
}