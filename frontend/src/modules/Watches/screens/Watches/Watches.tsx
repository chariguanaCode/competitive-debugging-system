import React, { ReactElement } from 'react';
import useStyles from './Watches.css';
import JSONTree from 'components/JSONTree';
import { Watchblock, Watch } from 'reduxState/models';
import { useCurrentTaskState, useWatchHistoryLocation } from 'reduxState/selectors';
import { useTaskStatesActions, useWatchActionsHistoryActions } from 'reduxState/actions';

function Watches(): ReactElement {
    const classes = useStyles();

    const currentTask = useCurrentTaskState();
    const { setCurrentTaskWatchblocksChildren } = useTaskStatesActions();
    const updateWatchblocks = (newWatchblocks: Array<Watchblock | Watch>) => {
        console.log({ newWatchblocks });
        setCurrentTaskWatchblocksChildren(newWatchblocks);
    };

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
            <JSONTree data={currentTask.watchblocks.children || []} updateData={updateWatchblocks} />;
        </div>
    );
}

export default Watches;
