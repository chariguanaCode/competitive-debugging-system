import React, { ReactElement, useState, useEffect } from 'react';

function TestWindow(): ReactElement {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setValue((prev) => prev + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return <div>{value}</div>;
}

export default TestWindow;
