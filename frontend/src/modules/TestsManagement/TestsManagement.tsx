import React, { useState, useEffect, useRef } from 'react';
import useStyles from './TestsManagement.css';
import { TestsAddition, TestsList, Toolbar } from './screens';
import { TestsManagementPropsModel, TestsManagementStateModel } from './TestsManagement.d';
import { Button, Dialog } from '@material-ui/core';
import { useFileManagerActions, useConfigActions } from 'reduxState/actions';
import { stringFromUintArray } from 'utils/tools';
export const TasksManagement: React.FunctionComponent<TestsManagementPropsModel> = ({}) => {
    const classes = useStyles();
    const [state, _setState] = useState<TestsManagementStateModel>({
        tasksAdditionDialogVisibility: false,
        searchText: '',
    }); /* FOR DEBUG REASONS */
    /*const { setFileManager } = useFilseManagerActions();
    useEffect(() => {
        setFileManager({
            open: true,
        });
    }, []);*/
    const setState = (type: string, value: any | ((arg1: any) => any)) => {
        _setState((pvState: any) => ({
            ...pvState,
            [type]: typeof value === 'function' ? value(pvState[type]) : value,
        }));
    };
    const selectedTestsSet = useRef<{ [key: string]: Set<string> }>({});

    const [testsListRerenderValue, setTestsListRerenderValue] = useState<number>(0);
    const { removeTests } = useConfigActions();
    const rerenderTestsList = () => setTestsListRerenderValue((pvValue: number) => pvValue + 1);

    return (
        <>
            <div className={classes.TestsManagement}>
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
                    searchText={state.searchText}
                    setSearchText={(newSearchText: string) => setState('searchText', newSearchText)}
                    clickRemoveTestsButton={() => {
                        let testsToDelete: { [key: string]: string[] } = {};
                        Object.entries(selectedTestsSet.current).forEach(([groupId, testsSet]: [string, Set<string>]) => {
                            testsToDelete[groupId] = [...testsSet];
                        });
                        removeTests(testsToDelete);
                    }}
                    clickAddTestsButton={() => setState('tasksAdditionDialogVisibility', true)}
                />
                <TestsList
                    rerenderTestsList={rerenderTestsList}
                    selectedTestsSet={selectedTestsSet.current}
                    rerenderValue={testsListRerenderValue}
                    searchText={state.searchText}
                />
            </div>
        </>
    );
};

export default TasksManagement;
