import { addDoc, collection, query, where } from "firebase/firestore"
import { errorParser } from "../auth/auth"
import { auth, db } from "../firebase"

export const messagesCollection = collection(db, 'messages')

export interface MessageData {
    message: {
        message: string,
        senderId: string,
        receiverId: string,
        timestamp: number,
    }
}

export class Message {
    message: string
    senderId: string
    receiverId: string
    timestamp: number

    constructor(message: string, senderId: string, receiverId: string, timestamp: number) {
        this.message = message
        this.senderId = senderId
        this.receiverId = receiverId
        this.timestamp = timestamp
    }
}

const sendMessage = async (message: Message) => {
    try {
        await addDoc(messagesCollection, {
            message
        })
    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

const parseTimestamp = (timestamp :number) => new Date(timestamp).toDateString()

export const messageAPI = {
    sendMessage,
    parseTimestamp,
}

export const queries = {
    sent: (userId: string) => query(messagesCollection, where('message.senderId', '==', auth.currentUser?.uid), where('message.receiverId', '==', userId)),
    received: (userId: string) => query(messagesCollection, where('message.senderId', '==', userId), where('message.receiverId', '==', auth.currentUser?.uid)),
}