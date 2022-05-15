import UserRow from "../UserRow";
import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

jest.mock('firebase/auth', () => {
    return {
        getAuth: jest.fn(),
    }
})

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => mockParams
    }
})

let mockParams = { userId: '1' }

let Wrapper = ({ children } :any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
} 

let mockUser = { username: 'testUsername', id: '1', email: 'test@test.com' }

describe('User Row unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<UserRow user={mockUser} />, { wrapper: Wrapper })
        expect(screen.getByText(/testUsername/i)).toBeInTheDocument()
    })
    it('Does not show redirect link if current user in the opened is the selected user', () => {
        render(<UserRow user={mockUser} />, { wrapper: Wrapper })
        expect(screen.getByRole('link')).toHaveAttribute('href', '/')
    })
    it('Shows link to chat with user if it\'s a different user to currently opened chat', () => {
        mockUser = { username: 'test', id: '2', email: 'test@test.com' }
        render(<UserRow user={mockUser} />, { wrapper: Wrapper })
        expect(screen.getByRole('link')).toHaveAttribute('href', '/home/2')
    })
})