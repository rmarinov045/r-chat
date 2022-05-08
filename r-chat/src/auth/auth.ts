import { auth } from '../firebase'
import * as api from 'firebase/auth'

import { userAPI } from '../api/userService'

/**
 * Parses error messages from APIs to user-friendly messages
 * @param err Error object
 * @returns user friendly message
 */

export const errorParser = (err: { message: string, code: string }) => {

    switch (err.code) {
        case 'auth/user-not-found':
            return 'No such user. Please check your email again.'
        case 'auth/email-already-in-use':
            return 'User with this email already exists. Please try again with another one.'
        case 'auth/too-many-requests':
            return 'An error occured. Please try requesting the email from the profile page once you log in.'
        case 'auth/weak-password':
            return 'Passwords should be at least 6 characters long.'
        default:
            return 'Ooops.. An error occured. Please reload the app or try again later.'
    }
}

/**
 * Logs in user via Firebase Auth
 * @param email user email
 * @param password user password
 * @returns UserCredential object
 * @throws if credentials do not match/are not found
 */

const login = async (email: string, password: string) => {
    try {
        const response = await api.signInWithEmailAndPassword(auth, email, password)
        return response
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

/**
 * Registers user via Firebase Auth
 * @param email user email
 * @param password user password
 * @returns UserCredential object
 * @throws if credentials are invalid/taken
 */

const register = async (email: string, password: string) => {
    try {
        const response = await api.createUserWithEmailAndPassword(auth, email, password)
        return response
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

/**
 * Sends verification email to currently signed in user
 * @returns void
 */

const sendVerificationEmail = async () => {
    try {
        if (auth.currentUser) {
            await api.sendEmailVerification(auth.currentUser)
        }
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

/**
 * Sends password reset email to current user
 * @returns void
 */

const resetPassword = async () => {
    try {
        if (auth.currentUser && auth.currentUser.email) {
            await api.sendPasswordResetEmail(auth, auth.currentUser.email)
        }
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

/**
 * Update user username in DB and Firebase auth
 * @param newUsername new username
 * @param userId current user ID
 * @returns void
 */

const editUsername = async (newUsername: string, userId: string) => {
    try {
        if (auth.currentUser) {
            await api.updateProfile(auth.currentUser, { displayName: newUsername })
            
            await userAPI.updateDbUsername(newUsername, userId)
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

/**
 * Logs out current user from Firebase Auth
 */

const logout = async () => {
    try {
        await api.signOut(auth)
    } catch (error: any) {
        throw new Error(errorParser(error));
    }
}

export const userAuth = {
    login,
    register,
    sendVerificationEmail,
    logout,
    resetPassword,
    editUsername,
}