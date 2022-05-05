import React from 'react'
import { MessageData } from '../../../api/messageService'
import useGetUser from '../../hooks/useGetUser'
import useMessages from '../../hooks/useMessages'
import MessageContainer from './MessageContainer'
import MessageField from './MessageField'

function ChatWindow({ userId }: { [userId: string]: string }) {

  const messages = useMessages(userId) as MessageData[]  

  const targetUser = useGetUser(userId)    
  
  return (
    <div className='w-full h-full flex flex-col'>
      <MessageContainer messages={messages} targetUser={targetUser}  />
      <MessageField />
    </div>
  )
}

export default ChatWindow