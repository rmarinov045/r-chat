import React, { SyntheticEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userAuth } from '../../auth/auth'
import Toast from '../utils/Toast'

const initialState = {
    email: '',
    password: '',
}

function Login() {

    const [formData, setFormData] = useState(initialState)
    const [errorMessage, setErrorMessage] = useState('')

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        setLoading(true)

        const { email, password } = formData
        if (!email || !password) {
            setErrorMessage('Please fill all fields')
            setLoading(false)
            return
        }

        try {
            await userAuth.login(formData.email, formData.password)
            navigate('/home')
        } catch (error: any) {
            setErrorMessage(error.message)
            setLoading(false)
            return
        }

    }

    return (
        <main className='h-screen w-screen'>

            <section className='w-full h-full flex items-center justify-center'>
                <div className='h-1/2 w-full md:w-1/2 lg:w-1/3 text-white flex flex-col justify-center gap-20'>
                    <h1 className='text-4xl font-bold self-center'>Login in to rChat!</h1>
                    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col w-full h-full gap-10 items-center'>
                        <input autoComplete='email' onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} type="email" name="email" id="email" placeholder='john@doe.com' className='w-2/3 min-h-[2.5rem] bg-tertiary rounded-3xl px-4 outline-none border-2 border-transparent focus:border-primary transition-all ease-in-out 150' />
                        <input autoComplete='current-password' onChange={(e) => setFormData({ ...formData, password: e.target.value })} value={formData.password} type="password" name="password" id="password" placeholder='********' className='w-2/3 min-h-[2.5rem] bg-tertiary rounded-3xl px-4 outline-none border-2 border-transparent focus:border-primary transition-all ease-in-out 150' />
                        <button disabled={loading ? true : false} type="submit" className='w-2/3 bg-primary rounded-3xl min-h-[2.5rem] font-bold transition-all ease-in-out 150 hover:bg-secondary'>
                            {loading ? 'Logging in...' : 'Sign in'}
                        </button>
                        <Link to='/register'>
                            <p className='text-xs transition-all pb-2 ease-in-out 150 border-b-2 border-transparent hover:border-primary'>Don't have an account yet?</p>
                        </Link>
                    </form>
                    <div className='text-xs flex flex-col gap-2 text-center'>
                        <h2>This is an educational project. Here are two accounts, which you may use:</h2>
                        <ol>
                            <li><span className='text-primary font-bold text-sm'>Email:</span> tester1@rchat.com <span className='text-primary font-bold text-sm'>Password:</span> tester123</li>
                            <li><span className='text-primary font-bold text-sm'>Email:</span> tester2@rchat.com <span className='text-primary font-bold text-sm'>Password:</span> tester123</li>
                        </ol>
                    </div>
                </div>
            </section>
            {errorMessage && <Toast message={errorMessage} error={true} />}
        </main>
    )
}

export default Login