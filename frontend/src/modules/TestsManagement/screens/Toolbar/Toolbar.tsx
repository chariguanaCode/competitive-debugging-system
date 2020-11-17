import React from 'react';
import useStyles from './Toolbar.css';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Search as SearchIcon, AllInbox as AllInboxIcon } from '@material-ui/icons';
import { ToolbarPropsModel, ToolbarStateModel } from './Toolbar.d';
import { useCommonState } from 'utils';
import { AnchoredDialog } from 'components';
import { TestsMove } from '../';
export const Toolbar: React.FunctionComponent<ToolbarPropsModel> = ({
    clickAddTestsButton,
    clickRemoveTestsButton,
    clickMoveTestsButton,
    setSearchText,
    searchText,
    areButtonsForSelectedTestsDisabled,
}) => {
    const classes = useStyles();
    const [state, setState] = useCommonState<ToolbarStateModel>({
        moveTestsDialogProps: {
            open: false,
        },
    });
    return (
        <>
            <div className={classes.Toolbar}>
                <AnchoredDialog
                    closeOnClickOutside
                    closeDialog={() => {
                        setState('moveTestsDialogProps', {
                            open: false,
                        });
                    }}
                    content={
                        <TestsMove
                            moveTests={clickMoveTestsButton}
                            closeDialog={() => {
                                setState('moveTestsDialogProps', {
                                    open: false,
                                });
                            }}
                        />
                    }
                    position="right-top"
                    anchorPosition="left-top"
                    {...state.moveTestsDialogProps}
                />
                <TextField
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    inputProps={{ style: { fontSize: '15px', width: '150px' } }}
                    value={searchText}
                    onChange={(e: any) => {
                        e.persist();
                        setSearchText(e.target.value);
                    }}
                />
                <Button classes={{ root: classes.ButtonRoot }} onClick={clickAddTestsButton}>
                    <AddIcon />
                </Button>
                <Button
                    disabled={areButtonsForSelectedTestsDisabled}
                    classes={{ root: classes.ButtonRoot }}
                    onClick={clickRemoveTestsButton}
                >
                    <DeleteIcon />
                </Button>
                <Button
                    disabled={areButtonsForSelectedTestsDisabled}
                    classes={{ root: classes.ButtonRoot }}
                    onClick={(e) => {
                        e.persist();
                        setState('moveTestsDialogProps', {
                            open: true,
                            anchorEl: e.currentTarget,
                        });
                    }}
                >
                    <AllInboxIcon />
                </Button>
            </div>
        </>
    );
};

export default Toolbar;
