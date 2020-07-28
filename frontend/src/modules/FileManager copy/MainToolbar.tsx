import React, { memo, useEffect, useRef, useState } from 'react';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Breadcrumbs,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import { getPartitionsNames } from '../../backend/filesHandlingFunctions';
import { useFocus } from '../../utils/tools';
import { MainToolbarProps, MainToolbarState } from './Types';
import useStyles from './MainToolbarStyles';

export const MainToolbar: React.FunctionComponent<MainToolbarProps> = memo(
    ({ loadDirectory, currentPath, setRootDirectory, currentRootDirectory }) => {
        

      

        const classes = useStyles();
        return (
            <>
                <div className={classes.navigation}>
                   

                   
                    
                </div>
            </>
        );
    }
);

export default MainToolbar;
/*<div style = {{position: "absolute", left: "10px"}}>
    { partitionsNamesState.map(name => (
        <Button style = {{maxWidth: "min-content"}} onClick = {()=>{ 
            loadDirectory(name);
            SetRootDirectory(name);
        }}>{name}</Button>
    ))}
</div>
*/
