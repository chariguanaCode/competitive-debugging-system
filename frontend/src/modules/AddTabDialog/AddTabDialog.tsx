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
import { ButtonWithTooltip } from 'components';
import { Add as AddIcon } from '@material-ui/icons';

interface Props {
    open: boolean;
    onClose: (result: any) => void;
}

export const AddTabDialog = ({ open, onClose }: Props) => {
    const classes = useStyles();
    const [type, setType] = useState('');
    const [name, setName] = useState('');

    const [config, setConfig] = useState({ object: '' });

    const addNewTrackedObject = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.currentTarget.blur();
        document.dispatchEvent(new Event('addNewTrackedObject'));
    };

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
                    <div className={classes.dialogContent}>
                        <TrackingOptions
                            selectedObject={config.object}
                            setSelectedObject={(newObject) => setConfig({ object: newObject })}
                        />
                        <ButtonWithTooltip
                            tooltipText="Add new tracked object"
                            placement="bottom"
                            arrow
                            onClick={addNewTrackedObject}
                            classes={{ root: classes.addTrackedObjectButton }}
                        >
                            <AddIcon fontSize="small" />
                        </ButtonWithTooltip>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)}>Cancel</Button>
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
