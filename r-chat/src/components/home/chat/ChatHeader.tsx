import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserData } from '../../../api/userService'

function ChatHeader({ targetUser }: { targetUser: UserData }) {

    const { userId } = useParams()

    return (
        <div className='w-full min-h-[2rem] p-2 px-4 bg-dark text-white flex justify-between'>
            {targetUser ? <p>User: {targetUser.username}</p> : <p>Loading...</p>}
            {userId && window.innerWidth <= 768 && <Link to='/home'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </Link>}
        </div>
    )
}

export default ChatHeader