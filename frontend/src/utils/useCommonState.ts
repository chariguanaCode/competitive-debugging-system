import React, { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';

const useCommonState = <T>(
    initialState: T | ((...args: any[]) => T)
): [
    T,
    <K extends keyof T>(type: K, value: T[K] | ((arg1: T[K]) => T[K])) => void,
    <K extends keyof T>(type: K, value: T[K] | ((arg1: T) => T[K])) => void,
    Dispatch<SetStateAction<T>>
] => {
    const [state, _setState] = useState<T>(initialState);
    const setState = <K extends keyof T>(type: K, value: T[K] | ((arg1: T[K]) => T[K])) => {
        _setState((pvState: T) => ({
            ...pvState,
            [type]: value instanceof Function ? value(pvState[type]) : value,
        }));
    };
    const setStateWithFullStateAsProp = <K extends keyof T>(type: K, value: T[K] | ((arg1: T) => T[K])) => {
        _setState((pvState: T) => ({
            ...pvState,
            [type]: value instanceof Function ? value(pvState) : value,
        }));
    };
    return [state, setState, setStateWithFullStateAsProp, _setState];
};

export default useCommonState;
