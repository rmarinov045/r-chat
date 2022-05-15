import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userAuth } from '../../auth/auth'
import { auth } from '../../firebase'
import Toast from '../utils/Toast'

function ConfirmEmail() {
    const [errorMessage, setErrorMessage] = useState('')
    const [error, setError] = useState(false)

    const [recentEmail, setRecentEmail] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const navigate = useNavigate()
    
    const user = auth.currentUser

    if (!user) {
        navigate('/')
    }

    const sendEmail = useCallback(async (isManualReq :boolean) => {
        
        if (recentEmail) {
            setTimeout(() => setRecentEmail(false), 5000)
            setError(true)
            setErrorMessage('Please wait 5 seconds before requesting again')
            setTimeout(() => setErrorMessage(''), 5000)
            return
        }

        try {
            await userAuth.sendVerificationEmail()
            setEmailSent(true)
            setRecentEmail(true)
            if (isManualReq) {                
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
    }, [recentEmail])

    useEffect(() => {
        if (user?.emailVerified || emailSent) return
        sendEmail(false)
    }, [user, sendEmail, emailSent])

    return (
        <main className='w-screen h-screen flex items-center justify-center'>
            <section className='w-5/6 md:w-1/2 h-1/2 flex flex-col items-center justify-center rounded-xl bg-tertiary text-white gap-10'>
                <div className='h-2/3 flex flex-col gap-10 items-center justify-center p-4'>
                    <h1 className='text-3xl md:text-6xl'>Thank you!</h1>
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