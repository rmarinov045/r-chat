import { useCollectionData } from 'react-firebase-hooks/firestore'
import { queries } from '../../api/messageService'

function useMessages(userId: string) {

    const sentMessages = useCollectionData(queries.sent(userId)) || []
    const receivedMessages = useCollectionData(queries.received(userId)) || []

    if (sentMessages[0] && receivedMessages[0]) {
        
        return [...Object.values(sentMessages[0]), ...Object.values(receivedMessages[0])].sort((a, b) => a.message.timestamp - b.message.timestamp)
        
    }
    return []
}

export default useMessages