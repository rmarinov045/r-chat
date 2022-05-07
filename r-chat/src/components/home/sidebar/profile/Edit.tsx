import React, { Dispatch, SyntheticEvent, useState } from 'react'

function Edit({ opened, handler, userId }: { opened: Dispatch<boolean>, handler: Function, userId: string }) {

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
            // add error handling
        }

        try {
            await handler(newUsername, userId)
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            console.log(error);
        }
    }

    // recheck with new user (old ones have invalid IDs => check if the DB function handles the field change correctly)

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