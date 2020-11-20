import React, { useRef, useEffect } from 'react';

const usePreviousEffect = (fn: (...arg: any[]) => any, trackedValues: any[] = []) => {
    const previousValuesRef = useRef([...trackedValues]);

    useEffect(() => {
        fn(previousValuesRef.current);
        previousValuesRef.current = [...trackedValues];
    }, trackedValues);
};

export default usePreviousEffect;
