import { useRef } from 'react'

export const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {
        //@ts-ignore
        htmlElRef.current && htmlElRef.current.focus()
    }
    return [htmlElRef, setFocus]
}

export const isNumeric = (number: any) => {
    return +number === +number
}

export const checkIfActiveElementIsInput = () => {
    let activeElement = document.activeElement
    let inputs = ['input', 'select', 'textarea']
    return (
        activeElement &&
        inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1
    )
}
