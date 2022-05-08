import { addDoc, collection, collectionGroup, doc, endAt, limit, limitToLast, orderBy, query, setDoc, where } from "firebase/firestore"
import { db } from "../firebase"

import { errorParser } from "../auth/auth"

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
    constructor(public message: string, public senderId: string, public receiverId: string, public timestamp: number) {
        this.message = message
        this.senderId = senderId
        this.receiverId = receiverId
        this.timestamp = timestamp
    }
}

/**
 * Posts message to DB
 * @param message - Message object to be posted
 * @returns void 
 * @throws if writing to DB fails
 */

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

/**
 * Parses user-friendly timestamp from the DB timestamp
 * @param timestamp - number timestamp from DB
 * @returns stringified user-friendly timestamp
 */

const parseTimestamp = (timestamp: number) => new Date(timestamp).toDateString() + ' ' + new Date(timestamp).toLocaleTimeString()

export const messageAPI = {
    sendMessage,
    parseTimestamp,
}

/**
 * Firestore queries for useCollectionData hook
 * @get 25 most recent messages
 * @getPrev 25 previous messages - compared to passed timestamp
 */

export const queries = {
    get: (userId: string, currentUserId: string) => query(messagesCollection, where('cid', '==', `${userId < currentUserId ? userId + currentUserId : currentUserId + userId}`), limit(25), orderBy('message.timestamp', 'desc')),
    getPrev: (userId: string, currentUserId: string, firstTimestamp: number) => query(messagesCollection, where('cid', '==', `${userId < currentUserId ? userId + currentUserId : currentUserId + userId}`), limitToLast(25), orderBy('message.timestamp', 'asc'), endAt(firstTimestamp - 1))
}