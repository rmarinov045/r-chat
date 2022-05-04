import React, { SyntheticEvent, useState } from 'react'
import Toast from './utils/Toast'

const initialState = {
    email: '',
    password: '',
}

function Login() {

    const [formData, setFormData] = useState(initialState)
    const [errorMessage, setErrorMessage] = useState('')

    async function handleSubmit(e :SyntheticEvent) {
        e.preventDefault()
        const { email, password } = formData
        if (!email || !password) {
            setErrorMessage('Please fill all fields')
            return
        }
    }

    return (
        <main className='h-screen w-screen'>
            <section className='w-full h-full flex items-center justify-center'>
                <div className='h-1/2 w-1/2 text-white flex flex-col justify-center gap-20'>
                    <h1 className='text-4xl font-bold self-center'>Login in to rChat!</h1>
                    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col w-full h-full gap-10 items-center'>
                        <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} type="email" name="email" id="email" placeholder='john@doe.com' className='w-2/3 min-h-[2.5rem] bg-tertiary rounded-3xl px-4 outline-none border-2 border-transparent focus:border-primary transition-all ease-in-out 150' />
                        <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} value={formData.password} type="password" name="password" id="password" placeholder='********' className='w-2/3 min-h-[2.5rem] bg-tertiary rounded-3xl px-4 outline-none border-2 border-transparent focus:border-primary transition-all ease-in-out 150' />
                        <button type="submit" className='w-2/3 bg-primary rounded-3xl min-h-[2.5rem] font-bold transition-all ease-in-out 150 hover:bg-secondary'>Sign in</button>
                    </form>
                </div>
            </section>
            {errorMessage && <Toast message={errorMessage} />}
        </main>
    )
}

export default Login