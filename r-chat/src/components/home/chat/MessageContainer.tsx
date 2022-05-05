import React from 'react'
import { MessageData } from '../../../api/messageService'
import { auth } from '../../../firebase'
import Message from './Message'

function MessageContainer({ messages } : { messages: MessageData[]}) {
    
    return (
        <div className='msg-container w-full h-5/6 bg-tertiary p-10 overflow-y-scroll overflow-x-hidden flex flex-col gap-2'>
            {messages.length > 0 ? messages.map(message => <Message message={message.message.message} isOwn={auth.currentUser?.uid === message.message.senderId} key={message.message.timestamp} />) : <></>}
        </div>
    )
}

export default MessageContainer