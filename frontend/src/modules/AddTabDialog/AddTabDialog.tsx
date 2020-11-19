import React, { useState } from 'react';
import useStyles from './AddTabDialog.css';
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
import { TrackingOptions } from './screens';

interface Props {
    open: boolean;
    onClose: (result: any) => void;
}

export const AddTabDialog = ({ open, onClose }: Props) => {
    const classes = useStyles();
    const [type, setType] = useState('');
    const [name, setName] = useState('');

    const [config, setConfig] = useState({ object: '' });

    return (
        <Dialog onClose={() => onClose(null)} open={open} fullWidth>
            <DialogTitle>Add new tab</DialogTitle>
            <DialogContent dividers>
                <div className={classes.dialogContent}>
                    <TextField
                        label="Name"
                        value={name}
                        style={{ paddingBottom: 8 }}
                        className={classes.input}
                        onChange={(event) => setName(event.target.value)}
                    />
                    {/* TODO: IT SHOULD BE AUTO GENERATED */}
                    <FormControl className={classes.input}>
                        <InputLabel>Type</InputLabel>
                        <Select value={type} onChange={(event) => setType(event.target.value as string)}>
                            <MenuItem value="watches">Watches</MenuItem>
                            <MenuItem value="tests">Tests</MenuItem>
                            <MenuItem value="outputs">Outputs</MenuItem>
                            <MenuItem value="trackedObject">Tracked Object</MenuItem>
                            <MenuItem value="tests management">Tests management</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {type === 'trackedObject' && (
                    <TrackingOptions
                        selectedObject={config.object}
                        setSelectedObject={(newObject) => setConfig({ object: newObject })}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={() => onClose({ type: 'tab', name, component: type, config: type === 'trackedObject' && config })}
                    color="primary"
                    disabled={!type.length || !name.length}
                >
                    Add tab
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTabDialog;
