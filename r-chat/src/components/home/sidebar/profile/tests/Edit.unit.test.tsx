import Edit from "../Edit";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('../../../../../auth/auth', () => {
    return {
        errorParses: jest.fn()
    }
})

let Wrapper = ({ children }: any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
}

let mockOpened = jest.fn()
let mockHandler = jest.fn()
let mockUserId = '1'
let mockSetError = jest.fn()
let mockSetErrorMessage = jest.fn()

describe('Edit button unit tests', () => {

    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<Edit opened={mockOpened} handler={mockHandler} userId={mockUserId} setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.getByText(/new/i)).toBeInTheDocument()
    })
    it('Closes edit window when clicking on X button', () => {
        render(<Edit opened={mockOpened} handler={mockHandler} userId={mockUserId} setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getAllByRole('button')[1])
        expect(mockOpened).toHaveBeenCalled()
    })
    it('Shows error if username is empty on submit', () => {
        render(<Edit opened={mockOpened} handler={mockHandler} userId={mockUserId} setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.click(screen.getAllByRole('button')[0])
        expect(mockSetError).toHaveBeenCalled()
    })
    it('Calls change username method if username is filled and user submits', () => {
        render(<Edit opened={mockOpened} handler={mockHandler} userId={mockUserId} setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
        fireEvent.click(screen.getAllByRole('button')[0])
        expect(mockHandler).toHaveBeenCalled()
    })
    it.skip('Handles errors if change fails', () => {
        mockHandler.mockImplementationOnce(() => {
            throw new Error()
        })
        render(<Edit opened={mockOpened} handler={mockHandler} userId={mockUserId} setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
        fireEvent.click(screen.getAllByRole('button')[0])
        expect(screen.queryByText(/successfully/i)).not.toBeInTheDocument()
        expect(mockSetErrorMessage).toHaveBeenCalled()
    })
    // Promise rejection not being handled
})
