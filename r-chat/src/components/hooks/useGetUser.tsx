import { useCollectionData } from 'react-firebase-hooks/firestore'
import { userQueries } from '../../api/userService'

function useGetUser(userId :string) {    
    const [userCollection] = useCollectionData(userQueries.getUserById(userId))    
    
    if (userCollection) return userCollection[0].user

    // add error handling
    
}

export default useGetUser