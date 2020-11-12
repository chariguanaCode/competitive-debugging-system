export interface TestsListPropsModel {
    rerenderValue: number;
    selectedTestsSet: { [key: string]: Set<string> };
    rerenderTestsList: () => any;
    searchText: string;
}

export interface TestsListStateModel {
    expandedGroupsIds: Set<string>;
    selectedGroupsIds: Set<string>;
    filteredTests: { [key: string]: Array<TestModel & { id: string }> };
}
