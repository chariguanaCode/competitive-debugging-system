import React, { useState } from 'react';
import { TaskState } from 'reduxState/models';
import { TestsList, Toolbar } from './screens';
import useStyles from './Tasks.css';
import { TasksPropsModel, TestsSortingModel } from './Tasks.d';

export const Tasks: React.FunctionComponent<TasksPropsModel> = ({}) => {
    const classes = useStyles();
    const [searchText, setSeachText] = useState('');
    const [testStateFilter, setTestStateFilter] = useState(new Set<TaskState>());
    const [sorting, setSorting] = useState<TestsSortingModel>({
        type: 'name',
        direction: 'desc',
    });

    return (
        <>
            <div className={classes.Tasks}>
                <Toolbar
                    searchText={searchText}
                    setSearchText={setSeachText}
                    testStateFilter={testStateFilter}
                    setTestStateFilter={setTestStateFilter}
                    sorting={sorting}
                    setSorting={setSorting}
                />
                <TestsList searchText={searchText} testStateFilter={testStateFilter} sorting={sorting} />
            </div>
        </>
    );
};

export default Tasks;
