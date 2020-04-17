import React, { memo }                from "react";

import { TextField, InputAdornment, FormControlLabel    } from '@material-ui/core';
import { makeStyles                                     } from '@material-ui/core/styles';
import { Button, IconButton, Checkbox, Slider           } from '@material-ui/core';

import { Select, MenuItem, InputLabel } from '@material-ui/core';
import { FormControl                  } from '@material-ui/core';  

import ExpandLessIcon   from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon   from '@material-ui/icons/ExpandMore';
import ViewColumnIcon   from '@material-ui/icons/ViewColumn';

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (prevProps.numberOfColumns === nextProps.numberOfColumns) && (prevProps.sortMethodNumber === nextProps.sortMethodNumber) && (prevProps.filesDisplaySize === nextProps.filesDisplaySize);
}

interface FileManagerToolbarTypes {
    ChangeSortMethodNumber: Function,
    ChangeNumberOfColumns: Function,
    ChangeFilesDisplaySize: Function,
    filesDisplaySize: number,
    numberOfColumns: number,
    sortMethodNumber: number,
    SetHiddenSearch: Function,
}

const useStyles = makeStyles((theme) => ({
    optionType: {
        padding: "15px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    optionLabel: {
        overflow: "visible",
        width: "max-content",
        marginRight: "10px"
    },
    optionElement: {
        minWidth: "max-content",
    },
    checkboxRoot: {
        color: theme.palette.fileManager.checkboxColor,
        '&$checked': {
            color: theme.palette.fileManager.checkboxColor,
        },
    },
    checkboxChecked: {},
}))

export const FileManagerToolbar: React.FunctionComponent<FileManagerToolbarTypes> = memo(({SetHiddenSearch,ChangeSortMethodNumber, ChangeNumberOfColumns, numberOfColumns, sortMethodNumber, filesDisplaySize, ChangeFilesDisplaySize}) => {
    const classes = useStyles();
    return <>
    <div style = {{display: "flex", flexDirection: "row", alignItems: "center", fontSize: "1rem"}}>
        <div className = {classes.optionType}>
            <div className = {classes.optionLabel}>
                Sort by
            </div>
            <div className = {classes.optionElement}>
                <Select
                    value={sortMethodNumber}
                    onChange={(e)=>{ ChangeSortMethodNumber(e) }}
                >
                    <MenuItem value = {0}>type ascending</MenuItem>
                    <MenuItem value = {1}>type descending</MenuItem>
                    <MenuItem value = {3}>name ascending</MenuItem>
                    <MenuItem value = {2}>name descending</MenuItem>
                </Select>
            </div>
        </div> 
        <div className = {classes.optionType}>
            <div className = {classes.optionLabel}>
                Hidden Search
            </div>
            <div className = {classes.optionElement}>
                <Checkbox color="default" defaultChecked classes = {{root: classes.checkboxRoot, checked: classes.checkboxChecked}} onChange = {()=>{SetHiddenSearch()}}/>
            </div>
        </div> 
        <div className = {classes.optionType}>
            <div className = {classes.optionLabel}>
                Size
            </div>
            <div style = {{minWidth: "100px"}} className = {classes.optionElement}>
                <Slider step = {2} value={ filesDisplaySize } onChange = { (e, newValue) => { ChangeFilesDisplaySize(e, newValue) } } />
            </div>
        </div> 

    </div></>
    
},arePropsEqual)


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