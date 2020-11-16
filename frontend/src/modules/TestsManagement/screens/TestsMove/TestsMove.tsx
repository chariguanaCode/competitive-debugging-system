import React from 'react';
import useStyles from './TestsMove.css';
import { TestsMovePropsModel, TestsMoveStateModel } from './TestsMove.d';
import { useConfig } from 'reduxState/selectors';
import { EmojiObjects } from '@material-ui/icons';
import { Button } from '@material-ui/core';

export const TestsMove: React.FunctionComponent<TestsMovePropsModel> = ({ moveTests, closeDialog }) => {
    const classes = useStyles();
    const config = useConfig();
    return (
        <>
            <div className={classes.TestsMove}>
                {Object.entries(config.tests.groups).map(([groupId, groupElement]) => (
                    <Button
                    key={groupId}
                        onClick={() => {
                            moveTests(groupId);
                            closeDialog();
                        }}
                    >
                        {groupElement.name}
                    </Button>
                ))}
            </div>
        </>
    );
};

export default TestsMove;
