import Register from "../Register";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { userAuth } from "../../../auth/auth";

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => jest.fn(),
    }
})

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../api/userService', () => {
    return {
        userAPI: {
            postUser: jest.fn()
        }
    }
})

jest.mock('../../../auth/auth', () => {
    return {
        userAuth: {
            register: jest.fn().mockResolvedValue({ user: { uid: '1' } }),
        }
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

describe('Register view unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<Register />, { wrapper: Wrapper })
        expect(screen.getByRole('button')).toBeInTheDocument()
    })
    it('Renders link to login page', () => {
        render(<Register />, { wrapper: Wrapper })
        expect(screen.getByRole('link')).toHaveProperty('href', 'http://localhost/')
    })
    it('Renders error if email field is not filled', () => {
        render(<Register />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/fields/i)).toBeInTheDocument()
    })
    it('Renders error if password is not filled', () => {
        render(<Register />, { wrapper: Wrapper })
        fireEvent.change(screen.getByPlaceholderText('john@doe.com'), { target: { value: 'test@test.com' } })
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/fields/i)).toBeInTheDocument()
    })
    it('Renders error if confirm password field is not filled', () => {
        render(<Register />, { wrapper: Wrapper })
        fireEvent.change(screen.getByPlaceholderText('john@doe.com'), { target: { value: 'test@test.com' } })
        fireEvent.change(screen.getAllByPlaceholderText('********')[0], { target: { value: 'test123' } })
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/fields/i)).toBeInTheDocument()
    })
    it('Renders error if password and confirmation do not match', () => {
        render(<Register />, { wrapper: Wrapper })
        fireEvent.change(screen.getByPlaceholderText('john@doe.com'), { target: { value: 'test@test.com' } })
        fireEvent.change(screen.getAllByPlaceholderText('********')[0], { target: { value: 'test123' } })
        fireEvent.change(screen.getAllByPlaceholderText('********')[1], { target: { value: 'test12' } })
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/match/i)).toBeInTheDocument()
    })
    it('Calls register method if form fields are valid', () => {
        render(<Register />, { wrapper: Wrapper })
        fireEvent.change(screen.getByPlaceholderText('john@doe.com'), { target: { value: 'test@test.com' } })
        fireEvent.change(screen.getAllByPlaceholderText('********')[0], { target: { value: 'test123' } })
        fireEvent.change(screen.getAllByPlaceholderText('********')[1], { target: { value: 'test123' } })
        fireEvent.click(screen.getByRole('button'))
        expect(userAuth.register).toHaveBeenCalled()
    })
    it('Handles errors when registering fails', () => {
        userAuth.register = jest.fn().mockImplementationOnce(() => {
            throw new Error('error')
        })
        render(<Register />, { wrapper: Wrapper })
        fireEvent.change(screen.getByPlaceholderText('john@doe.com'), { target: { value: 'test@test.com' } })
        fireEvent.change(screen.getAllByPlaceholderText('********')[0], { target: { value: 'test123' } })
        fireEvent.change(screen.getAllByPlaceholderText('********')[1], { target: { value: 'test123' } })
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
})
