import { useCollectionData } from 'react-firebase-hooks/firestore'
import { userQueries } from '../../api/userService'

/**
 * Custom hook for getting an user by ID from Firestore
 * @param userId the user's ID
 * @returns user object or null (if error)
 */

function useGetUser(userId :string) {    
    const [userCollection, , error] = useCollectionData(userQueries.getUserById(userId))
    
    if (error || !userCollection || userCollection?.length === 0) return null    
    
    return userCollection[0].user
    
}

export default useGetUser