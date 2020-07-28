import React, { useState } from 'react';
import useStyles from './Search.css';
import { SearchPropsModel, SearchStateModel } from './Search.d';
import { TextField, FormControl, InputAdornment, IconButton, FormControlLabel, Checkbox } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
export const Search: React.FunctionComponent<SearchPropsModel> = ({ loadDirectory, currentPath }) => {
    const classes = useStyles();
    const [state, setState] = useState<SearchStateModel>({ hiddenSearch: true, autoSearch: true, searchFieldText: '' });
    const searchFromSearchField = (regexForce?: string) => {
        loadDirectory({ path: currentPath, regex: regexForce || regexForce === '' ? regexForce : state.searchFieldText });
    };

    let setStateValue = (key: string, newValue: any) => setState((pvState) => ({ ...pvState, [key]: newValue }));

    const searchTextFieldKeyDown = (e: any) => {
        if (e.keyCode === 13) searchFromSearchField();
    };

    return (
        <>
            <div className={classes.Search}>
                <FormControl style={{ position: 'absolute', right: '10px', display: 'flex', flexDirection: 'row' }}>
                    <TextField
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => {
                                            searchFromSearchField();
                                        }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onKeyDown={searchTextFieldKeyDown}
                        inputProps={{ style: { fontSize: '15px', width: '150px' } }}
                        value={state.searchFieldText}
                        onChange={(e) => {
                            e.persist();
                            if (state.autoSearch) searchFromSearchField(e.target.value);
                            setStateValue('searchFieldText', e.target.value);
                        }}
                        onFocus={(e) => {
                            e.target.select();
                        }}
                    />
                    <FormControlLabel
                        style={{ paddingLeft: '10px' }}
                        control={
                            <Checkbox
                                color="default"
                                classes={{ root: classes.checkboxRoot, checked: classes.checkboxChecked }}
                                checked={state.autoSearch}
                                onChange={(e) => {
                                    e.persist();
                                    setStateValue('autoSearch', e.target.checked);
                                }}
                            />
                        }
                        label={<span style={{ fontSize: '15px' }}>autosearch</span>}
                    />
                </FormControl>
            </div>
        </>
    );
};

export default Search;
