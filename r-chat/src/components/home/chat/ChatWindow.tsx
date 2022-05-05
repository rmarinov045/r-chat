import React from 'react'
import { MessageData } from '../../../api/messageService'
import useMessages from '../../hooks/useMessages'
import MessageContainer from './MessageContainer'
import MessageField from './MessageField'

function ChatWindow({ userId }: { [userId: string]: string }) {

  const messages = useMessages(userId) as MessageData[]  
  
  return (
    <div className='w-full h-full flex flex-col'>
      <MessageContainer messages={messages} />
      <MessageField />
    </div>
  )
}

export default ChatWindow