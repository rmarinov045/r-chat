import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userAPI, UserData } from '../../api/userService'
import { auth } from '../../firebase'

import Toast from '../utils/Toast'
import ChatWindow from './chat/ChatWindow'
import Sidebar from './sidebar/Sidebar'
import Userlist from './userlist/Userlist'

function Home() {

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [users, setUsers] = useState([] as UserData[])

  const { userId } = useParams()

  const fetchUsers = useCallback(async () => {
    const usersList = await userAPI.getAllUsers()
    setUsers([...usersList.filter(user => user.id !== auth.currentUser?.uid)])
  }, [])

  useEffect(() => {

    try {
      fetchUsers()
    } catch (error: any) {
      setError(true)
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(''), 3000)
    }

    return () => {
      setError(false)
      setErrorMessage('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className='w-screen h-screen'>
      <section id='chat' className='flex w-5/6 h-full'>
        <Userlist setUsers={setUsers} users={users} />
        {userId ? <ChatWindow isError={setError} setErrorMessage={setErrorMessage} userId={userId} /> : <div className='h-5/6 w-5/6 bg-chat bg-no-repeat bg-center'></div>}
      </section>
      <Sidebar setError={setError} setErrorMessage={setErrorMessage} />
      <Toast message={errorMessage} error={error} />
    </main>
  )
}

export default Home