import ChatWindow from "../ChatWindow";
import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

jest.mock('../../../../firebase', () => {
    return {
        ...jest.requireActual('../../../../firebase'),
        auth: jest.fn(),
    }
})

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../hooks/useGetUser', () => {
    return {
        __esModule: true,
        default: (userId: any) => targetUserMock
    }
})

jest.mock('../../../hooks/useMessages', () => {
    return {
        __esModule: true,
        default: () => mockMessages
    }
})

let targetUserMock = {
    email: 'test@test.bg',
    username: 'test',
    id: '1'
}

// let currentUserMock = {
//     email: 'test2@test.bg',
//     username: 'test2',
//     id: '2'
// }

let mockMessages :any = [
    {
        message: {
            message: 'test',
            receiverId: '1',
            senderId: '2',
            timestamp: 1,
        }
    },
    {
        message: {
            message: 'test2',
            receiverId: '2',
            senderId: '1',
            timestamp: 2,
        }
    }]

let mockUseMessages = jest.fn()

const Wrapper = ({ children }: any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
}

let mockIsError = jest.fn()
let mockSetErrorMessage = jest.fn()

describe('Chat Window unit tests', () => {
    afterEach(() => cleanup())

    it('Renders chat window without errors', () => {
        mockUseMessages.mockReturnValueOnce(mockMessages)
        render(<ChatWindow userId="2" isError={mockIsError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.getByText(/test2/i)).toBeInTheDocument()
    })
    it('Renders error if fetching messages fails', () => {
        mockMessages = null
        render(<ChatWindow userId="2" isError={mockIsError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(mockSetErrorMessage).toHaveBeenCalled()
    })
    it('Sets messages to an empty array if none are returned from the hook', () => {
        mockMessages = []
        render(<ChatWindow userId="2" isError={mockIsError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.queryByText('test2')).toBeNull()
    })
})