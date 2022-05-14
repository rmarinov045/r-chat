import Login from "../Login";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { userAuth } from "../../../auth/auth";

jest.mock('../../../auth/auth', () => {
    return {
        userAuth: {
            login: jest.fn()
        }
    }
})

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: jest.fn()
    }
})

let Wrapper = ({ children } :any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
}

describe('Login view unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<Login />, { wrapper: Wrapper })
        expect(screen.getByRole('main')).toBeInTheDocument()
    })
    it('Renders link to register page', () => {
        render(<Login />, { wrapper: Wrapper })
        expect(screen.getByRole('link')).toHaveProperty('href', 'http://localhost/register')
    })
    it('Renders error if form is submitted with all fields being filled', () => {
        render(<Login />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/Fields/i)).toBeInTheDocument()
    })
    it('Calls login method if fields are filled', () => {
        render(<Login />, { wrapper: Wrapper })
        fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'test@test.com' } })
        fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'test12' } })
        fireEvent.click(screen.getByRole('button'))
        expect(userAuth.login).toHaveBeenCalled()
    })
    it('Handles login errors', () => {
        userAuth.login = jest.fn().mockImplementationOnce(() => {
            throw new Error('error')
        })
        render(<Login />, { wrapper: Wrapper })
        fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'test@test.com' } })
        fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'test12' } })
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
})