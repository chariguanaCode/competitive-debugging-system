import React, { useEffect, useState } from 'react';
import useStyles from './ActionEditAccordion.css';
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Collapse,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
} from '@material-ui/core';
import { Close as CloseIcon, ExpandMore as ExpandMoreIcon, Add as AddIcon } from '@material-ui/icons';
import { WatchActionArguments, WatchActionOrganizedArguments, WatchActionType } from 'reduxState/models';
import { colored } from '../ColoredText';
import { useTrackedObjectConfig } from 'reduxState/selectors';
import { ButtonWithTooltip } from 'components';

interface Props {
    expanded: boolean;
    target: string | null;
    action: WatchActionType | null;
    setOpen: React.Dispatch<React.SetStateAction<number | null>>;
    listIndex: number;
    callIdOverview: { type: 'watch' | 'watchblock'; names: string[] };
    addAction: (newAction: { target: string; action: WatchActionType }) => void;
    modifyAction: (index: number, newAction: { target: string; action: WatchActionType }) => void;
    removeAction: (index: number) => void;
    beginPopperAnimation: () => void;
    endPopperAnimation: () => void;
}

export const ActionEditAccordion: React.FunctionComponent<Props> = ({
    expanded,
    target,
    action,
    setOpen,
    listIndex,
    callIdOverview,
    addAction,
    modifyAction,
    removeAction,
    beginPopperAnimation,
    endPopperAnimation,
}) => {
    const addMode = target === null;

    const classes = useStyles();
    const trackedObjects = useTrackedObjectConfig();
    const [editMode, setEditMode] = useState(false);
    const [newTarget, setNewTarget] = useState({ name: target, type: trackedObjects.find((a) => a.name === target)?.type });
    const [newAction, setNewAction] = useState(action);

    const cancelEdits = () => {
        setNewTarget({ name: target, type: trackedObjects.find((a) => a.name === target)?.type });
        setNewAction(action);
        setEditMode(false);
    };

    const saveEdits = () => {
        if (!newTarget.name || !newAction) return;

        if (addMode) {
            addAction({ target: newTarget.name, action: newAction });
        } else {
            modifyAction(listIndex, { target: newTarget.name, action: newAction });
        }

        setNewTarget({ name: target, type: trackedObjects.find((a) => a.name === target)?.type });
        setNewAction(action);
        setEditMode(false);
    };

    useEffect(() => {
        setNewTarget({ name: target, type: trackedObjects.find((a) => a.name === target)?.type });
        setNewAction(action);
    }, [target, action]);

    const addNewTrackedObject = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.currentTarget.blur();
        document.dispatchEvent(new Event('addNewTrackedObject'));
    };

    return (
        <Accordion
            expanded={expanded || editMode}
            onChange={(evt, isExpanded) => (editMode ? cancelEdits() : setOpen(isExpanded ? listIndex : null))}
            TransitionProps={{
                onEnter: beginPopperAnimation,
                onEntered: endPopperAnimation,
                onExit: beginPopperAnimation,
                onExited: endPopperAnimation,
            }}
        >
            <AccordionSummary expandIcon={editMode ? <CloseIcon /> : <ExpandMoreIcon />}>
                {addMode ? (
                    'Add new action'
                ) : (
                    <Paper className={classes.code}>
                        {colored({ dialogTrackedObject: target })}.{action}
                    </Paper>
                )}
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.detailsContainer}>
                    <Collapse in={editMode || addMode}>
                        <div className={classes.selectContainer}>
                            <FormControl className={classes.selectWrapper} style={{ flexBasis: '33.3%' }}>
                                <InputLabel>Tracked object</InputLabel>
                                <Select
                                    autoWidth
                                    value={newTarget.name ? JSON.stringify(newTarget) : ''}
                                    onChange={(event) => setNewTarget(JSON.parse(event.target.value as string))}
                                >
                                    {trackedObjects.map((val, index) => (
                                        <MenuItem key={index} value={JSON.stringify(val)}>
                                            {val.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <ButtonWithTooltip
                                tooltipText="Add new tracked object"
                                placement="bottom"
                                arrow
                                onClick={addNewTrackedObject}
                                classes={{ root: classes.addTrackedObjectButton }}
                            >
                                <AddIcon fontSize="small" />
                            </ButtonWithTooltip>
                            <FormControl className={classes.selectWrapper} style={{ flexBasis: '66.6%' }}>
                                <InputLabel>Action to execute</InputLabel>
                                <Select
                                    autoWidth
                                    disabled={!newTarget.type}
                                    value={newAction || ''}
                                    onChange={(event) => setNewAction(event.target.value as WatchActionType)}
                                >
                                    {newTarget.type &&
                                        Object.entries(WatchActionOrganizedArguments[newTarget.type]).map(([action, args]) => (
                                            <MenuItem
                                                key={action}
                                                value={action}
                                                disabled={args.length > callIdOverview.names.length}
                                            >
                                                {action}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                    </Collapse>
                    {newAction && (
                        <Paper className={classes.code}>
                            {WatchActionArguments[newAction].map((argument, index) => (
                                <div key={index}>
                                    {colored({ array: argument })} = {colored({ name: callIdOverview.names[index] })}
                                </div>
                            ))}
                        </Paper>
                    )}
                </div>
            </AccordionDetails>
            <Divider />
            <AccordionActions>
                <div className={classes.actionsContainer}>
                    {addMode ? (
                        <Button size="small" color="primary" onClick={saveEdits} disabled={!newTarget.name || !newAction}>
                            Add
                        </Button>
                    ) : (
                        <>
                            <Collapse in={editMode}>
                                <Button size="small" onClick={cancelEdits}>
                                    Cancel
                                </Button>
                                <Button size="small" color="primary" onClick={saveEdits}>
                                    Save
                                </Button>
                            </Collapse>
                            <Collapse in={!editMode}>
                                <Button size="small" color="primary" onClick={() => setEditMode(true)}>
                                    Edit
                                </Button>
                                <Button className={classes.deleteButton} size="small" onClick={() => removeAction(listIndex)}>
                                    Delete
                                </Button>
                            </Collapse>
                        </>
                    )}
                </div>
            </AccordionActions>
        </Accordion>
    );
};

export default ActionEditAccordion;
