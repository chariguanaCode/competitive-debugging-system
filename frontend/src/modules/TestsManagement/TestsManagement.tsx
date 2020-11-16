import React, { useState, useEffect, useRef } from 'react';
import useStyles from './TestsManagement.css';
import { TestsAddition, TestsList, Toolbar, TestsEdition, TestsMove, GroupEdition } from './screens';
import { TestsManagementPropsModel, TestsManagementStateModel } from './TestsManagement.d';
import { Button, Dialog } from '@material-ui/core';
import { useFileManagerActions, useConfigActions } from 'reduxState/actions';
import { stringFromUintArray } from 'utils/tools';
import { AnchoredDialog } from 'components';
import { useCommonState } from 'utils';
export const TasksManagement: React.FunctionComponent<TestsManagementPropsModel> = ({}) => {
    const classes = useStyles();

    const [state, setState] = useCommonState<TestsManagementStateModel>({
        tasksAdditionDialogVisibility: false,
        searchText: '',
        editionDialogProps: {
            open: false,
        },
        groupEditionDialogProps: {
            open: false,
        },
    });

    const selectedTestsSet = useRef<{ [key: string]: Set<string> }>({});

    const [testsListRerenderValue, setTestsListRerenderValue] = useState<number>(0);
    const { removeTests, moveTests } = useConfigActions();
    const rerenderTestsList = () => setTestsListRerenderValue((pvValue: number) => pvValue + 1);

    return (
        <>
            <div className={classes.TestsManagement}>
                <AnchoredDialog
                    closeOnClickOutside
                    closeDialog={() => {
                        setState('editionDialogProps', {
                            open: false,
                        });
                    }}
                    content={
                        <TestsEdition
                            closeTestEditionDialog={() => {
                                setState('editionDialogProps', {
                                    open: false,
                                });
                            }}
                        />
                    }
                    {...state.editionDialogProps}
                />
                <AnchoredDialog
                    closeOnClickOutside
                    closeDialog={() => {
                        setState('groupEditionDialogProps', {
                            open: false,
                        });
                    }}
                    content={
                        <GroupEdition
                            closeGroupEditionDialog={() => {
                                setState('groupEditionDialogProps', {
                                    open: false,
                                });
                            }}
                        />
                    }
                    {...state.groupEditionDialogProps}
                />
                <Dialog
                    maxWidth={'xl'}
                    open={state.tasksAdditionDialogVisibility}
                    onClose={() => {
                        setState('tasksAdditionDialogVisibility', false);
                    }}
                >
                    <TestsAddition />
                </Dialog>

                <Toolbar
                    areButtonsForSelectedTestsDisabled={Object.keys(selectedTestsSet.current).length === 0} // TODO: !!!
                    searchText={state.searchText}
                    setSearchText={(newSearchText: string) => setState('searchText', newSearchText)}
                    clickRemoveTestsButton={() => {
                        let testsToDelete: { [key: string]: string[] } = {};
                        Object.entries(selectedTestsSet.current).forEach(([groupId, testsSet]: [string, Set<string>]) => {
                            testsToDelete[groupId] = [...testsSet];
                        });
                        removeTests(testsToDelete);
                    }}
                    clickMoveTestsButton={(destinationGroupId: string) => {
                        let testsToMove: { testsToMove: { [key: string]: string[] }; destinationGroupId: string } = {
                            testsToMove: {},
                            destinationGroupId: destinationGroupId,
                        };
                        let newSelectedTestsArray: string[] = [];
                        Object.entries(selectedTestsSet.current).forEach(([groupId, testsSet]: [string, Set<string>]) => {
                            testsToMove.testsToMove[groupId] = [...testsSet];
                            newSelectedTestsArray.push(...testsSet);
                        });
                        moveTests(testsToMove);
                        selectedTestsSet.current = {};
                        selectedTestsSet.current[destinationGroupId] = new Set(newSelectedTestsArray);
                    }}
                    clickAddTestsButton={() => setState('tasksAdditionDialogVisibility', true)}
                />
                <TestsList
                    rerenderTestsList={rerenderTestsList}
                    selectedTestsSet={selectedTestsSet.current}
                    rerenderValue={testsListRerenderValue}
                    searchText={state.searchText}
                    openTestEditionDialog={(testId: string, groupId: string, anchorEl: any) => {
                        setState('editionDialogProps', {
                            open: true,
                            anchorEl: anchorEl,
                            contentProps: {
                                testId: testId,
                                groupId: groupId,
                            },
                        });
                    }}
                    openGroupEditionDialog={(groupId: string, anchorEl: any) => {
                        setState('groupEditionDialogProps', {
                            open: true,
                            anchorEl: anchorEl,
                            contentProps: {
                                groupId: groupId,
                            },
                        });
                    }}
                />
            </div>
        </>
    );
};

export default TasksManagement;
