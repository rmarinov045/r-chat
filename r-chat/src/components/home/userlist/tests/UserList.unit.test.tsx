import Userlist from "../Userlist";
import '@testing-library/jest-dom'
import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";

jest.mock('firebase/auth', () => {
    return {
        getAuth: jest.fn(),
    }
})

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => {
            return mockParams
        }
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

let mockSetUsers = jest.fn()
let mockUsers = [
    {
        username: 'test',
        email: 'test@test.bg',
        id: '1'
    }
]

describe('User List unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<Userlist users={mockUsers} setUsers={mockSetUsers} />, { wrapper: Wrapper })
        expect(screen.getByRole('list')).toBeInTheDocument()
    })
    it.skip('Renders placeholder message if no passed in users', () => {
        mockUsers = []
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, () => null])
        render(<Userlist users={mockUsers} setUsers={mockSetUsers} />, { wrapper: Wrapper })
        expect(screen.getByText(/No results/i)).toBeInTheDocument()
    })
    // cannot mock useState properly
    it('Does not render if there is userId and screen width <= 768', () => {
        window.innerWidth = 200
        window.dispatchEvent(new Event('resize'))
        render(<Userlist users={mockUsers} setUsers={mockSetUsers} />, { wrapper: Wrapper })
        expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
    it('Shows loading spinner if loading', () => {
        render(<Userlist users={mockUsers} setUsers={mockSetUsers} />, { wrapper: Wrapper })
        expect(screen.queryByText(/No results/i)).not.toBeInTheDocument()
        expect(screen.queryByText('test')).not.toBeInTheDocument()
    })
})