import * as auth from '../auth'


jest.mock('../../firebase', () => {
    return {
        ...jest.requireActual('../../firebase'),
        auth: { currentUser: true },
        app: jest.fn().mockReturnThis(),
        db: jest.fn().mockReturnThis(),
    }
})

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn().mockReturnValue(() => true),
        signInWithEmailAndPassword: () => mockSignIn,
        createUserWithEmailAndPassword: () => mockRegister,
        sendEmailVerification: () => mockSendEmail,
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
        getDocs: (query: any) => jest.fn(),
    }
})

let mockSignIn: any = 'test'
let mockRegister: any = 'test'
let mockSendEmail :any = jest.fn()

describe('Login unit tests', () => {

    afterEach(() => jest.clearAllMocks())

    it('returns user credentials object on success', async () => {
        const actual = await auth.userAuth.login('test', 'test')
        expect(actual).toEqual('test')
    })
    it('Handles errors', async () => {
        mockSignIn = jest.fn().mockImplementationOnce((user, pass) => {
            throw new Error('test')
        })
        expect(await auth.userAuth.login('test', 'test')).toThrowError('test')
    })
})

describe('Register unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('returns user credentials object on success', async () => {
        const actual = await auth.userAuth.register('test', 'test')
        expect(actual).toEqual('test')
    })
    it('Handles errors', async () => {
        mockRegister = jest.fn().mockImplementationOnce((user, pass) => {
            throw new Error('register error')
        })
        expect(await auth.userAuth.register('test', 'test')).toThrowError('register error')
    })
})

// recheck below

describe('Send verification email unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it.skip('Calls Firebase sendVerificationEmail method if there is a current user', async () => {
        await auth.userAuth.sendVerificationEmail()
        expect(mockSendEmail).toBeCalled()
    })
    it.skip('Handles errors', () => {
        mockSendEmail = jest.fn().mockImplementationOnce((...args) => {
            throw new Error()
        })
        expect(async () => await auth.userAuth.sendVerificationEmail()).toThrow()

    })
})