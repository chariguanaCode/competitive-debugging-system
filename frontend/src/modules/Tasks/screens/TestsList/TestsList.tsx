import React, { useEffect, useState } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import { TaskState, TestModel } from 'reduxState/models';
import { useAllTasksState, useConfig } from 'reduxState/selectors';
import useStyles from './TestsList.css';
import { TestsListPropsModel, TestsListStateModel } from './TestsList.d';
import { GroupListElement, TestListElement } from './components';

export const TestsList: React.FunctionComponent<TestsListPropsModel> = ({ searchText, testStateFilter, sorting }) => {
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

        let newFilteredTests: typeof filteredTests = {};
        Object.entries(groups).forEach(([groupId, groupObject]) => {
            newFilteredTests[groupId] = [];
            Object.entries(groupObject.tests).forEach(([testId, testObject]) => {
                if (
                    (!regexExp || regexExp.test(testObject.name)) &&
                    (testStateFilter.size === 0 || testStateFilter.has(currentTests.current[testId]?.state))
                ) {
                    newFilteredTests[groupId].push({
                        id: testId,
                        executionTime: currentTests.current[testId]?.executionTime,
                        state: currentTests.current[testId]?.state,
                        ...testObject,
                    });
                }
            });
            switch (sorting.type) {
                case 'name':
                    newFilteredTests[groupId].sort((val1, val2) => {
                        let res = 0;
                        if (val1.name < val2.name) res = -1;
                        if (val1.name > val2.name) res = 1;
                        if (sorting.direction === 'asc') res *= -1;
                        return res;
                    });
                    break;
                case 'time':
                    newFilteredTests[groupId].sort((val1, val2) => {
                        let res = 0;
                        let tmp1 = val1.executionTime?.split('s');
                        let tmp2 = val2.executionTime?.split('s');
                        if (tmp1 && !tmp2) return -1;
                        if (!tmp1 && tmp2) return 1;
                        if (!tmp1 && !tmp2) return 0;

                        let values1 = [parseInt(tmp1[0]), parseInt(tmp1[1])];
                        let values2 = [parseInt(tmp2[0]), parseInt(tmp2[1])];
                        if (values1[0] < values2[0]) res = -1;
                        if (values1[0] > values2[0]) res = 1;
                        if (values1[0] === values2[0]) {
                            if (values1[1] < values2[1]) res = -1;
                            if (values1[1] > values2[1]) res = 1;
                        }
                        if (sorting.direction === 'asc') res *= -1;
                        return res;
                    });
                    break;
            }
        });

        setFilteredTests(newFilteredTests);
    }, [groups, searchText, testStateFilter, currentTests.reload, sorting.type, sorting.direction]);

    const renderRow = (
        { index, key, style }: { index: number; key: string; style: any },
        sourceArray: ({ id: string; executionTime: string; state: TaskState } & TestModel)[],
        groupId: string
    ) => {
        return (
            <div key={key} style={style}>
                <TestListElement testObject={sourceArray[index]} groupId={groupId} />
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
