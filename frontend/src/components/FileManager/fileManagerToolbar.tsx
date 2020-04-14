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

export const FileManagerToolbar: React.FunctionComponent<FileManagerToolbarTypes> = memo(({SetHiddenSearch,ChangeSortMethodNumber, ChangeNumberOfColumns, numberOfColumns, sortMethodNumber, filesDisplaySize, ChangeFilesDisplaySize}) => {
    return <>
    <FormControl style = {{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <InputLabel>Sort By</InputLabel>
        <Select
            value={sortMethodNumber}
            onChange={(e)=>{ ChangeSortMethodNumber(e) }}
        >
            <MenuItem value = {0}>By type ascending</MenuItem>
            <MenuItem value = {1}>By type descending</MenuItem>
            <MenuItem value = {3}>By name ascending</MenuItem>
            <MenuItem value = {2}>By name descending</MenuItem>
        </Select>
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
    <FormControlLabel label = {"hidden search"} control  = {<Checkbox defaultChecked onChange = {()=>{SetHiddenSearch()}}/>} />
    <Slider step = {2} value={ filesDisplaySize } onChange = { (e, newValue) => { ChangeFilesDisplaySize(e, newValue) } } />
    </FormControl> 
    </>
},arePropsEqual)