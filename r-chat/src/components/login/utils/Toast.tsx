import React from 'react'

function Toast({ message }: { [prop: string]: string }) {
    return (
        <div className='toast fixed top-10 w-[10rem] h-[3rem] bg-red-700 text-white flex items-center justify-center rounded-r-3xl'>
            <p className='text-xs'>{message}</p>
        </div>
    )
}

export default Toast