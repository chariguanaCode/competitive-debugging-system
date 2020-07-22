import React from 'react';
import useStyles from './Tasks.css';
import { Tasks as TasksScreen } from './screens';
export const Tasks = () => {
    const classes = useStyles();
    return <TasksScreen />;
};

export default Tasks;
