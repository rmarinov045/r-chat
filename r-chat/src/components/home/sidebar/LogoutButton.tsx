import React, { SyntheticEvent } from 'react'
import { userAuth } from '../../../auth/auth'

function LogoutButton({ setError, setErrorMessage } : { setError: Function, setErrorMessage: Function }) {

    async function handleLogout(e :SyntheticEvent) {
        e.preventDefault()
        try {
            await userAuth.logout()
        } catch (error :any) {
            setError(true)
            setErrorMessage(error.message)

            setTimeout(() => setErrorMessage(''), 3000)
        }
    }

    return (
        <div onClick={(e) => handleLogout(e)} className='w-full text-white min-h-[3rem] cursor-pointer flex items-center transition-all ease-in-out 150 hover:text-primary'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        </div>
    )
}

export default LogoutButton