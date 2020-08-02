import React from 'react';
import clsx from 'clsx';
import useStyles from './OperationalButtons.css';
import { OperationalButtonsPropsModel, OperationalButtonsStateModel } from './OperationalButtons.d';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon, Settings as SettingsIcon } from '@material-ui/icons';
export const OperationalButtons: React.FunctionComponent<OperationalButtonsPropsModel> = ({ dialogClose }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.OperationalButtons}>
                <IconButton className={clsx(classes.OperationalButton, classes.settingsButton)}>
                    <SettingsIcon />
                </IconButton>
                <IconButton className={clsx(classes.OperationalButton, classes.closeButton)} onClick={dialogClose}>
                    <CloseIcon />
                </IconButton>
            </div>
        </>
    );
};

export default OperationalButtons;
