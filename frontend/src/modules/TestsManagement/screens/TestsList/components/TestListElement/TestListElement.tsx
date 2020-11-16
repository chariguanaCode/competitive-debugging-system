import React, { useRef } from 'react';
import useStyles from './TestListElement.css';
import { Button, Checkbox } from '@material-ui/core';
import { TestListElementPropsModel, TestListElementStateModel } from './TestListElement.d';
import { Info as InfoIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowDropDown as ArrowDropDownIcon, ArrowDropDown } from '@material-ui/icons';
import clsx from 'clsx';

export const TestListElement: React.FunctionComponent<TestListElementPropsModel> = ({
    clickRemoveButton,
    clickEditButton,
    setCheckboxValue,
    testObject,
    isSelected,
}) => {
    const classes = useStyles();
    const checkboxRef = useRef(null);
    return (
        <>
            <div className={classes.TestListElement}>
                <div
                    className={classes.testName}
                    onClick={() => {
                        // @ts-ignore (false-negative)
                        if (checkboxRef.current) checkboxRef.current.click();
                    }}
                >
                    {testObject.name}
                </div>
                <div className={classes.buttons}>
                    <Button onClick = {clickEditButton} className={clsx(classes.EditButton)} classes={{ root: classes.Button }}>
                        <EditIcon />
                    </Button>
                    <Button
                        onClick={clickRemoveButton}
                        className={clsx(classes.RemoveButton)}
                        classes={{ root: classes.Button }}
                    >
                        <DeleteIcon />
                    </Button>
                    <Checkbox
                        inputRef={checkboxRef}
                        onChange={(e) => {
                            e.persist();
                            setCheckboxValue(e.target.checked);
                        }}
                        checked={isSelected}
                        className={clsx(classes.RemoveButton)}
                        classes={{ root: classes.Button }}
                    />
                </div>
            </div>
        </>
    );
};

export default TestListElement;
