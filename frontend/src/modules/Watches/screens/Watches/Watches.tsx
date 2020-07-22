import React, { ReactElement } from 'react';
import JSONTree from 'components/JSONTree';
import { Watchblock, Watch } from 'reduxState/models';
import { useCurrentTaskState } from 'reduxState/selectors';
import { useTaskStatesActions } from 'reduxState/actions';

function Watches(): ReactElement {
    const currentTask = useCurrentTaskState();
    const { setCurrentTaskWatchblocksChildren } = useTaskStatesActions();
    const updateWatchblocks = (newWatchblocks: Array<Watchblock | Watch>) => {
        console.log({ newWatchblocks });
        setCurrentTaskWatchblocksChildren(newWatchblocks);
    };

    return <JSONTree data={currentTask.watchblocks.children || []} updateData={updateWatchblocks} />;
}

export default Watches;
