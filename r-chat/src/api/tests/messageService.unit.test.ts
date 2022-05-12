import { setDoc } from 'firebase/firestore'
import * as messageService from '../messageService'

jest.mock('../../firebase', () => {
    return {
        ...jest.requireActual('../../firebase'),
        auth: jest.fn().mockReturnThis(),
        app: jest.fn().mockReturnThis(),
        db: jest.fn().mockReturnThis(),
    }
})

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn().mockReturnValue(() => true),
    }
})

jest.mock('firebase/firestore', () => {
    return {
        // ...jest.requireActual('firebase/firestore'),
        collection: jest.fn(),
        query: jest.fn(),
        where: jest.fn(),
        limit: jest.fn(),
        getFirestore: jest.fn(),
        collectionGroup: jest.fn(),
        doc: jest.fn(),
        addDoc: jest.fn(),
        setDoc: jest.fn(),
    }
})

const mockMessage = { message: 'test2', senderId: 'aa', receiverId: 'bb', timestamp: 200 }

describe('DB ID parser unit tests', () => {

    it('Should lexicographically compare two user IDs and merge them to create a DB ID', () => {
        const expected = 'aabb'
        expect(messageService.dbIdGenerator('aa', 'bb')).toEqual(expected)
    })
    it('Should return the same string with switched args', () => {
        const expected = 'aabb'
        expect(messageService.dbIdGenerator('bb', 'aa')).toEqual(expected)
    })
})

describe('sendMessage unit tests', () => {

    it('Writes to DB with valid args', async () => {
        await messageService.messageAPI.sendMessage(mockMessage)
        expect(setDoc).toHaveBeenCalled()
    })
})

describe('parseTimestamp unit tests', () => {
    it('Returns user friendly date string from timestamp', () => {
        const expected = 'Mon May 09 2022 18:11:05'
        expect(messageService.messageAPI.parseTimestamp(1652109065277)).toEqual(expected)
    })
})