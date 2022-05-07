import React, { useState } from 'react'
import { auth } from '../../../../firebase'
import useGetUser from '../../../hooks/useGetUser'
import { profileHandlers } from '../../../../auth/profileHandlers'
import Edit from './Edit'

function Profile() {

    const [openEdit, setOpenEdit] = useState(false)

    const user = useGetUser(auth.currentUser?.uid || '')

    if (!user) return null

    return (
        <>
            {user && <section className='absolute flex flex-col -translate-x-3/4 rounded-xl min-h-[10rem] max-h-fit min-w-[15rem] max-w-[15rem] bg-tertiary'>
                <div className='h-1/2 w-full p-4 flex items-center justify-center'>
                    <p className='max-w-full text-center'>Hi, <span className='text-primary break-words'>{user.username}</span> !</p>
                </div>
                <div className='flex flex-col text-xs gap-2 flex-grow items-center justify-center'>
                    {openEdit
                        ? <Edit handler={profileHandlers.editUsername} userId={user.id} opened={setOpenEdit} />
                        : <>
                            <button onClick={() => setOpenEdit(!openEdit)} className='w-3/4 rounded cursor-pointer p-1 bg-secondary transition-all ease-in-out 150 hover:bg-primary'>Edit username</button>
                            <button onClick={() => profileHandlers.resetPassword()} className='w-3/4 rounded cursor-pointer p-1 bg-secondary transition-all ease-in-out 150 hover:bg-primary'>Reset password</button>
                            <button onClick={() => profileHandlers.sendVerificationEmail()} className='w-3/4 rounded cursor-pointer p-1 bg-secondary transition-all ease-in-out 150 hover:bg-primary'>Request confirmation email</button>
                        </>
                    }
                </div>
            </section>}
        </>
    )
}

export default Profile