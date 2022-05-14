import React, { Dispatch } from 'react'
import { useParams } from 'react-router-dom'
import LogoutButton from './LogoutButton'
import ProfileNavButton from './profile/ProfileNavButton'

function Sidebar({ setError, setErrorMessage }: { setError: Dispatch<boolean>, setErrorMessage: Dispatch<string> }) {

  const { userId } = useParams()

  return (
    <aside data-testid='nav' id='nav' style={userId && window.innerWidth <= 768 ? { display: 'none' } : {}} className='fixed rounded-full top-1/2 right-3 h-1/4 -translate-y-1/2 min-w-[3rem] flex flex-col items-center justify-center bg-tertiary text-white gap-5'>

      <ProfileNavButton setError={setError} setErrorMessage={setErrorMessage} />

      <LogoutButton setError={setError} setErrorMessage={setErrorMessage} />

    </aside>
  )
}

export default Sidebar