import React from 'react';
import { WatchIdActionsModel, WatchNodeData } from 'reduxState/models';

export interface WatchNodePropsModel {
    node: WatchNodeData;
    selected: boolean;
    actions: WatchIdActionsModel[string];
    callIdOverview: { type: 'watch' | 'watchblock'; names: string[] };
    style: React.CSSProperties;
    setBracketState: (id: string, value: boolean) => void;
    setWatchHistoryLocation: (callId: string) => void;
}
