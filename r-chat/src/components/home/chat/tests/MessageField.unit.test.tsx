import MessageField from "../MessageField";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { messageAPI } from "../../../../api/messageService";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../../firebase', () => {
    return {
        ...jest.requireActual('../../../../firebase'),
        auth: { currentUser: { uid: '1' } },
    }
})

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => mockUseParams,
    }
})

let mockUseParams :any = { userId: '1' }

jest.mock('../../../../api/messageService', () => {
    return {
        messageAPI: {
            sendMessage: jest.fn(),
            parseTimestamp: jest.fn(),
        }
    }
})

jest.mock('../../../../auth/auth', () => {
    return {
        errorParser: jest.fn(),
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

let mockIsError = jest.fn()
let mockSetErrorMessage = jest.fn()

describe('Message input field unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<MessageField isError={mockIsError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.getByText(/send/i)).toBeInTheDocument()
    })
    it('Renders an error if userID or target user ID are missing and user clicks on send', () => {
        mockUseParams = { userId: null }
        render(<MessageField isError={mockIsError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        expect(mockSetErrorMessage).toHaveBeenCalled()
    })
    it('Does not post message if input is empty', () => {
        render(<MessageField isError={mockIsError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        expect(messageAPI.sendMessage).toHaveBeenCalledTimes(0)
    })
    it('Posts message to DB', () => {
        mockUseParams = { userId: '2' }
        render(<MessageField isError={mockIsError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
        fireEvent.click(screen.getByRole('button'))
        expect(messageAPI.sendMessage).toHaveBeenCalled()
    })
    it('Handles error if writing to DB fails', () => {
        messageAPI.sendMessage = jest.fn().mockImplementationOnce(() => {
            throw new Error()
        })
        render(<MessageField isError={mockIsError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
        fireEvent.click(screen.getByRole('button'))
        expect(mockIsError).toHaveBeenCalled()
    })
})