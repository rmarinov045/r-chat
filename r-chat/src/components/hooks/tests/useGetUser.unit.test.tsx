import useGetUser from "../useGetUser";
import { renderHook } from "@testing-library/react";

jest.mock('react-firebase-hooks/firestore', () => {
    return {
        useCollectionData: () => mockUseCollectionData,
    }
})

let mockUseCollectionData :any = [
    [
        {
            user: {
                username: 'test'
            }
        }
    ],
    undefined,
    undefined,
]

jest.mock('../../../api/userService', () => {
    return {
        userQueries: {
            getUserById: jest.fn(),
            userQuery: jest.fn()
        }
    }
})

describe('useGetUser custom hook unit tests', () => {
    it('Returns one user when user Id is passed', () => {
        const { result } = renderHook(() => useGetUser('1'))
        expect(result.current).toHaveProperty('username')
    })
    it('Returns null if error', () => {
        mockUseCollectionData = [[], undefined, true]
        const { result } = renderHook(() => useGetUser('1'))
        expect(result.current).toBeNull()
    })
    it('Returns null if user collection is falsy', () => {
        mockUseCollectionData = [undefined, undefined, undefined]
        const { result } = renderHook(() => useGetUser('1'))
        expect(result.current).toBeNull()
    })
    it('Returns null if user collection is an empty array', () => {
        mockUseCollectionData = [[], undefined, undefined]
        const { result } = renderHook(() => useGetUser('1'))
        expect(result.current).toBeNull()
    })
})