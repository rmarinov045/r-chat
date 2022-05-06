import React from 'react'
import { MessageData } from '../../../api/messageService'
import { UserData } from '../../../api/userService'
import { auth } from '../../../firebase'
import ChatHeader from './ChatHeader'
import Message from './Message'

function MessageContainer({ messages, targetUser }: { messages: MessageData[], targetUser: UserData }) {
    // add placeholder message if no messages yet
    return (
        <>
            <ChatHeader targetUser={targetUser} />
            <div className='msg-container w-full h-5/6 bg-tertiary p-10 overflow-y-scroll overflow-x-hidden flex flex-col gap-2'>
                {messages.length > 0 ? messages.map(message => <Message message={message.message.message} isOwn={auth.currentUser?.uid === message.message.senderId} timestamp={message.message.timestamp} key={message.message.timestamp} />) : <div className='mx-auto text-white'>No messages yet. Be the first to write!</div>}
            </div>
        </>

    )
}

export default MessageContainer