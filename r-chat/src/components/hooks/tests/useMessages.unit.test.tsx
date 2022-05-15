import useMessages from "../useMessages";
import { renderHook } from "@testing-library/react";

jest.mock('react-firebase-hooks/firestore', () => {
    return {
        useCollectionData: () => mockMessages,
    }
})

jest.mock('../../../api/messageService', () => {
    return {
        queries: {
            get: jest.fn(),
            getPrev: jest.fn(),
        }
    }
})

jest.mock('../../../firebase', () => {
    return {
        auth: jest.fn()
    }
})

jest.mock('firebase/auth', () => {
    return {
        ...jest.requireActual('firebase/auth'),
        getAuth: jest.fn()
    }
})

let mockMessages :any = [
    [
        {
            message: {
                message: 'test',
                id: '1',
                senderId: '2',
                receiverId: '3',
                timestamp: 1
            }
        }
    ],
    undefined,
    undefined,
]

describe('useMessages unit tests', () => {

    it('Returns array of messages', () => {
        const { result } = renderHook(() => useMessages('1'))
        expect(result.current).toHaveLength(1)
    })
    it('Returns sorted array of messages by timestamp if many', () => {
        mockMessages = [
            [
                {
                    message: {
                        message: 'test',
                        id: '1',
                        senderId: '2',
                        receiverId: '3',
                        timestamp: 2
                    }
                },
                {
                    message: {
                        message: 'first',
                        id: '2',
                        senderId: '3',
                        receiverId: '4',
                        timestamp: 1
                    }
                }
            ],
            undefined,
            undefined,
        ]

        const expected = { message: { message: 'first', id: '2', senderId: '3', receiverId: '4', timestamp: 1 } }
        const { result } = renderHook(() => useMessages('1'))
        //@ts-ignore
        expect(result.current[0]).toMatchObject(expected)
    })
    it('Returns null if there is an error', () => {
        mockMessages = [[], undefined, true]
        const { result } = renderHook(() => useMessages('1'))
        expect(result.current).toEqual(null)
    })
    it('Returns empty array if messages array is empty', () => {
        mockMessages = [[], undefined, undefined]
        const { result } = renderHook(() => useMessages('1'))
        expect(result.current).toEqual([])
    })

})