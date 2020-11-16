import React, { useRef } from 'react';
import useStyles from './GroupListElement.css';
import { GroupListElementPropsModel, GroupListElementStateModel } from './GroupListElement.d';
import { Button, Checkbox } from '@material-ui/core';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons';
import clsx from 'clsx';

export const GroupListElement: React.FunctionComponent<GroupListElementPropsModel> = ({
    clickRemoveButton,
    clickEditButton = () => {},
    setCheckboxValue,
    isExpanded,
    isSelected,
    clickExpandGroupButton,
    groupObject,
}) => {
    const classes = useStyles();
    const checkboxRef = useRef(null);

    return (
        <>
            <div className={classes.GroupListElement}>
                <div
                    className={classes.groupName}
                    onClick={() => {
                        // @ts-ignore (false-positive)
                        if (checkboxRef.current) checkboxRef.current.click();
                    }}
                >
                    {groupObject.name}
                </div>
                <div className={classes.groupTestsAmountLabel}>{`(${groupObject.testsAmount})`}</div>
                <div className={classes.buttons}>
                    <Button
                        onClick={clickExpandGroupButton}
                        className={clsx(classes.EditButton)}
                        classes={{ root: classes.Button }}
                    >
                        {isExpanded ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </Button>
                    <Button onClick={clickEditButton} className={clsx(classes.EditButton)} classes={{ root: classes.Button }}>
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

export default GroupListElement;
