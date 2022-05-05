import React, { SyntheticEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { messageAPI } from '../../../api/messageService'
import { auth } from '../../../firebase'

function MessageField() {

  const [message, setMessage] = useState('')

  const { userId } = useParams()

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    const senderId = auth.currentUser?.uid

    if (!senderId || !userId) return 
    // add error handling

    try {
      const messageObject = { message: message, senderId: senderId, receiverId: userId, timestamp: Date.now() }
      await messageAPI.sendMessage(messageObject)
      setMessage('')
    } catch (error: any) {
        console.log(error);
    }
  }


  return (
    <div className='w-full h-1/6 bg-dark flex items-center justify-center p-4'>
      <form onSubmit={(e) => handleSubmit(e)} className='flex items-center justify-center gap-20 w-full'>
        <input onChange={(e) => setMessage(e.target.value)} value={message} type="text" name="message" id="message" placeholder='Type message...' className='w-2/3 rounded-full min-h-[3rem] bg-darker p-2 px-4 text-white border-2 border-transparent focus:outline-none focus:border-primary' />
        <button type='submit' className='bg-primary text-white p-3 rounded-full px-6 transition-all ease-in-out 150 hover:bg-secondary'>Send</button>
      </form>
    </div>
  )
}

export default MessageField