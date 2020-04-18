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
    // eslint-disable-next-line
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
interface RectangleType {
    x1: number, //left bottom
    y1: number,
    x2: number, //right top
    y2: number
}

export const DoRectanglesOverclap = (a: RectangleType, b: RectangleType) => {
    let px = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
    let py = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
    if(py <= 0) return false;
    if(px <= 0) return false;
    return true;
}

export const GetRectangleRightTopAndLeftBottomCorners = (x1: number, y1: number, x2: number, y2: number) => {
    return [{ x: Math.min(x1,x2), y: Math.min(y1,y2) }, { x: Math.max(x1,x2), y: Math.max(y1,y2) }]
}