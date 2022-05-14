import Searchbar from "../Searchbar";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../../api/userService', () => {
    return {
        userAPI: {
            postUser: jest.fn(),
            getAllUsers: () => mockGetAllUsers,
            getUserByUserName: () => mockGetUserByUserName,
            updateDbUsername: jest.fn(),
        }
    }
})

let mockGetUserByUserName = Promise.resolve([])

let mockUsers = [
    {
        username: 'test',
        id: '1',
        email: 'test@test.bg'
    },
    {
        username: 'foo',
        id: '2',
        email: 'foo@bar.com'
    }
]

let mockGetAllUsers = Promise.resolve(mockUsers)

jest.mock('../../../../firebase', () => {
    return {
        auth: jest.fn()
    }
})

jest.mock('../../../hooks/useDebounce', () => {
    return {
        __esModule: true,
        default: () => mockSearch,
    }
})

let mockSearch = ''

let Wrapper = ({ children }: any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
}

let mockSetUsers = jest.fn()
let mockLoading = jest.fn()

describe('Searchbar unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<Searchbar setUsers={mockSetUsers} loading={mockLoading} />, { wrapper: Wrapper })
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
    it('Updates search term when searching', () => {
        render(<Searchbar setUsers={mockSetUsers} loading={mockLoading} />, { wrapper: Wrapper })
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
        expect(mockLoading).toHaveBeenCalled()
    })
    it('Calls search method on change', () => {
        mockSearch = 'test'
        render(<Searchbar setUsers={mockSetUsers} loading={mockLoading} />, { wrapper: Wrapper })
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
        expect(mockSetUsers).toHaveBeenCalledWith([])
    })
    // cover error cases
})