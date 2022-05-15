import ConfirmEmail from "../ConfirmEmail";
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { userAuth } from "../../../auth/auth";
import { wait } from "@testing-library/user-event/dist/utils";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn()
    }
})

jest.mock('../../../auth/auth', () => {
    return {
        userAuth: {
            sendVerificationEmail: jest.fn()
        }
    }
})

jest.mock('../../../firebase', () => {
    return {
        auth: { currentUser: { emailVerified: false } }
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

describe('Email confirmation page unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<ConfirmEmail />, { wrapper: Wrapper })
        expect(screen.getByRole('main')).toBeInTheDocument()
    })
    it('Renders button to homepage', () => {
        render(<ConfirmEmail />, { wrapper: Wrapper })
        expect(screen.getByRole('link')).toBeInTheDocument()
    })
    it('Sends email on load if it is not verified or sent recently', () => {
        render(<ConfirmEmail />, { wrapper: Wrapper })
        expect(userAuth.sendVerificationEmail).toHaveBeenCalled()
    })
    it('Sends email on user request and if not sent recently', () => {
        render(<ConfirmEmail />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        expect(userAuth.sendVerificationEmail).toHaveBeenCalled()
    })
    it('Shows message to wait if user requests email more than once in 5 seconds', async () => {
        render(<ConfirmEmail />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        await wait(500)
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/5 seconds/i)).toBeInTheDocument()
    })
    it('Confirms email sending with message if user requests it manually', async () => {
        render(<ConfirmEmail />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        await wait(200)
        expect(screen.getByText(/Sent!/i)).toBeInTheDocument()
    })
    it('Hides confirmation message after 3 seconds when user requests email manually', async () => {
        render(<ConfirmEmail />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        await wait(3300)
        expect(screen.queryByText(/Sent!/i)).not.toBeInTheDocument()
    })
    it('Handles errors if sending an email fails', () => {
        userAuth.sendVerificationEmail = jest.fn().mockImplementationOnce(() => {
            throw new Error('error')
        })
        render(<ConfirmEmail />, { wrapper: Wrapper })
        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
})