import React from 'react'

function Message({ message, isOwn }: { message: string, isOwn: boolean }) {

    return (
            <div style={isOwn ? { marginLeft: 'auto' } : {marginRight: 'auto', backgroundColor: '#2d383c' }} className='p-4 bg-primary w-fit max-w-[20rem] rounded-full text-white text-xs'>
                <p className='text w-full break-words'>{message}</p>
            </div>
    )
}

export default Message