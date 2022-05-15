import Profile from "../Profile";
import '@testing-library/jest-dom'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { profileHandlers } from "../../../../../auth/profileHandlers";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../../../firebase', () => {
    return {
        auth: jest.fn()
    }
})

jest.mock('firebase/firestore', () => {
    return {
        ...jest.requireActual('firebase/firestore'),
        collection: jest.fn(),
        query: jest.fn(),
    }
})

jest.mock('../../../../../auth/profileHandlers', () => {
    return {
        profileHandlers: {
            resetPassword: jest.fn(),
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
let mockUser :any = { username: 'test', id: '1' }

describe('Profile unit tests', () => {
    afterEach(() => cleanup())
    it('Renders without errors', () => {
        render(<Profile setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.getByText(/hi/i)).toBeInTheDocument()
    })
    it('Does not render if there is no user', () => {
        mockUser = null
        render(<Profile setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.queryByText(/hi/i)).not.toBeInTheDocument()
    })
    it('Shows three settings buttons if edit username field is not open', () => {
        mockUser = { username: 'test', id: '1' }
        render(<Profile setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.getAllByRole('button')).toHaveLength(3)
    })
    it('Shows edit username field on button click', () => {
        render(<Profile setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getAllByRole('button')[0])
        expect(screen.getByPlaceholderText('Enter username...')).toBeInTheDocument()
    })
    it('Calls send verification email method on button click', () => {
        render(<Profile setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getAllByRole('button')[2])
        expect((profileHandlers.sendVerificationEmail as jest.Mock)).toHaveBeenCalled()
    })
    it('Calls reset password method on button click', () => {
        render(<Profile setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getAllByRole('button')[1])
        expect((profileHandlers.resetPassword as jest.Mock)).toHaveBeenCalled()
    })
    it('Handles errors if password reset fails', () => {
        profileHandlers.resetPassword = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        })
        render(<Profile setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getAllByRole('button')[1])
        expect(mockSetError).toHaveBeenCalledWith(true)
    })
    it('Handles errors if sending a verification email fails', () => {
        profileHandlers.sendVerificationEmail = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        })
        render(<Profile setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getAllByRole('button')[2])
        expect(mockSetError).toHaveBeenCalledWith(true)
    })
})