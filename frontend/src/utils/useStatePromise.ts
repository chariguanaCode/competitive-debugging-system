import { useState, useEffect } from 'react'

export default <T>(initialState: T) => {
    const [[state, cb], setState] = useState<
        [T, ((changedState: T) => any) | null]
    >([initialState, null])

    useEffect(() => {
        cb && cb(state)
    }, [state])

    const setStatePromise = (newState: T) =>
        new Promise((resolve) => setState([newState, resolve]))

    return [state, setStatePromise] as [T, (newState: T) => Promise<unknown>]
}
