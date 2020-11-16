import React, { useState, memo, useEffect } from 'react';
import { TestListElement, GroupListElement } from './components';
import useStyles from './TestsList.css';
import { TestsListPropsModel, TestsListStateModel } from './TestsList.d';
import { List, AutoSizer } from 'react-virtualized';
import { useConfig } from 'reduxState/selectors';
import { TestModel } from 'reduxState/models';
import { useConfigActions } from 'reduxState/actions';
import { useCommonState } from 'utils';

const arePropsEqual = (prevProps: TestsListPropsModel, nextProps: TestsListPropsModel) => {
    return prevProps.rerenderValue === nextProps.rerenderValue && prevProps.searchText === nextProps.searchText;
};

export const TestsList: React.FunctionComponent<TestsListPropsModel> = memo(
    ({ selectedTestsSet, rerenderValue, rerenderTestsList, searchText, openTestEditionDialog, openGroupEditionDialog }) => {
        const classes = useStyles();
        const config = useConfig();
        const [state, setState] = useCommonState<TestsListStateModel>({
            expandedGroupsIds: new Set(),
            selectedGroupsIds: new Set(),
            filteredTests: {},
        });

        // filter text by searchText
        useEffect(() => {
            let regexExp: RegExp | null = null;
            try {
                regexExp = new RegExp(searchText);
            } catch {}
            let newFilteredTests: typeof state.filteredTests = {};
            Object.entries(config.tests.groups).forEach(([groupId, groupObject]) => {
                newFilteredTests[groupId] = [];
                Object.entries(groupObject.tests).forEach(([testId, testObject]) => {
                    if (!regexExp || regexExp.test(testObject.name)) {
                        newFilteredTests[groupId].push({
                            id: testId,
                            ...testObject,
                        });
                    }
                });
            });
            setState('filteredTests', newFilteredTests);
        }, [config.tests.groups, searchText]);

        const { removeTests, removeTestsGroups } = useConfigActions();

        const setAllCheckboxesValues = (groupId: string, newCheckboxesValue: boolean) => {
            if (!selectedTestsSet.hasOwnProperty(groupId)) selectedTestsSet[groupId] = new Set();
            state.filteredTests[groupId].forEach((test) => {
                if (newCheckboxesValue) selectedTestsSet[groupId].add(test.id);
                else selectedTestsSet[groupId].delete(test.id);
            });
            if (selectedTestsSet[groupId].size === 0) delete selectedTestsSet[groupId];
            rerenderTestsList();
        };

        const renderRow = (
            { index, key, style }: { index: number; key: string; style: any },
            sourceArray: ({ id: string } & TestModel)[],
            groupId: string
        ) => {
            const testId = sourceArray[index].id;
            return (
                <div key={key} style={style}>
                    <TestListElement
                        testObject={sourceArray[index]}
                        isSelected={groupId in selectedTestsSet && selectedTestsSet[groupId].has(testId)}
                        setCheckboxValue={(newValue: boolean) => {
                            if(!(groupId in selectedTestsSet))
                                selectedTestsSet[groupId] = new Set();
                            if (newValue) selectedTestsSet[groupId].add(testId);
                            else selectedTestsSet[groupId].delete(testId);
                            if (selectedTestsSet[groupId].size === 0) {
                                delete selectedTestsSet[groupId];
                            }
                            rerenderTestsList();
                        }}
                        clickRemoveButton={(e: any) =>
                            removeTests({
                                [groupId]: [testId],
                            })
                        }
                        clickEditButton={(e: any) => {
                            e.persist();
                            openTestEditionDialog(testId, groupId, e.currentTarget);
                        }}
                    />
                </div>
            );
        };

        return (
            <>
                <div className={classes.TestsList}>
                    {Object.keys(config.tests.groups).map((groupId) => {
                        const group = config.tests.groups[groupId];
                        const groupTests = state.filteredTests[groupId] ? state.filteredTests[groupId] : [];
                        const isGroupExpanded = state.expandedGroupsIds.has(groupId);
                        return (
                            <div key={groupId}>
                                <GroupListElement
                                    // TODO: MORE EFFICIENT WAY TO GET LENGTH OF TESTS
                                    groupObject={{ id: groupId, name: group.name, testsAmount: groupTests.length }}
                                    isExpanded={isGroupExpanded}
                                    clickRemoveButton={() => removeTestsGroups([groupId])}
                                    clickExpandGroupButton={() => {
                                        let newExpandedGroupsIdsSet = new Set(state.expandedGroupsIds);
                                        if (newExpandedGroupsIdsSet.has(groupId)) newExpandedGroupsIdsSet.delete(groupId);
                                        else newExpandedGroupsIdsSet.add(groupId);
                                        setState('expandedGroupsIds', newExpandedGroupsIdsSet);
                                    }}
                                    clickEditButton={(e: any) => {
                                        e.persist();
                                        openGroupEditionDialog(groupId, e.currentTarget);
                                    }}
                                    isSelected={state.selectedGroupsIds.has(groupId)}
                                    setCheckboxValue={(newValue: boolean) => {
                                        let selectedGroupsIdsSet = new Set(state.selectedGroupsIds);
                                        if (selectedGroupsIdsSet.has(groupId)) selectedGroupsIdsSet.delete(groupId);
                                        else selectedGroupsIdsSet.add(groupId);
                                        setAllCheckboxesValues(groupId, newValue);
                                        setState('selectedGroupsIds', selectedGroupsIdsSet);
                                    }}
                                />
                                {isGroupExpanded && groupTests.length > 0 && (
                                    <div className={classes.testsList}>
                                        <AutoSizer>
                                            {({ width, height }) => (
                                                <List
                                                    rowRenderer={(props) => renderRow(props, groupTests, groupId)}
                                                    width={width}
                                                    height={height}
                                                    rowCount={groupTests ? groupTests.length : 0}
                                                    rowHeight={30}
                                                    overscanRowCount={5}
                                                ></List>
                                            )}
                                        </AutoSizer>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    },
    arePropsEqual
);

export default TestsList;
