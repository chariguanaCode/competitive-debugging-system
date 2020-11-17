import React, { useState } from 'react';
import { TestsList, Toolbar } from './screens';
import useStyles from './Tasks.css';
import { TasksPropsModel, TasksStateModel } from './Tasks.d';

export const Tasks: React.FunctionComponent<TasksPropsModel> = ({}) => {
    const classes = useStyles();
    const [searchText, setSeachText] = useState('-1');

    return (
        <>
            <div className={classes.Tasks}>
                <Toolbar setSearch={setSeachText} />
                <TestsList searchText={searchText} />
            </div>
        </>
    );
};

export default Tasks;
