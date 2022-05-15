import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatHeader from "../ChatHeader";
import '@testing-library/jest-dom'

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        auth: jest.fn(),
    }
})

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom') as any,
        useParams: () => mockUseParams
    }
})

let mockUseParams = { userId: 1 }

const mockUser = {
    username: 'test',
    email: 'test@test.com',
    id: '1'
}

const Wrapper = ({ children }: any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
}

describe('Chat Header unit tests', () => {
    afterEach(() => cleanup())
    afterEach(() => jest.resetAllMocks())

    it('Renders correct username', () => {
        render(<ChatHeader targetUser={mockUser} />, { wrapper: Wrapper })
        expect(screen.getByText(/test/i)).toBeInTheDocument()
    })
    it('Renders placeholder if no user is passed', () => {
        //@ts-ignore
        render(<ChatHeader targetUser={{}} />, { wrapper: Wrapper })
        expect(screen.queryByText(/test/i)).toBeNull()
    })
    it('Renders link if user ID and target user ID match and if screen width <= 768', () => {
        window.innerWidth = 768
        window.innerHeight = 1024
        window.dispatchEvent(new Event('resize'))
        render(<ChatHeader targetUser={mockUser} />, { wrapper: Wrapper })
        expect(screen.getByRole('link')).toBeInTheDocument()
    })
})