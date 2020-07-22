import React, { ReactElement, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@material-ui/core';

interface Props {
    open: boolean;
    onClose: (result: any) => void;
}

export default function DebuggingAddTab({ open, onClose }: Props): ReactElement {
    const [type, setType] = useState('test');
    const [name, setName] = useState('');

    return (
        <Dialog onClose={() => onClose(null)} open={open} fullWidth>
            <DialogTitle>Add new tab</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField value={name} onChange={(event) => setName(event.target.value)} />
                <Select value={type} onChange={(event) => setType(event.target.value as string)}>
                    <MenuItem value="watch">Watches</MenuItem>
                    <MenuItem value="test">Test</MenuItem>
                </Select>
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
