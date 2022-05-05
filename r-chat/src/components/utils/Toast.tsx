import React from 'react'

function Toast({ message, error }: { message: string, error: boolean }) {

    if (!message) return null

    return (
        <div style={error ? {backgroundColor: '#b91c1c'} : {backgroundColor: '#65a30d'}} className='toast fixed top-10 left-0 w-[10rem] min-w-fit p-2 h-[3rem] text-white flex items-center justify-center rounded-r-3xl'>
            <p className='text-xs'>{message}</p>
        </div>
    )
}

export default Toast