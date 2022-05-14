import LogoutButton from "../LogoutButton";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { userAuth } from "../../../../auth/auth";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../../auth/auth', () => {
    return {
        ...jest.requireActual('../../../../auth/auth'),
        userAuth: {
            login: jest.fn(),
            register: jest.fn(),
            sendVerificationEmail: jest.fn(),
            logout: jest.fn(),
            resetPassword: jest.fn(),
            editUsername: jest.fn(),
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

describe('Logout button unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<LogoutButton setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
    })
    it('Calls logout method on click', () => {
        render(<LogoutButton setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getByTestId('logout-btn'))
        expect(userAuth.logout).toHaveBeenCalled()
    })
    it('Handles errors on logout', () => {
        (userAuth.logout as jest.Mock).mockImplementationOnce(() => {
            throw new Error()
        })
        render(<LogoutButton setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getByTestId('logout-btn'))
        expect(mockSetError).toHaveBeenCalled()
    })
})