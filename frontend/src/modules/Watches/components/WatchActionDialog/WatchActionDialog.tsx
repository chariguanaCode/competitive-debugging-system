import React, { useRef, useState } from 'react';
import useStyles from './WatchActionDialog.css';
import { WatchActionDialogPropsModel } from './WatchActionDialog.d';
import { Grow, Paper, Popper, Portal, Typography } from '@material-ui/core';
import { colored } from '../ColoredText';
import ActionEditAccordion from '../ActionEditAccordion';
import { useWatchIdActions } from 'reduxState/selectors';
import { useConfigActions } from 'reduxState/actions';
import { WatchActionType } from 'reduxState/models';

export const WatchActionDialog: React.FunctionComponent<WatchActionDialogPropsModel> = ({
    actions,
    callIdOverview,
    cds_id,
    anchor,
    onClose,
}) => {
    const classes = useStyles();
    const [openView, setOpen] = useState<number | null>(0);
    const watchIdActions = useWatchIdActions();
    const { setWatchIdActions } = useConfigActions();

    const popperRef = useRef<any | null>(null);
    const popperAnimationStatus = useRef(false);

    const addAction = (newAction: { target: string; action: WatchActionType }) => {
        setWatchIdActions({ cds_id, value: [...(watchIdActions[cds_id] || []), newAction] });
    };

    const modifyAction = (index: number, newAction: { target: string; action: WatchActionType }) => {
        const actionCopy = Array.from(watchIdActions[cds_id] || []);
        actionCopy[index] = newAction;
        setWatchIdActions({ cds_id, value: actionCopy });
    };

    const removeAction = (index: number) => {
        const actionCopy = Array.from(watchIdActions[cds_id] || []);
        actionCopy.splice(index, 1);
        setWatchIdActions({ cds_id, value: actionCopy });
    };

    const executePopperAnimation = () => {
        popperRef.current?.update();
        if (popperAnimationStatus.current) {
            requestAnimationFrame(executePopperAnimation);
        }
    };
    const beginPopperAnimation = () => {
        popperAnimationStatus.current = true;
        requestAnimationFrame(executePopperAnimation);
    };
    const endPopperAnimation = () => {
        popperAnimationStatus.current = false;
    };

    return (
        <>
            <Portal container={document.body}>
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        onClose();
                    }}
                    className={classes.backdrop}
                />
            </Portal>
            <Popper
                anchorEl={anchor}
                open={Boolean(anchor)}
                popperRef={popperRef}
                placement="bottom-start"
                transition
                modifiers={{
                    offset: {
                        enabled: true,
                        offset: '10, 10',
                    },
                    preventOverflow: {
                        enabled: true,
                        boundariesElement: 'viewport',
                        padding: { top: 82, bottom: 32, left: 8, right: 8 },
                    },
                }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper className={classes.WatchActionDialog} elevation={8}>
                            <Typography variant="h6" className={classes.title}>
                                Watch actions of:
                            </Typography>
                            <Paper className={classes.code}>
                                watch(
                                {callIdOverview.names.map((name, index) => (
                                    <span key={index}>{colored({ name })}, </span>
                                ))}
                                cupl::id({colored({ string: `"${cds_id}"` })}))
                            </Paper>
                            <div className={classes.actions}>
                                {actions.map(({ target, action }, index) => (
                                    <ActionEditAccordion
                                        key={index}
                                        expanded={openView === index}
                                        target={target}
                                        action={action}
                                        setOpen={setOpen}
                                        listIndex={index}
                                        callIdOverview={callIdOverview}
                                        addAction={addAction}
                                        modifyAction={modifyAction}
                                        removeAction={removeAction}
                                        beginPopperAnimation={beginPopperAnimation}
                                        endPopperAnimation={endPopperAnimation}
                                    />
                                ))}
                                <ActionEditAccordion
                                    expanded={openView === -1}
                                    target={null}
                                    action={null}
                                    setOpen={setOpen}
                                    listIndex={-1}
                                    callIdOverview={callIdOverview}
                                    addAction={addAction}
                                    modifyAction={modifyAction}
                                    removeAction={removeAction}
                                    beginPopperAnimation={beginPopperAnimation}
                                    endPopperAnimation={endPopperAnimation}
                                />
                            </div>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

export default WatchActionDialog;
