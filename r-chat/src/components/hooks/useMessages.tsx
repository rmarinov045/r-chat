import { useCollectionData } from 'react-firebase-hooks/firestore'
import { queries } from '../../api/messageService'

function useMessages(userId: string) {

    const [sentMessages] = useCollectionData(queries.sent(userId)) || []
    const [receivedMessages] = useCollectionData(queries.received(userId)) || []

    if (sentMessages && receivedMessages) {
        
        return [...Object.values(sentMessages), ...Object.values(receivedMessages)].sort((a, b) => a.message.timestamp - b.message.timestamp)
        
    }
    return []
}

export default useMessages