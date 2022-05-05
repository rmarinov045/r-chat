import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { errorParser } from '../auth/auth'
import { db } from '../firebase'

export const usersCollection = collection(db, 'users')

export interface UserData {
    email: string,
    username: string,
    id: string,
}

class User {

    email: string
    username: string
    id: string

    constructor(email: string, username: string, id: string) {
        this.email = email
        this.username = username
        this.id = id
    }

}

const postUser = async (user: UserData) => {
    try {
        await addDoc(usersCollection, {
            user
        })
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

const getAllUsers = async () => {
    const users: User[] = []
    try {
        const usersSnapshot = await getDocs(usersCollection)

        if (usersSnapshot.empty) return []

        usersSnapshot.forEach(user => users.push(new User(user.get('user.email'), user.get('user.username'), user.get('user.id'))))
        return users
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

const getUserById = (userId: string) => query(usersCollection, where('user.id', '==', userId))

export const userAPI = {
    postUser,
    getAllUsers,
}

export const userQueries = {
    getUserById,
}