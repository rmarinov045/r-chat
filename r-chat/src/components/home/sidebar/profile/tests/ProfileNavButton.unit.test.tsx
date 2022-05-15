import ProfileNavButton from "../ProfileNavButton";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../../../firebase', () => {
    return {
        auth: { currentUser: { uid: '1' } }
    }
})

jest.mock('firebase/firestore', () => {
    return {
        ...jest.requireActual('firebase/firestore'),
        query: jest.fn(),
        collection: jest.fn()
    }
})

jest.mock('../../../../../auth/profileHandlers', () => {
    return {
        profileHandlers: {
            sendVerificationEmail: jest.fn(),
        }
    }
})

jest.mock('../../../../hooks/useGetUser', () => {
    return {
        __esModule: true,
        default: () => {
            return mockUser
        }
    }
})

let mockUser: any = { username: 'test', id: 'test' }

let Wrapper = ({ children }: any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
}

let mockSetError = jest.fn()
let mockSetErrorMessage = jest.fn()

describe('Profile nav button unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<ProfileNavButton setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.getByTestId('profile-nav-button')).toBeInTheDocument()
    })
    it('Shows profile if clicked', () => {
        render(<ProfileNavButton setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getByTestId('profile-nav-button'))
        expect(screen.getByText(/hi/i)).toBeInTheDocument()
    })
})