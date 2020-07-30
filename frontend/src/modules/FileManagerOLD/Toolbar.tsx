import React, { memo } from 'react';
import { Checkbox, MenuItem, Select, Slider } from '@material-ui/core';
import useStyles from './ToolbarStyles';
import { ToolbarProps } from './Types';

export const Toolbar: React.FunctionComponent<ToolbarProps> = memo(
    ({ setHiddenSearch, changeSortMethodNumber, sortMethodNumber, filesDisplaySize, changeFilesDisplaySize }) => {
        const classes = useStyles();
        return (
            <>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: '1rem' }}>
                    <div className={classes.optionType}>
                        <div className={classes.optionLabel}>Sort by</div>
                        <div className={classes.optionElement}>
                            <Select
                                value={sortMethodNumber}
                                onChange={(e) => {
                                    changeSortMethodNumber(e);
                                }}
                            >
                                <MenuItem value={0}>type ascending</MenuItem>
                                <MenuItem value={1}>type descending</MenuItem>
                                <MenuItem value={3}>name ascending</MenuItem>
                                <MenuItem value={2}>name descending</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className={classes.optionType}>
                        <div className={classes.optionLabel}>Hidden Search</div>
                        <div className={classes.optionElement}>
                            <Checkbox
                                color="default"
                                defaultChecked
                                classes={{ root: classes.checkboxRoot, checked: classes.checkboxChecked }}
                                onChange={() => {
                                    setHiddenSearch();
                                }}
                            />
                        </div>
                    </div>
                    <div className={classes.optionType}>
                        <div className={classes.optionLabel}>Size</div>
                        <div style={{ minWidth: '100px' }} className={classes.optionElement}>
                            <Slider
                                step={2}
                                value={filesDisplaySize}
                                onChange={(e, newValue) => {
                                    changeFilesDisplaySize(e, newValue);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

export default Toolbar;
/*
 <div className = {classes.optionType}>
            <div className = {classes.optionLabel}>
            </div>
            <div className = {classes.optionElement}>
            <TextField
                label={"Columns"}
                value={numberOfColumns}
                onChange={(e)=>{ChangeNumberOfColumns(e.target.value)}}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    style: {
                        width: "75px"
                    },
                    endAdornment: (
                    <InputAdornment position="end">
                        <span style = {{display: "flex", flexDirection: "column",}}>
                        <IconButton onClick = {() => {ChangeNumberOfColumns(Number(numberOfColumns) + 1)}} style = {{display: "flex", width: "5px", height: "3px"}}><ExpandLessIcon/></IconButton>
                        <IconButton onClick = {() => {ChangeNumberOfColumns(Number(numberOfColumns) - 1)}} style = {{display: "flex", width: "5px", height: "3px"}}><ExpandMoreIcon/></IconButton>
                        </span>
                    </InputAdornment>
                    ),
                    startAdornment: (
                        <InputAdornment position="start">
                        <ViewColumnIcon style = {{ width: "20px" }}/>
                        </InputAdornment>
                    ),
                }}
            />
            </div>
        </div> 
*/
