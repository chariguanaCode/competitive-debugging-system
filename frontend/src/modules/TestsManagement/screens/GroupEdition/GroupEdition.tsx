import React from 'react';
import useStyles from './GroupEdition.css';
import { GroupEditionPropsModel, GroupEditionStateModel } from './GroupEdition.d';
import { useCommonState } from 'utils';
import { useConfig } from 'reduxState/selectors';
import { useConfigActions } from 'reduxState/actions';
import { TextField, Button, InputAdornment, Checkbox } from '@material-ui/core';
import { isNumeric } from 'utils/tools';
import clsx from 'clsx';

export const GroupEdition: React.FunctionComponent<GroupEditionPropsModel> = ({ groupId, closeGroupEditionDialog }) => {
    const classes = useStyles();
    const config = useConfig();
    const { addTests } = useConfigActions();

    const [state, setState] = useCommonState<GroupEditionStateModel>({
        name: groupId ? config.tests.groups[groupId].name : '',
        maximumRunningTime:
            groupId &&
            config.tests.groups[groupId].maximumRunningTime &&
            config.tests.groups[groupId].maximumRunningTime !== '-1'
                ? config.tests.groups[groupId].maximumRunningTime
                : '',
        timeLimit:
            groupId && config.tests.groups[groupId].timeLimit && config.tests.groups[groupId].timeLimit !== '-1'
                ? config.tests.groups[groupId].timeLimit
                : '',
        isTimeLimitEnabled: groupId ? config.tests.groups[groupId].timeLimit !== '-1' : false,
        isMaximumRunningTimeEnabled: groupId ? config.tests.groups[groupId].maximumRunningTime !== '-1' : false,
    });

    const setTextFieldValue = (e: any, acceptOnlyNumbers?: boolean) => {
        if (e.persist) e.persist();
        if (acceptOnlyNumbers && !isNumeric(e.target.value)) return setState(e.target.name, (pvNameState) => pvNameState);
        setState(e.target.name, e.target.value);
    };

    const submitChanges = () => {
        if (groupId) {
            const currentGroup = config.tests.groups[groupId];
            let newGroupValue: { name: string; timeLimit: string; maximumRunningTime: string } = {
                name: state.name,
                timeLimit: state.isTimeLimitEnabled && state.timeLimit.length ? state.timeLimit : '-1',
                maximumRunningTime:
                    state.isMaximumRunningTimeEnabled && state.maximumRunningTime.length ? state.maximumRunningTime : '-1',
            };
            let property: keyof typeof newGroupValue;
            for (property in newGroupValue)
                if (newGroupValue[property] !== currentGroup[property]) {
                    addTests({ [groupId]: { ...newGroupValue, tests: {} } });
                    closeGroupEditionDialog();
                    return;
                }
        }
        closeGroupEditionDialog();
    };

    return (
        <>
            <div className={classes.GroupEdition}>
                <div className={classes.FormContainer}>
                    <div className={classes.FormElement}>
                        <div className={classes.FormElementLabel}>Name</div>
                        <div className={classes.FormElementTextFieldContainer}>
                            <TextField
                                autoFocus
                                fullWidth
                                value={state.name}
                                name="name"
                                onChange={setTextFieldValue}
                                onFocus={(e) => {
                                    e.target.select();
                                }}
                            />
                        </div>
                    </div>
                    <div className={classes.FormElement}>
                        <div className={classes.FormElementLabel}>Time limit</div>
                        <div
                            className={clsx(classes.FormElementTextFieldContainer, classes.FormElementNumberTextFieldContainer)}
                        >
                            <TextField
                                fullWidth
                                disabled={!state.isTimeLimitEnabled}
                                value={state.timeLimit}
                                name="timeLimit"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            ms
                                            <Checkbox
                                                checked={state.isTimeLimitEnabled}
                                                onClick={(e: any) => {
                                                    e.persist();
                                                    setState('isTimeLimitEnabled', e.target.checked);
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={(e: any) => setTextFieldValue(e, true)}
                                onFocus={(e) => {
                                    e.target.select();
                                }}
                            />
                        </div>
                    </div>
                    <div className={classes.FormElement}>
                        <div className={classes.FormElementLabel}>Maximum running time</div>
                        <div
                            className={clsx(classes.FormElementTextFieldContainer, classes.FormElementNumberTextFieldContainer)}
                        >
                            <TextField
                                fullWidth
                                value={state.maximumRunningTime}
                                name="maximumRunningTime"
                                disabled={!state.isMaximumRunningTimeEnabled}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            ms
                                            <Checkbox
                                                checked={state.isMaximumRunningTimeEnabled}
                                                onClick={(e: any) => {
                                                    e.persist();
                                                    setState('isMaximumRunningTimeEnabled', e.target.checked);
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{
                                    inputMode: 'numeric',
                                }}
                                onChange={(e: any) => setTextFieldValue(e, true)}
                                onFocus={(e) => {
                                    e.target.select();
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={classes.FooterButtonsContainer}>
                    <Button fullWidth classes={{ root: classes.FooterButtonRoot }} onClick={closeGroupEditionDialog}>
                        Cancel
                    </Button>
                    <Button fullWidth classes={{ root: classes.FooterButtonRoot }} onClick={submitChanges}>
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
};

export default GroupEdition;
