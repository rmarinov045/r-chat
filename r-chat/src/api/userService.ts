import { collection, doc, getDocs, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase'

import { errorParser } from '../auth/auth'

export const usersCollection = collection(db, 'users')
/**
 * References entire users collection with a set limit of 25
 */
const userQuery = query(usersCollection, limit(25))
const getUserById = (userId: string) => query(usersCollection, where('user.id', '==', userId))


export interface UserData {
    email: string,
    username: string,
    id: string,
}

export class User {
    constructor(public email: string, public username: string, public id: string) {
        this.email = email
        this.username = username
        this.id = id
    }
}

/**
 * Posts user to Firestore
 * @param user User Object
 * @returns void on success
 * @throws if write fails
 */

const postUser = async (user: UserData) => {
    try {
        await setDoc(doc(usersCollection, user.id), {
            user
        })
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

/**
 * Updates user's username in Firestore
 * @param newUsername username to be set
 * @param userId ID of the current user
 * @returns void on success
 * @throws if write fails
 */

const updateDbUsername = async (newUsername: string, userId: string) => {
    try {
        await updateDoc(doc(db, `users/${userId}`), { 'user.username': newUsername })
    } catch (error: any) {
        throw new Error(error)
    }
}


/**
 * Reads all users from Firestore
 * @returns array of users
 * @throws if read fails
 */

const getAllUsers = async () => {
    const users: User[] = []

    try {
        const usersSnapshot = await getDocs(userQuery)

        if (usersSnapshot.empty) return []

        usersSnapshot.forEach(user => users.push(new User(user.get('user.email'), user.get('user.username'), user.get('user.id'))))
        return users
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}


/**
 * Reads users by passed username
 * @param username username to search for
 * @returns array of matched users (or empty array)
 * @throws if read fails
 */

const getUserByUserName = async (username: string) => {
    const users: User[] = []

    try {
        const allUsers = await getDocs(usersCollection)

        if (allUsers.empty) return []

        allUsers.forEach(user => users.push(new User(user.get('user.email'), user.get('user.username'), user.get('user.id'))))

        return users.filter(user => user.username.toLowerCase().trim().includes(username.toLowerCase().trim()))

    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

export const userAPI = {
    postUser,
    getAllUsers,
    getUserByUserName,
    updateDbUsername,
}

/**
 * Firestore queries used by getCollectionData hook
 * @getUserById queries single user by ID
 * @userQuery queries all users with a set limit of 25
 */

export const userQueries = {
    getUserById,
    userQuery,
}