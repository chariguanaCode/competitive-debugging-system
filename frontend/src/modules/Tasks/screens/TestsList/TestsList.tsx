import React, { useEffect, useState } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import { TaskState, TestModel } from 'reduxState/models';
import { useAllTasksState, useConfig } from 'reduxState/selectors';
import useStyles from './TestsList.css';
import { TestsListPropsModel, TestsListStateModel } from './TestsList.d';
import { GroupListElement, TestListElement } from './components';

export const TestsList: React.FunctionComponent<TestsListPropsModel> = ({ searchText }) => {
    const classes = useStyles();
    const groups = useConfig().tests.groups;
    const currentTests = useAllTasksState();

    const [filteredTests, setFilteredTests] = useState<{
        [key: string]: Array<TestModel & { id: string; executionTime: string; state: TaskState }>;
    }>({});
    const [expandedGroupsIds, setExpandedGroupsIds] = useState(new Set());

    useEffect(() => {
        let regexExp: RegExp | null = null;
        try {
            regexExp = new RegExp(searchText);
        } catch {}

        const testState = parseInt(searchText);

        let newFilteredTests: typeof filteredTests = {};
        Object.entries(groups).forEach(([groupId, groupObject]) => {
            newFilteredTests[groupId] = [];
            Object.entries(groupObject.tests).forEach(([testId, testObject]) => {
                //       if (!regexExp || regexExp.test(testObject.name)) {
                if (testState === -1 || testState === currentTests.current[testId]?.state) {
                    newFilteredTests[groupId].push({
                        id: testId,
                        executionTime: currentTests.current[testId]?.executionTime,
                        state: currentTests.current[testId]?.state,
                        ...testObject,
                    });
                }
            });
        });

        setFilteredTests(newFilteredTests);
    }, [groups, searchText, currentTests.reload]);

    const renderRow = (
        { index, key, style }: { index: number; key: string; style: any },
        sourceArray: ({ id: string; executionTime: string; state: TaskState } & TestModel)[],
        groupId: string
    ) => {
        return (
            <div key={key} style={style}>
                <TestListElement testObject={sourceArray[index]} />
            </div>
        );
    };

    return (
        <>
            <div className={classes.TestsList}>
                {Object.entries(groups).map(([groupId, group]) => {
                    const groupTests = filteredTests[groupId] ? filteredTests[groupId] : [];
                    const isGroupExpanded = expandedGroupsIds.has(groupId);
                    const testsAmounts = {
                        [TaskState.Successful]: 0,
                        [TaskState.WrongAnswer]: 0,
                        [TaskState.Timeout]: 0,
                        [TaskState.Crashed]: 0,
                    } as { [key in TaskState]: number };
                    for (const test of groupTests) {
                        if (
                            [TaskState.Successful, TaskState.WrongAnswer, TaskState.Timeout, TaskState.Crashed].includes(
                                test.state
                            )
                        ) {
                            testsAmounts[test.state]++;
                        }
                    }

                    return (
                        <div key={groupId}>
                            <GroupListElement
                                groupObject={{ id: groupId, name: group.name, testsAmounts, allTestsAmount: groupTests.length }}
                                isExpanded={isGroupExpanded}
                                clickExpandGroupButton={() => {
                                    let newExpandedGroupsIdsSet = new Set(expandedGroupsIds);
                                    if (newExpandedGroupsIdsSet.has(groupId)) newExpandedGroupsIdsSet.delete(groupId);
                                    else newExpandedGroupsIdsSet.add(groupId);
                                    setExpandedGroupsIds(newExpandedGroupsIdsSet);
                                }}
                            />
                            {isGroupExpanded && groupTests.length > 0 && (
                                <div className={classes.testsList} style={{ height: Math.min(500, 30 * groupTests.length) }}>
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
};

export default TestsList;
