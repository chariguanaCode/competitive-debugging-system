import React from 'react';
import useStyles from './TasksManagement.css';
import { TasksManagementPropsModel, TasksManagementStateModel } from './TasksManagement.d';

export const TasksManagement: React.FunctionComponent<TasksManagementPropsModel> = ({}) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.TasksManagement}></div>
    </>
  );
};

export default TasksManagement;
