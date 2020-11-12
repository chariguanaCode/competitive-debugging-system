import React from 'react';
import useStyles from './Toolbar.css';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, Search as SearchIcon } from '@material-ui/icons';
import { ToolbarPropsModel, ToolbarStateModel } from './Toolbar.d';

export const Toolbar: React.FunctionComponent<ToolbarPropsModel> = ({
    clickAddTestsButton,
    clickRemoveTestsButton,
    setSearchText,
    searchText,
}) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.Toolbar}>
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
                    <AddIcon></AddIcon>
                </Button>
                <Button classes={{ root: classes.ButtonRoot }} onClick={clickRemoveTestsButton}>
                    <DeleteIcon></DeleteIcon>
                </Button>
            </div>
        </>
    );
};

export default Toolbar;
