import React from 'react';
import useStyles from './TrackingOptions.css';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useTrackedObjectKeys } from 'reduxState/selectors';

interface Props {
    selectedObject: string;
    setSelectedObject: (newValue: string) => void;
}

export const TrackingOptions = ({ selectedObject, setSelectedObject }: Props) => {
    const classes = useStyles();

    const objectKeys = useTrackedObjectKeys();

    return (
        <FormControl className={classes.input} fullWidth>
            <InputLabel>Tracked Object Name</InputLabel>
            <Select value={selectedObject} onChange={(event) => setSelectedObject(event.target.value as string)}>
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
