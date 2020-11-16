export interface TestsListPropsModel {
    rerenderValue: number;
    selectedTestsSet: { [key: string]: Set<string> };
    rerenderTestsList: () => any;
    searchText: string;
    openTestEditionDialog: (testId: string, groupId: string, anchorEl: any) => void;
    openGroupEditionDialog: (groupId: string, anchorEl: any) => void;
}

export interface TestsListStateModel {
    expandedGroupsIds: Set<string>;
    selectedGroupsIds: Set<string>;
    filteredTests: { [key: string]: Array<TestModel & { id: string }> };
}
