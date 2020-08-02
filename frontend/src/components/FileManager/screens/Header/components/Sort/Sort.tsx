import React, { memo } from 'react';
import useStyles from './Sort.css';
import { SortPropsModel, SortStateModel } from './Sort.d';
import { Select, MenuItem } from '@material-ui/core';
export const Sort: React.FunctionComponent<SortPropsModel> = memo(({ sortMethodNumber, setSortMethodNumber }) => {
    const classes = useStyles();

    return (
        <>
            <div className={classes.Sort}>
                <div className={classes.SortLabel}>Sort by</div>
                <div className={classes.SelectContainer}>
                    <Select
                        value={sortMethodNumber}
                        onChange={(e) => {
                            e.persist();
                            setSortMethodNumber(e.target.value);
                        }}
                    >
                        <MenuItem value={0}>type ascending</MenuItem>
                        <MenuItem value={1}>type descending</MenuItem>
                        <MenuItem value={3}>name ascending</MenuItem>
                        <MenuItem value={2}>name descending</MenuItem>
                    </Select>
                </div>
            </div>
        </>
    );
});

export default Sort;
