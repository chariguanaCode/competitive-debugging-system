import React from 'react';
import useStyles from './Tasks.css';
import { Tasks as TasksScreen } from './screens';
import { TabNode } from 'flexlayout-react';

interface Props {
    node: TabNode;
}

export const Tasks = ({ node }: Props) => {
    const classes = useStyles();
    return <TasksScreen node={node} />;
};

export default Tasks;
