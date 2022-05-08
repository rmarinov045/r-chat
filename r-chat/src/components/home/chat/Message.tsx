import React, { useState } from 'react'
import { messageAPI } from '../../../api/messageService'

function Message({ message, isOwn, timestamp }: { message: string, isOwn: boolean, timestamp: number }) {

    const [showTimestamp, setShowTimestamp] = useState(false)

    return (
        <>
            <div onClick={() => setShowTimestamp(!showTimestamp)} style={isOwn ? { marginLeft: 'auto' } : { marginRight: 'auto', backgroundColor: '#2d383c' }} className='p-4 bg-primary w-fit max-w-[20rem] rounded-full text-white text-xs transition-all ease-in-out 150 hover:cursor-pointer hover:brightness-75'>
                <p className='text w-full break-words'>{message}</p>
            </div>
            {showTimestamp && <p style={isOwn ? { marginLeft: 'auto' } : { marginRight: 'auto' }} className='text-[10px] text-gray-400'>{messageAPI.parseTimestamp(timestamp)}</p>}
        </>
    )
}

export default Message