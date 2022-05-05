import React from 'react'
import { UserData } from '../../../api/userService'
import Searchbar from './Searchbar'
import UserRow from './UserRow'

function Userlist({ users } : { users: UserData[] }) {
  return (
    <div className='container bg-dark h-full w-1/4 py-5 flex flex-col gap-10'>
      <Searchbar users={users} />
      <ul className='userlist h-5/6 p-1 flex flex-col gap-2 overflow-y-scroll'>
          {users.map(user => <UserRow user={user} key={user.id} />)}
      </ul>
    </div>
  )
}

export default Userlist