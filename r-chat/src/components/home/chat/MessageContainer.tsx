import { getDocs } from 'firebase/firestore'
import React, { Dispatch, SyntheticEvent, useCallback, useEffect, useRef } from 'react'
import { MessageData, queries } from '../../../api/messageService'
import { UserData } from '../../../api/userService'
import { auth } from '../../../firebase'
import LoadingSpinner from '../../utils/LoadingSpinner'
import ChatHeader from './ChatHeader'
import Message from './Message'

function MessageContainer({ messages, targetUser, setMessages, setLoading, loading }: { messages: MessageData[], targetUser: UserData, setMessages: Dispatch<any>, setLoading: Dispatch<boolean>, loading: boolean }) {

    const chatBottomElement = useRef<HTMLDivElement | null>(null)
    const currentMessageLength = messages.length

    let firstTimestamp = messages.length && messages[0].message.timestamp

    const fetchPrevMessages = useCallback(async (targetUserId: string) => {
        const result: any[] = []
        
        const messagesSnapshot = await getDocs(queries.getPrev(targetUserId, auth.currentUser?.uid || '', firstTimestamp))
        messagesSnapshot.forEach(m => result.push(m.data()))

        if (result.length === 0 ) {
            setLoading(false)
            return
        }
        setLoading(true)

        setMessages((prev: MessageData[]) => [...result, ...prev].sort((a, b) => a.message.timestamp - b.message.timestamp))

        setLoading(false)
    }, [firstTimestamp, setMessages, setLoading])

    function handleScroll(e: SyntheticEvent) {

        if (messages.length === 0) return

        const el = e.target as HTMLDivElement
        if (el.scrollTop === 0) {
            fetchPrevMessages(targetUser.id)
        }
    }

    useEffect(() => {
        if (chatBottomElement.current && messages.length > currentMessageLength) {
            chatBottomElement.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [currentMessageLength, messages.length])

    return (
        <>
            <ChatHeader targetUser={targetUser} />
            <div onScroll={(e) => handleScroll(e)} className='msg-container w-full h-5/6 bg-tertiary p-10 overflow-y-scroll overflow-x-hidden flex flex-col gap-2'>
                {loading ? <LoadingSpinner /> : messages.length > 0 ? messages.map(message => <Message message={message.message.message} isOwn={auth.currentUser?.uid === message.message.senderId} timestamp={message.message.timestamp} key={message.message.timestamp} />) : <div className='mx-auto text-white'>No messages yet. Be the first to write!</div>}
                <div ref={chatBottomElement}></div>
            </div>
        </>

    )
}

export default MessageContainer