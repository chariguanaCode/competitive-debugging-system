import React, { ReactElement } from 'react';
import useStyles from './Watches.css';
import { useCurrentTaskState, useWatchHistoryLocation } from 'reduxState/selectors';
import { useWatchActionsHistoryActions } from 'reduxState/actions';
import { WatchTree } from 'modules/Watches/components';

function Watches(): ReactElement {
    const classes = useStyles();

    const currentTask = useCurrentTaskState();

    const { setWatchHistoryLocation } = useWatchActionsHistoryActions();
    const location = useWatchHistoryLocation();

    const handleKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
        let newLocation = 0;
        if (event.key === 'ArrowRight') {
            newLocation = parseInt(location) + 1;
        }
        if (event.key === 'ArrowLeft') {
            newLocation = parseInt(location) - 1;
        }
        if (newLocation >= 0) setWatchHistoryLocation(newLocation.toString());
    };

    return (
        <div onKeyUp={handleKey} className={classes.wrapper}>
            <WatchTree data={currentTask.watchblocks || []} />
        </div>
    );
}

export default Watches;
