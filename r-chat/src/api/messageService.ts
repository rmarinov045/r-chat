import { addDoc, collection, collectionGroup, doc, endAt, limit, limitToLast, orderBy, query, setDoc, where } from "firebase/firestore"
import { errorParser } from "../auth/auth"
import { db } from "../firebase"

export const chatsCollection = collection(db, 'chats')
export const messagesCollection = collectionGroup(db, 'messages')

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

    const docRef = message.senderId < message.receiverId ? message.senderId + message.receiverId : message.receiverId + message.senderId

    try {
        await setDoc(doc(collection(db, 'chats'), `${docRef}`), {
            messages: await addDoc(collection(db, `chats/${docRef}/messages`), { message: message, cid: docRef }),
            subscribers: { user1: message.receiverId, user2: message.senderId },
            lastUpdatedAt: message.timestamp,
            lastSenderId: message.senderId,
            cid: docRef
        })

    } catch (error: any) {
        throw new Error(errorParser(error))
    }
}

const parseTimestamp = (timestamp: number) => new Date(timestamp).toDateString() + ' ' + new Date(timestamp).toLocaleTimeString()

export const messageAPI = {
    sendMessage,
    parseTimestamp,
}

export const queries = {
    get: (userId: string, currentUserId: string) => query(messagesCollection, where('cid', '==', `${userId < currentUserId ? userId + currentUserId : currentUserId + userId}`), limit(25), orderBy('message.timestamp', 'desc')),
    getPrev: (userId: string, currentUserId: string, firstTimestamp: number) => query(messagesCollection, where('cid', '==', `${userId < currentUserId ? userId + currentUserId : currentUserId + userId}`), limitToLast(25), orderBy('message.timestamp', 'asc'), endAt(firstTimestamp - 1))
}