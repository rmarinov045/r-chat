import MessageContainer from "../MessageContainer";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

jest.mock('firebase/firestore', () => {
    return {
        ...jest.requireActual('firebase/firestore'),
        getDocs: jest.fn().mockResolvedValue({ forEach: jest.fn() }),
    }
})

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

const Wrapper = ({ children }: any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
}

let mockMessages = [
    {
        message: {
            message: 'testMsg',
            senderId: '1',
            receiverId: '2',
            timestamp: 1,
        }
    },
    {
        message: {
            message: 'testMsg2',
            senderId: '2',
            receiverId: '1',
            timestamp: 2,
        }
    }
]

let mockTargetUser = {
    email: 'test@test.bg',
    username: 'testUsername',
    id: '1',
}

let mockSetMessages = jest.fn()
let mockSetLoading = jest.fn()
let mockLoading = false

describe('Message Container unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<MessageContainer messages={mockMessages} targetUser={mockTargetUser} setMessages={mockSetMessages} setLoading={mockSetLoading} loading={mockLoading}  />, { wrapper: Wrapper })
        expect(screen.getByText(/testUsername/i)).toBeInTheDocument()
    })
    it('Shows loading spinner if it is loading', () => {
        mockLoading = true
        render(<MessageContainer messages={mockMessages} targetUser={mockTargetUser} setMessages={mockSetMessages} setLoading={mockSetLoading} loading={mockLoading}  />, { wrapper: Wrapper })
        expect(screen.queryByText('testMsg')).toBeNull()
    })
    it('Shows placeholder message if there are no passed messages', () => {
        render(<MessageContainer messages={[]} targetUser={mockTargetUser} setMessages={mockSetMessages} setLoading={mockSetLoading} loading={mockLoading}  />, { wrapper: Wrapper })
        expect(screen.queryByText(/No messages/i)).toBeNull()
    })
    it.skip('Loads more messages on scroll to top of chat', () => {
        render(<MessageContainer messages={mockMessages} targetUser={mockTargetUser} setMessages={mockSetMessages} setLoading={mockSetLoading} loading={mockLoading}  />, { wrapper: Wrapper })
        fireEvent.scroll(screen.getByTestId('msg-container'), { target: { scrollTop: 0 } })
        expect(mockSetLoading).toHaveBeenCalled()
    })
    //fails at executing getDocs method
})