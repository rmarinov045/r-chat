import { useCollectionData } from 'react-firebase-hooks/firestore'
import { queries } from '../../api/messageService'
import { auth } from '../../firebase'

/**
 * Custom hook for getting the last 25 messages between two users
 * @param userId target user ID
 * @returns array of messages (if any), empty array (if none), null (if error)
 */

function useMessages(userId: string) {

    const [messages, , error] = useCollectionData(queries.get(userId, auth.currentUser?.uid || ''))
    
    if (error) return null

    if (messages && messages.length > 0) {
        return [...Object.values(messages)].sort((a, b) => a.message.timestamp - b.message.timestamp)
    }

    return []
}

export default useMessages