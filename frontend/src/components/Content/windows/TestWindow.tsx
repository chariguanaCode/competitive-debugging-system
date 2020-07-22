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

    return (
        <div>
            {value}
            <ul>{/*Array.from(Array(1000)).map((val, index) => (
                    <li>{index}</li>
                ))*/}</ul>
        </div>
    );
}

export default TestWindow;
