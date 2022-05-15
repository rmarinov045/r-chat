import useDebounce from "../useDebounce";
import { renderHook } from '@testing-library/react'

describe('Use debounce unit tests', () => {
    it('Should return passed value after delay', async () => {
        const { result } = renderHook(() => useDebounce('test', 500))
        expect(result.current).toEqual('test')
    })
})