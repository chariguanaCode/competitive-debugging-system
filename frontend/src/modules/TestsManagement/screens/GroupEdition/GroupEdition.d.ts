export interface GroupEditionPropsModel {
    groupId?: string;
    closeGroupEditionDialog: () => void;
}

export interface GroupEditionStateModel {
    name: string;
    timeLimit: string;
    maximumRunningTime: string;
    isTimeLimitEnabled: boolean;
    isMaximumRunningTimeEnabled: boolean;
}
