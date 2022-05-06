import React from 'react'

function LoadingSpinner() {
  return (
    <div className='mx-auto h-6 w-6'>
        <div className='h-full w-full border-2 border-r-transparent border-b-transparent rounded-full border-primary animate-spin'></div>
    </div>
  )
}

export default LoadingSpinner