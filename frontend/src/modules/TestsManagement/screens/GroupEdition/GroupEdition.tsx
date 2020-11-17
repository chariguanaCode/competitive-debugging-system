import React from 'react';
import useStyles from './GroupEdition.css';
import { GroupEditionPropsModel, GroupEditionStateModel } from './GroupEdition.d';
import { useCommonState } from 'utils';
import { useConfig } from 'reduxState/selectors';
import { useConfigActions } from 'reduxState/actions';
import { TextField, Button } from '@material-ui/core';

export const GroupEdition: React.FunctionComponent<GroupEditionPropsModel> = ({ groupId, closeGroupEditionDialog }) => {
    const classes = useStyles();
    const config = useConfig();
    const { addTests } = useConfigActions();

    const [state, setState] = useCommonState<GroupEditionStateModel>({
        name: groupId ? config.tests.groups[groupId].name : '',
    });

    const setTextFieldValue = (e: any) => {
        if (e.persist) e.persist();
        setState(e.target.name, e.target.value);
    };

    const submitChanges = () => {
        if (groupId) {
            if (state.name !== config.tests.groups[groupId].name) {
                addTests({ [groupId]: { name: state.name, tests: {} } });
            }
            closeGroupEditionDialog();
        }
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
