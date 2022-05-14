import Sidebar from "../Sidebar";
import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn(),
    }
})

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => mockUseParams,
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

let mockUseParams: any = { userId: '1' }
let mockSetError = jest.fn()
let mockSetErrorMessage = jest.fn()

describe('Sidebar unit tests', () => {
    afterEach(() => cleanup())

    it('Renders without errors', () => {
        render(<Sidebar setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.getByTestId('nav')).toBeInTheDocument()
    })
    it.skip('Is hidden if the window width <= 768 and there is an userID', async () => {
        window.innerWidth = 200
        window.innerHeight = 200
        window.dispatchEvent(new Event('resize'))
        render(<Sidebar setError={mockSetError} setErrorMessage={mockSetErrorMessage} />, { wrapper: Wrapper })
        expect(screen.queryByTestId('nav')).toBeNull()
    })
    // viewport size not updating before component is rendered
})

