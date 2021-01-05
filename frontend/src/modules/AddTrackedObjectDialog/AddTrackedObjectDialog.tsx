import React, { useState } from 'react';
import useStyles from './AddTrackedObjectDialog.css';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import { useTrackedObjectsActions, useConfigActions } from 'reduxState/actions';
import { TrackedObject } from 'reduxState/models';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const AddTrackedObjectDialog = ({ open, onClose }: Props) => {
    const classes = useStyles();

    const [type, setType] = useState('' as TrackedObject['type']);
    const [name, setName] = useState('');

    const { setSingleTrackedObject } = useTrackedObjectsActions();

    const { addTrackedObject } = useConfigActions();

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Add tracked object</DialogTitle>
            <DialogContent className={classes.dialogContent} dividers>
                <TextField
                    label="Name"
                    value={name}
                    className={classes.input}
                    onChange={(event) => setName(event.target.value)}
                />
                <FormControl className={classes.input}>
                    <InputLabel>Type</InputLabel>
                    <Select value={type} onChange={(event) => setType(event.target.value as TrackedObject['type'])}>
                        <MenuItem value="array_1d">Array 1 dimensional</MenuItem>
                        <MenuItem value="array_2d">Array 2 dimensional</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button
                    onClick={() => {
                        onClose();
                        switch (type) {
                            case 'array_1d':
                                setSingleTrackedObject(name, { type, value: [] as string[], color: [] as string[] });
                                break;
                            case 'array_2d':
                                setSingleTrackedObject(name, { type, value: [[]] as string[][], color: [[]] as string[][] });
                                break;
                        }
                        addTrackedObject({ name, type });
                    }}
                    color="primary"
                    disabled={!type.length || !name.length}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTrackedObjectDialog;
