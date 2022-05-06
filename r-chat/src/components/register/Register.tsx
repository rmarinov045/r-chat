import React, { SyntheticEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userAPI } from '../../api/userService'
import { userAuth } from '../../auth/auth'
import Toast from '../utils/Toast'

const initialState = {
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
}

function Register() {

    const [formData, setFormData] = useState(initialState)
    const [errorMessage, setErrorMessage] = useState('')

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        setLoading(true)
        if (!formData.password || !formData.confirmPassword || !formData.email) {
            setErrorMessage('Please fill all fields!')
            setLoading(false)
            return
        }
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords must match')
            setLoading(false)
            return
        }

        try {
            const newUser = await userAuth.register(formData.email, formData.password)
            await userAPI.postUser({ email: formData.email, username: formData.username, id: newUser.user.uid })
            navigate('confirm-email')
        } catch (error: any) {
            setErrorMessage(error.message)
            setLoading(false)
            return
        }
    }

    return (
        <main className='h-screen w-screen'>
            <section className='w-full h-full flex items-center justify-center'>
                <div className='h-2/3 w-1/2 text-white flex flex-col justify-center gap-20'>
                    <h1 className='text-4xl font-bold self-center'>Sign up to rChat!</h1>
                    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col w-full h-full gap-5 items-center'>
                        <label htmlFor="email">Email:</label>
                        <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} type="email" name="email" id="email" placeholder='john@doe.com' className='w-2/3 min-h-[2.5rem] bg-tertiary rounded-3xl px-4 outline-none border-2 border-transparent focus:border-primary transition-all ease-in-out 150' />
                        <label htmlFor="password">Username:</label>
                        <input onChange={(e) => setFormData({ ...formData, username: e.target.value })} value={formData.username} type="username" name="username" id="username" placeholder='John' className='w-2/3 min-h-[2.5rem] bg-tertiary rounded-3xl px-4 outline-none border-2 border-transparent focus:border-primary transition-all ease-in-out 150' />
                        <label htmlFor="password">Password:</label>
                        <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} value={formData.password} type="password" name="password" id="password" placeholder='********' className='w-2/3 min-h-[2.5rem] bg-tertiary rounded-3xl px-4 outline-none border-2 border-transparent focus:border-primary transition-all ease-in-out 150' />
                        <label htmlFor="password">Confirm password:</label>
                        <input onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} value={formData.confirmPassword} type="password" name="confirm-password" id="confirm-password" placeholder='********' className='w-2/3 min-h-[2.5rem] bg-tertiary rounded-3xl px-4 outline-none border-2 border-transparent focus:border-primary transition-all ease-in-out 150' />
                        <button disabled={loading ? true : false} type="submit" className='w-2/3 mt-10 bg-primary rounded-3xl min-h-[2.5rem] font-bold transition-all ease-in-out 150 hover:bg-secondary'>
                            {loading ? 'Please wait...' : 'Register'}
                        </button>
                        <Link to='/'>
                            <p className='text-xs transition-all pb-2 ease-in-out 150 border-b-2 border-transparent hover:border-primary'>Already have an account? Go back!</p>
                        </Link>
                    </form>
                </div>
            </section>
            {errorMessage && <Toast message={errorMessage} error={true} />}
        </main>
    )
}

export default Register