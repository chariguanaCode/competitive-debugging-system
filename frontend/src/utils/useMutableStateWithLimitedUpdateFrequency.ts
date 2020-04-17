import { useRef, useState, MutableRefObject } from 'react'

export default <T>(initialValue: T, delay: number) => {
    const value = useRef(initialValue)
    const timeout = useRef<null | number>(null)
    const shouldRerender = useRef(false)
    const [renderCounter, setRenderCounter] = useState(0)

    const rerender = () => {
        if (timeout.current === null) {
            shouldRerender.current = false
            setRenderCounter((val) => (val + 1) % 1000000000)
            timeout.current = setTimeout(() => {
                timeout.current = null
                if (shouldRerender.current) {
                    rerender()
                }
            }, delay)
        } else {
            shouldRerender.current = true
        }
    }

    return [value, renderCounter, rerender] as [
        MutableRefObject<T>,
        number,
        () => void
    ]
}
