export interface TestsGroupFormPropsModel {
    testsGroupsArray: Array<{
        name: string;
        id: string;
    }>;
    selectedTestsGroupId: string;
    setSelectedTestsGroupId: (groupId: string) => any;
    addGroup: () => string;
}

export interface TestsGroupFormStateModel {}
