import React, { memo, useState } from 'react';
import { TestStateFilter } from './components';
import useStyles from './Toolbar.css';
import { ToolbarPropsModel } from './Toolbar.d';
import { InputAdornment, TableSortLabel, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { TestsSortingModel } from '../../Tasks.d';

export const Toolbar: React.FunctionComponent<ToolbarPropsModel> = ({
    searchText,
    setSearchText,
    testStateFilter,
    setTestStateFilter,
    sorting,
    setSorting,
}) => {
    const classes = useStyles();

    const changeSorting = (type: TestsSortingModel['type']) => {
        setSorting((oldVal) => {
            if (oldVal.type === type) {
                return {
                    type,
                    direction: oldVal.direction === 'asc' ? 'desc' : 'asc',
                };
            } else {
                return {
                    type,
                    direction: 'desc',
                };
            }
        });
    };

    return (
        <>
            <div className={classes.Toolbar}>
                <TestStateFilter filter={testStateFilter} setFilter={setTestStateFilter} />
                <TextField
                    label="Search"
                    className={classes.searchField}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
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
                <TableSortLabel
                    className={classes.sortButton}
                    active={sorting.type === 'name'}
                    direction={sorting.direction}
                    onClick={() => changeSorting('name')}
                >
                    Name
                </TableSortLabel>
                <TableSortLabel
                    className={classes.sortButton}
                    active={sorting.type === 'time'}
                    direction={sorting.direction}
                    onClick={() => changeSorting('time')}
                >
                    Execution time
                </TableSortLabel>
            </div>
        </>
    );
};

export default memo(Toolbar);
