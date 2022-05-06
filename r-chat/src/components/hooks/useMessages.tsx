import { useCollectionData } from 'react-firebase-hooks/firestore'
import { queries } from '../../api/messageService'
import { auth } from '../../firebase'

function useMessages(userId: string) {

    const [messages, , error] = useCollectionData(queries.get(userId, auth.currentUser?.uid || ''))
    
    if (error) return []

    if (messages) {
        return [...Object.values(messages)].sort((a, b) => a.message.timestamp - b.message.timestamp)
    }

    return []


    // add error handling => @param useCollectionData returns error and loading states
}

export default useMessages