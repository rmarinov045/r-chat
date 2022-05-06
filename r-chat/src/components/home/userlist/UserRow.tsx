import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { UserData } from '../../../api/userService'

function UserRow({ user }: { user: UserData }) {

  const { userId } = useParams()

  return (
    <NavLink to={userId === user.id ? '#' : `/home/${user.id}`}>
      <li className='min-h-[3.5rem] bg-tertiary rounded text-white text-sm flex items-center justify-center cursor-pointer transition-all ease-in-out 150 hover:bg-secondary'>
        <p className='text-ellipsis overflow-hidden px-2'>{user.username}</p>
      </li>
    </NavLink>
  )
}

export default UserRow