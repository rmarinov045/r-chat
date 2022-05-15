import Home from "../Home";
import '@testing-library/jest-dom'
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../firebase', () => {
    return {
        ...jest.requireActual('../../../firebase'),
        auth: { currentUser: { uid: '1' } }
    }
})

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => mockParams,
    }
})

let mockParams :any = { userId: '2' }

jest.mock('../../../api/userService', () => {
    return {
        userAPI: {
            postUsers: jest.fn(),
            getAllUsers: () => Promise.resolve(mockUsers),
            getUserByUserName: jest.fn(),
            updateDbUsername: jest.fn(),
        }
    }
})

let mockUsers :any = [
    {
        username: 'testUsername',
        id: '1',
        email: "test@test.com"
    }
]

jest.mock('../../hooks/useGetUser', () => {
    return {
        __esModule: true,
        default: jest.fn(),
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

describe('Home view unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<Home />, { wrapper: Wrapper })
        expect(screen.getByRole('main')).toBeInTheDocument()
    })
    it.skip('Fetches all users on load', () => {
        render(<Home />, { wrapper: Wrapper })
        expect(screen.getByText(/testUsername/i)).toBeInTheDocument()
    })
    // loading is set to true in child and it's not rendering users.
    // Need to mock getAllUsers to test for func calls
    it('Does not render chat window if there is no opened chat', () => {
        mockParams = { userId: null }
        render(<Home />, { wrapper: Wrapper })
        expect(screen.queryByText(/send/i)).not.toBeInTheDocument()
    })
})