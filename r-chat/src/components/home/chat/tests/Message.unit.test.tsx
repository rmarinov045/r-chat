import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Message from '../Message'

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

const Wrapper = ({ children } :any) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={children}></Route>
            </Routes>
        </BrowserRouter>
    )
}

describe('Message unit tests', () => {
    afterEach(() => cleanup())

    it('Renders message text', () => {
        render(<Message message='test' isOwn={true} timestamp={1} />, { wrapper: Wrapper })
        expect(screen.getByText(/test/i)).toBeInTheDocument()
    })
    it('Shows timestamp on click of message', () => {
        render(<Message message='test' isOwn={true} timestamp={1} />, { wrapper: Wrapper })
        fireEvent.click(screen.getByText(/test/i))
        expect(screen.getByText(/1970/i)).toBeInTheDocument()
    })
    it('Sets message\'s margin left to auto if message is from the current user', () => {
        render(<Message message='test' isOwn={true} timestamp={1} />, { wrapper: Wrapper })
        // eslint-disable-next-line testing-library/no-node-access
        expect(screen.getByText(/test/i).parentElement).toHaveStyle('margin-left: auto;')
    })
    it('Sets a message\'s margin right to auto if message is not from the current user', () => {
        render(<Message message='test' isOwn={false} timestamp={1} />, { wrapper: Wrapper })
        // eslint-disable-next-line testing-library/no-node-access
        expect(screen.getByText(/test/i).parentElement).toHaveStyle('margin-right: auto;')
    })
})