import React from 'react'

function Spinner() {
  return (
    <div className='fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'>
        <div className='border-2 border-r-transparent border-b-transparent border-primary min-h-[2rem] min-w-[2rem] rounded-full animate-spin'></div>
    </div>
  )
}

export default Spinner