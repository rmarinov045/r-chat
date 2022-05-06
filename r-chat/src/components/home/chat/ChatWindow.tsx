import React, { useEffect, useState } from 'react'
import { MessageData } from '../../../api/messageService'
import useGetUser from '../../hooks/useGetUser'
import useMessages from '../../hooks/useMessages'
import MessageContainer from './MessageContainer'
import MessageField from './MessageField'

function ChatWindow({ userId }: { [userId: string]: string }) {

  const [messages, setMessages] = useState<MessageData[] | []>([])
  const [loading, setLoading] = useState(false)

  const messagesList = useMessages(userId) as MessageData[]

  const targetUser = useGetUser(userId)

  useEffect(() => {
    const lastMessage = messagesList[messagesList.length - 1]

    if (messagesList.length === 0) {
      setMessages([])
      return
    }

    if (messagesList.length > messages.length || lastMessage.message.timestamp > messages[messages.length - 1].message.timestamp) {
      setMessages(messagesList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesList.length])

  return (
    <div className='w-full h-full flex flex-col'>
      <MessageContainer loading={loading} setLoading={setLoading} setMessages={setMessages} messages={messages} targetUser={targetUser} />
      <MessageField />
    </div>
  )
}

export default ChatWindow