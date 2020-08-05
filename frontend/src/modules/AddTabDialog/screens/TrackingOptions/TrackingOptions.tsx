import React from 'react';
import useStyles from './TrackingOptions.css';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useTrackedObjectKeys } from 'reduxState/selectors';
import { Add } from '@material-ui/icons';
import { useAddTrackedObjectDialogActions } from 'reduxState/actions';

interface Props {
    selectedObject: string;
    setSelectedObject: (newValue: string) => void;
}

export const TrackingOptions = ({ selectedObject, setSelectedObject }: Props) => {
    const classes = useStyles();

    const objectKeys = useTrackedObjectKeys();
    const { openAddTrackedObjectDialog } = useAddTrackedObjectDialogActions();

    return (
        <FormControl className={classes.input} fullWidth>
            <InputLabel>Tracked Object Name</InputLabel>
            <Select value={selectedObject} onChange={(event) => setSelectedObject(event.target.value as string)}>
                <MenuItem
                    value=""
                    onClick={() => {
                        openAddTrackedObjectDialog();
                    }}
                >
                    <Add />
                </MenuItem>
                {objectKeys.map((key) => (
                    <MenuItem value={key} key={key}>
                        {key}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default TrackingOptions;
