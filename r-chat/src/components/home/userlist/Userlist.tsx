import React, { useState } from 'react'
import { UserData } from '../../../api/userService'
import LoadingSpinner from '../../utils/LoadingSpinner'
import Searchbar from './Searchbar'
import UserRow from './UserRow'

function Userlist({ users, setUsers } : { users: UserData[], setUsers: Function }) {

  const [loading, setLoading] = useState(false)

  return (
    <div className='container bg-darker h-full w-1/4 py-5 flex flex-col gap-10'>
      <Searchbar loading={setLoading} setUsers={setUsers} />
      <ul className='userlist h-5/6 p-1 flex flex-col gap-2 overflow-y-scroll'>
          {loading ? <LoadingSpinner /> : users.length > 0 ? users.map(user => <UserRow user={user} key={user.id} />) : <li className='text-white text-center'>No results</li>}
      </ul>
    </div>
  )
}

export default Userlist