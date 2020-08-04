import { useRef } from 'react';

export const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
        //@ts-ignore
        htmlElRef.current && htmlElRef.current.focus();
    };
    return [htmlElRef, setFocus] as const;
};

export const isNumeric = (number: any) => {
    // eslint-disable-next-line
    return +number === +number;
};

export const checkIfActiveElementIsInput = () => {
    let activeElement = document.activeElement;
    let inputs = ['input', 'select', 'textarea'];
    return activeElement && inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1;
};
interface RectangleType {
    x1: number; //left bottom
    y1: number;
    x2: number; //right top
    y2: number;
}

export const doRectanglesOverclap = (a: RectangleType, b: RectangleType) => {
    let px = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
    let py = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
    if (py <= 0) return false;
    if (px <= 0) return false;
    return true;
};

export const getRectangleRightTopAndLeftBottomCorners = (x1: number, y1: number, x2: number, y2: number) => {
    return [
        { x: Math.min(x1, x2), y: Math.min(y1, y2) },
        { x: Math.max(x1, x2), y: Math.max(y1, y2) },
    ];
};

export const sortStringCompare = (string1: string, string2: string) => string1 < string2;
//return (string1.length < string2.length ? true : (string1.length === string2.length ? string1 < string2 : false))

export const isRightButton = (e: any) => ('which' in e ? e.which == 3 : 'button' in e ? e.button == 2 : false);
// Gecko (Firefox), WebKit (Safari/Chrome) & Opera // IE, Opera

export const parsePath = (path: string) => (path !== '/' && path[path.length - 1] === '/' ? path.slice(0, -1) : path);

export const getPathRootDirectory = (path: string) => {
    path = parsePath(path);
    if (path[0] === '/') return '/';
    return path.split('/')[0];
};

export const mergeArrays = (arr1: Array<any>, arr2: Array<any>) => [...new Set([...arr1, ...arr2])];

export const asyncForEach = async (array: Array<any>, callback: Function) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

