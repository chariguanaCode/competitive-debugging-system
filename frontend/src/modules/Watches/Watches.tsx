import React from 'react';
import useStyles from './Watches.css';
import { Watches as WatchesScreen } from './screens';

export const Watches = () => {
    const classes = useStyles();
    return <WatchesScreen />;
};

export default Watches;
