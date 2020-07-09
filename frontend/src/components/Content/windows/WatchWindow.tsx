import React, { ReactElement } from 'react';
import GlobalStateContext, { Watchblock, Watch } from '../../../utils/GlobalStateContext';
import { useContextSelector } from 'use-context-selector';
import JSONTree from '../JSONTree';

function WatchWindow(): ReactElement {
    const currentTask = useContextSelector(GlobalStateContext, (v) => v.currentTask);
    const shouldWatchblocksReload = useContextSelector(GlobalStateContext, (v) => v.shouldWatchblocksReload);
    const updateWatchblockCount = useContextSelector(GlobalStateContext, (v) => v.updateWatchblockCount);
    const updateWatchblocks = (newWatchblocks: Array<Watchblock | Watch>) => {
        console.log({ newWatchblocks });
        currentTask.watchblocks.current.children = newWatchblocks;
        updateWatchblockCount();
    };

    return <JSONTree data={currentTask.watchblocks.current.children || []} updateData={updateWatchblocks} />;
}

export default WatchWindow;
