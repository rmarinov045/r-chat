import React, { Dispatch, useState } from 'react'
import Profile from './Profile'

function ProfileNavButton({ setError, setErrorMessage }: { setError: Dispatch<boolean>, setErrorMessage: Dispatch<string> }) {

    const [profileOpened, setProfileOpened] = useState(false)

    return (
        <>
            <div onClick={() => setProfileOpened(!profileOpened)} className='w-full text-white min-h-[3rem] cursor-pointer flex items-center transition-all ease-in-out 150 hover:text-primary'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>

            {profileOpened && <Profile setError={setError} setErrorMessage={setErrorMessage} />}
        </>
    )
}

export default ProfileNavButton