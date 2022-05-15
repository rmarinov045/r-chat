import * as auth from '../auth'
import * as fbAuth from 'firebase/auth'
import { userAPI } from '../../api/userService'
import { cleanup } from '@testing-library/react'


jest.mock('../../firebase', () => {
    return {
        ...jest.requireActual('../../firebase'),
        auth: { currentUser: { email: 'foo' }, },
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
        sendEmailVerification: jest.fn(),
        sendPasswordResetEmail: jest.fn(),
        updateProfile: jest.fn(),
        signOut: jest.fn()
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

jest.mock('../../api/userService', () => {
    return {
        userAPI: {
            updateDbUsername: jest.fn(),
        }
    }
})

let mockSignIn: any = 'test'
let mockRegister: any = 'test'

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

describe('Send verification email unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('Calls Firebase sendVerificationEmail method if there is a current user', async () => {
        await auth.userAuth.sendVerificationEmail()
        expect(fbAuth.sendEmailVerification).toHaveBeenCalled()
    })
    it('Handles errors', async () => {
        (fbAuth.sendEmailVerification as jest.Mock) = jest.fn().mockImplementationOnce(() => {
            // eslint-disable-next-line no-throw-literal
            throw { message: 'test', code: 'test' }
        })

        try {
            await auth.userAuth.sendVerificationEmail()
        } catch (error: any) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(error).toBeTruthy()
        }

    })
})

describe('Error parses unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    let mockError = { code: 'auth/user-not-found', message: 'test' }

    it('Parses error if user is not found', () => {
        const actual = auth.errorParser(mockError)
        expect(actual).toEqual('No such user. Please check your email again.')
    })
    it('Parses error if email is not found', () => {
        mockError.code = 'auth/email-already-in-use'
        const actual = auth.errorParser(mockError)
        expect(actual).toEqual('User with this email already exists. Please try again with another one.')
    })
    it('Parses error if too many requests email requests to Firebase', () => {
        mockError.code = 'auth/too-many-requests'
        const actual = auth.errorParser(mockError)
        expect(actual).toEqual('An error occured. Please try requesting the email from the profile page once you log in.')
    })
    it('Parses error if password is too weak', () => {
        mockError.code = 'auth/weak-password'
        const actual = auth.errorParser(mockError)
        expect(actual).toEqual('Passwords should be at least 6 characters long.')
    })
    it('Parses error to default if not found in switch', () => {
        const actual = auth.errorParser({ code: 'test', message: 'test' })
        expect(actual).toEqual('Ooops.. An error occured. Please reload the app or try again later.')
    })
})

describe('Reset Password unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('Should send email if there is a current user and the user has an email property', async () => {
        auth.userAuth.resetPassword()
        expect(fbAuth.sendPasswordResetEmail).toHaveBeenCalled()
    })
    it('Handles errors', async () => {
        auth.userAuth.resetPassword = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        })
        try {
            await auth.userAuth.resetPassword()
        } catch (error) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(error).toBeTruthy()
        }
    })
})

describe('Edit username unit tests', () => {
    afterEach(() => jest.clearAllMocks())

    it('Updates username in Firebase auth if there is a current user', () => {
        auth.userAuth.editUsername('test', '1')
        expect(fbAuth.updateProfile).toHaveBeenCalled()
    })
    it('Updates username DB if there is a current user', async () => {
        await auth.userAuth.editUsername('test', '1')
        expect(userAPI.updateDbUsername).toHaveBeenCalled()
    })
    it('Handles errors', async () => {
        (fbAuth.updateProfile as jest.Mock) = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        })
        try {
            await auth.userAuth.editUsername('test', '1')
        } catch (error) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(error).toBeTruthy()
        }
    })
})

describe('Logout unit tests', () => {
    afterEach(() => cleanup())

    it('Signs out current user', async () => {
        await auth.userAuth.logout()
        expect(fbAuth.signOut).toHaveBeenCalled()
    })
    it('Handles errors', async () => {
        (fbAuth.signOut as jest.Mock) = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        })
        try {
            await auth.userAuth.logout()
        } catch (error) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(error).toBeTruthy()
        }
    })
})