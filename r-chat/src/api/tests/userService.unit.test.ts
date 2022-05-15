import * as fb from 'firebase/firestore'
import * as userService from '../userService'

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
        ...jest.requireActual('firebase/firestore'),
        collection: jest.fn(),
        query: jest.fn(),
        where: jest.fn(),
        limit: jest.fn(),
        getFirestore: jest.fn(),
        collectionGroup: jest.fn(),
        doc: jest.fn(),
        addDoc: jest.fn(),
        setDoc: jest.fn(),
        updateDoc: jest.fn(),
        getDocs: (query: any) => mockGetDocs,
    }
})

let mockGetDocs = { empty: false, forEach: jest.fn() }

const mockUser = { email: 'test@test.bg', id: '123', username: 'testUsername' }

describe('postUser unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('Calls firestore setDoc method on success', async () => {
        await userService.userAPI.postUser(mockUser)
        expect(fb.setDoc).toHaveBeenCalled()
    })
    it('Returns a void promise on success', async () => {
        const actual = await userService.userAPI.postUser(mockUser)
        expect(actual).toBeUndefined()
    })
    it('Handles errors', async () => {
        (fb.setDoc as jest.Mock) = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        })

        try {
            await userService.userAPI.postUser(mockUser)
        } catch (error) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(error).toBeTruthy()
        }
    })
})

describe('updateDbUsername unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('Calls firestore updateDoc method on success', async () => {
        await userService.userAPI.updateDbUsername('test', '1')
        expect(fb.updateDoc).toHaveBeenCalled()
    })
    it('Returns a void promise on success', async () => {
        const actual = await userService.userAPI.updateDbUsername('test', '1')
        expect(actual).toBeUndefined()
    })
    it('Handles errors', async () => {
        (fb.updateDoc as jest.Mock) = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        })

        try {
            await userService.userAPI.updateDbUsername('test', '1')
        } catch (error) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(error).toBeTruthy()
        }
    })
})

describe('getAllUsers unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('Calls forEach method on received array on success', async () => {
        await userService.userAPI.getAllUsers()
        expect(mockGetDocs.forEach).toHaveBeenCalled()
    })
    it.skip('Returns array of users on success', async () => {
        const users = await userService.userAPI.getAllUsers()
        expect(users).toHaveLength(1)
    })
    // have to mock snapshot for each method
    it('Returns empty array if no users', async () => {
        const users = await userService.userAPI.getAllUsers()
        expect(users).toHaveLength(0)
    })
})

describe('getUserByUserName unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('Calls forEach method on received array on success', async () => {
        await userService.userAPI.getUserByUserName('test')
        expect(mockGetDocs.forEach).toHaveBeenCalled()
    })
    it.skip('Returns array of users on success', async () => {
        const users = await userService.userAPI.getUserByUserName('test')
        expect(users).toHaveLength(1)
    })
    // have to mock snapshot for each method
    it('Returns empty array if no users', async () => {
        const users = await userService.userAPI.getUserByUserName('test')
        expect(users).toHaveLength(0)
    })
})

describe('User class unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('Creates instance of class with correct props', () => {
        const actual = new userService.User('test@test.com', 'username', '1')
        const expected = { email: 'test@test.com', username: 'username', id: '1' }
        expect(actual).toEqual(expected)
    })
})