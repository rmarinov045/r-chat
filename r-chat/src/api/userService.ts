import { addDoc, collection, getDocs } from 'firebase/firestore'
import { errorParser } from '../auth/auth'
import { db } from '../firebase'

const usersCollection = collection(db, 'users')

export interface UserData {
    email: string,
    username: string,
    id: string,
}

class User {

    email: string
    username: string
    id: string

    constructor(email :string, username :string, id :string) {
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
    const users :User[] = []
    try {
        const usersSnapshot = await getDocs(usersCollection)

        if (usersSnapshot.empty) return []

        usersSnapshot.forEach(user => users.push(new User(user.get('user.email'), user.get('user.username'), user.get('user.id')))) 
        return users
    } catch (error :any) {        
        throw new Error(errorParser(error))
    }
}

// const getUserByUserName = async (username :string) => {
//     const users :User[] = []
//     try {
//         const q = query(usersCollection, where('user.username', '==', 'TestUser'))
//         const queriedUsers = await getDocs(q)
//         queriedUsers.forEach(user => users.push(new User(user.get('user.email'), user.get('user.username'), user.get('user.id'))))
//         console.log(users);
        
//         return users
//     } catch (error :any) {
//         throw new Error(errorParser(error))
//     }
// }

export const userAPI = {
    postUser,
    getAllUsers,
}