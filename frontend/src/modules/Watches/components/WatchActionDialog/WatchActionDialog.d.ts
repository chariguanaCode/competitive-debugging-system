import { WatchIdActionsModel } from 'reduxState/models';

export interface WatchActionDialogPropsModel {
    actions: WatchIdActionsModel[string];
    callIdOverview: { type: 'watch' | 'watchblock'; names: string[] };
    cds_id: string;
    anchor: null | (HTMLDivElement & EventTarget);
    onClose: () => void;
}
