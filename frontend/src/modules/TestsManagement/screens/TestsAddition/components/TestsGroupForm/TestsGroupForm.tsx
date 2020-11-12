import React from 'react';
import useStyles from './TestsGroupForm.css';
import { TestsGroupFormPropsModel, TestsGroupFormStateModel } from './TestsGroupForm.d';
import { Select, MenuItem, Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
export const TestsGroupForm: React.FunctionComponent<TestsGroupFormPropsModel> = ({
    testsGroupsArray,
    selectedTestsGroupId,
    setSelectedTestsGroupId,
    addGroup,
}) => {
    console.log(selectedTestsGroupId);
    const classes = useStyles();
    console.log(testsGroupsArray);
    return (
        <>
            <div className={classes.TestsGroupForm}>
                <Select
                    value={selectedTestsGroupId}
                    onChange={(e) => {
                        e.persist();
                        setSelectedTestsGroupId(e.target.value as string);
                    }}
                    label={'to group'}
                >
                    {testsGroupsArray.map((value) => (
                        <MenuItem key={value.id} value={value.id}>
                            {value.name}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    classes={{ root: classes.ButtonRoot }}
                    onClick={() => {
                        setSelectedTestsGroupId(addGroup());
                    }}
                >
                    <AddIcon></AddIcon>
                </Button>
            </div>
        </>
    );
};

export default TestsGroupForm;
