import React, { Dispatch, SyntheticEvent, useState } from 'react'
import { errorParser } from '../../../../auth/auth'

function Edit({ opened, handler, userId, setError, setErrorMessage }: { opened: Dispatch<boolean>, handler: Function, userId: string, setError: Dispatch<boolean>, setErrorMessage: Dispatch<string> }) {

    const [loading, setLoading] = useState(false)
    const [newUsername, setNewUsername] = useState('')

    function handleClose(e: SyntheticEvent) {
        e.preventDefault()
        opened(false)
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        setLoading(true)

        if (!newUsername) {
            setError(true)
            setErrorMessage('Please enter your new username')
            return
        }

        try {
            await handler(newUsername, userId)
            setError(false)
            setErrorMessage('Username changed successfully')
            setLoading(false)
            opened(false)

            setTimeout(() => setErrorMessage(''), 3000)

        } catch (error: any) {
            setLoading(false)
            setError(true)
            setErrorMessage(errorParser(error))

            setTimeout(() => setErrorMessage(''), 3000)
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)} className='w-full flex flex-col gap-2 flex-grow items-center justify-center'>
            <label htmlFor="edit">New username:</label>
            <input onChange={(e) => setNewUsername(e.target.value)} value={newUsername} type="text" name="edit" id="edit" placeholder='Magnificent algae' className='p-2 border-2 border-transparent rounded bg-dark text-white focus:outline-none focus:border-primary' />
            <div className='w-full flex gap-2 items-center justify-center'>
                <button type="submit" className='px-2 bg-primary p-1 rounded transition-all ease-in-out 150 hover:bg-secondary'>{loading ? 'Changing...' : 'Change'}</button>
                <button onClick={(e) => handleClose(e)} className='px-2 bg-red-600 p-1 rounded transition-all ease-in-out 150 hover:bg-red-700'>Discard</button>
            </div>
        </form>
    )
}

export default Edit