import React from 'react'
import LogoutButton from './LogoutButton'

function Sidebar({ setError, setErrorMessage }: { setError: Function, setErrorMessage: Function }) {
  return (
    <aside id='nav' className='fixed rounded-full top-1/2 right-3 h-1/4 -translate-y-1/2 min-w-[3rem] flex flex-col items-center justify-center bg-tertiary text-white'>



      <LogoutButton setError={setError} setErrorMessage={setErrorMessage} />

    </aside>
  )
}

export default Sidebar