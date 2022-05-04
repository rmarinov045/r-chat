import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userAuth } from '../../auth/auth'
import { auth } from '../../firebase'
import Toast from '../utils/Toast'

function ConfirmEmail() {
    const [errorMessage, setErrorMessage] = useState('')
    const [error, setError] = useState(false)

    const user = useCallback(() => {
        return auth.currentUser
    }, [])

    const sendEmail = async (manual: boolean) => {
        try {
            await userAuth.sendVerificationEmail()
            if (manual) {
                setErrorMessage('Sent!')
                setError(false)

                setTimeout(() => {
                    setErrorMessage('')
                }, 3000)
            }

        } catch (error: any) {
            setErrorMessage(error.message)
            setError(true)
        }
    }

    useEffect(() => {
        if (user()?.emailVerified) return
        sendEmail(false)
    }, [user])

    return (
        <main className='w-screen h-screen flex items-center justify-center'>
            <section className='w-1/2 h-1/2 flex flex-col items-center justify-center rounded-xl bg-tertiary text-white gap-10'>
                <div className='h-2/3 flex flex-col gap-10 items-center justify-center p-4'>
                    <h1 className='text-6xl'>Thank you!</h1>
                    <p>A verification email has been sent to your inbox.</p>
                    <Link to='/home' className='bg-primary p-3 rounded transition-all ease-in-out 150 hover:bg-secondary'>Now take me to the homepage!</Link>
                </div>
                <div className='w-full h-1/3 flex items-end justify-center py-4'>
                    <button onClick={() => sendEmail(true)} className='text-xs transition-all ease-in-out 150 hover:text-primary'>Not received? Click here to request another email</button>
                </div>
            </section>
            {errorMessage && <Toast message={errorMessage} error={error} />}
        </main>
    )
}

export default ConfirmEmail