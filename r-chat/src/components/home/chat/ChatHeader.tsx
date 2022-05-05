import React from 'react'
import { UserData } from '../../../api/userService'

function ChatHeader({ targetUser }: { targetUser: UserData }) {
    return (
        <div className='w-full min-h-[2rem] p-2 px-4 bg-dark text-white'>
            {targetUser ? <p>User: {targetUser.username}</p> : <p>Loading...</p>}
        </div>
    )
}

export default ChatHeader