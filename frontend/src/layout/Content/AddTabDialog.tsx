import React, { ReactElement, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@material-ui/core';

interface Props {
    open: boolean;
    onClose: (result: any) => void;
}

export default function AddTabDialog({ open, onClose }: Props): ReactElement {
    const [type, setType] = useState('');
    const [name, setName] = useState('');

    return (
        <Dialog onClose={() => onClose(null)} open={open} fullWidth>
            <DialogTitle>Add new tab</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }} dividers>
                <TextField
                    label="Name"
                    value={name}
                    style={{ paddingBottom: 8 }}
                    onChange={(event) => setName(event.target.value)}
                />
                <FormControl>
                    <InputLabel>Type</InputLabel>
                    <Select value={type} onChange={(event) => setType(event.target.value as string)}>
                        <MenuItem value="watch">Watches</MenuItem>
                        <MenuItem value="tasks">Tasks</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => onClose({ type: 'tab', name, component: type })} color="primary">
                    Add tab
                </Button>
            </DialogActions>
        </Dialog>
    );
}
