import { auth } from '../firebase'
import * as api from 'firebase/auth'

export const errorParser = (err: { message: string, code: string }) => {

    switch (err.code) {
        case 'auth/user-not-found':
            return 'No such user. Please check your email again.'
        case 'auth/email-already-in-use':
            return 'User with this email already exists. Please try again with another one.'
        case 'auth/too-many-requests':
            return 'An error occured. Please try requesting the email from the profile page.'
        default:
            return 'Ooops.. An error occured. Please reload the app or try again later.'
    }
}

const login = async (email: string, password: string) => {
    try {
        const response = await api.signInWithEmailAndPassword(auth, email, password)
        return response
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

const register = async (email: string, password: string) => {
    try {
        const response = await api.createUserWithEmailAndPassword(auth, email, password)
        return response
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

const sendVerificationEmail = async () => {
    try {
        if (auth.currentUser) {
            const response = await api.sendEmailVerification(auth.currentUser)
            return response
        }
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

const logout = async () => {
try {
    await api.signOut(auth) 
} catch (error :any) {
    throw new Error(errorParser(error));
    
}
}

export const userAuth = {
    login,
    register,
    sendVerificationEmail,
    logout
}