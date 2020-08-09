import React from 'react';
import useStyles from './TrackedObject.css';
import { OneDimensionArray, TwoDimensionArray } from './screens';
import { useTrackedObject } from 'reduxState/selectors';

interface Props {
    config: {
        object: string;
    };
}

export const TrackedObject = ({ config }: Props) => {
    const classes = useStyles();

    const trackedObject = useTrackedObject(config.object);

    switch (trackedObject.type) {
        case 'array_1d':
            return <OneDimensionArray value={trackedObject} />;
        case 'array_2d':
            return <TwoDimensionArray value={trackedObject} />;
        default:
            return <>Invalid tracked object</>;
    }
};

export default TrackedObject;
