import React, { memo }                from "react";
import { useState, useEffect, useRef} from "react";
import createFragment                 from "react-addons-create-fragment";

import { TextField, InputAdornment, Checkbox, FormControl, FormControlLabel               } from '@material-ui/core';
import { makeStyles                                        } from '@material-ui/core/styles';
import { Button, IconButton                                } from '@material-ui/core';
import   Breadcrumbs                                         from '@material-ui/core/Breadcrumbs';
import { Fade, CircularProgress                            } from "@material-ui/core";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

import HomeIcon         from '@material-ui/icons/Home';
import EditIcon         from '@material-ui/icons/Edit';
import ArrowBackIcon    from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SettingsIcon     from '@material-ui/icons/Settings';
import CloseIcon        from '@material-ui/icons/Close';
import { Sort, Check, CheckBox }         from "@material-ui/icons";
import SearchIcon       from '@material-ui/icons/Search';

//import { useRef } from "@storybook/addons";

interface State {
    newPath: any,
    historyList: Array<string>,
    //showFilesRenderForce: Array<0>,
    fieldMode: boolean,
}

interface MainToolbarTypes {
    loadDirectory: Function,
    currentPath: string,
    socket: any,
}

const useStyles = makeStyles({
    navigation: {
        display: "flex",
        alignContent: "center",
        textAlign: "center",
        fontWeight: 500,
        justifyContent: "center",
    },
});

const useFocus = () => {
    const htmlElRef = useRef(null)
    //@ts-ignore
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}

const isNumeric = (number: any) => {
    return +number === +number
}

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return prevProps.currentPath === nextProps.currentPath;
}

export const FileManagerMainToolbar: React.FunctionComponent<MainToolbarTypes> = memo(({loadDirectory, currentPath}) => {
    
    const [state, setState] = useState<State>({
        newPath: null,
        historyList: [],
        fieldMode: false,
    })

    const [searchFieldAutoSearch, changeSearchFieldAutoSearch] = useState<boolean>(true)
    const [searchFieldText, updateSearchFieldText] = useState<string>("")
    //const [fieldMode, updateFieldMode] = useState<boolean>(false)
    const [textFieldRef, setTextFieldFocus] = useFocus();
    let historyListIndex = useRef<number>(-1)
    let historyList = Array.from(state.historyList);
    
    useEffect(() => {
                    if(historyList[historyListIndex.current+1]===currentPath) ++historyListIndex.current;
                    else if(historyList[historyListIndex.current]!==currentPath){
                        historyList.splice(historyListIndex.current+1,0,currentPath);
                        ++historyListIndex.current;
                    }
                    setState(prevState => ({...prevState, historyList: historyList}))
    }, [currentPath]);

    const UpdateFieldMode = (val: boolean) => {
        //updateFieldMode(val);
        setState(prevState=>({
            ...prevState,
            fieldMode: val,
            newPath: null
        }));
    }

    const Undo = () => {
        historyListIndex.current = Math.max(0, historyListIndex.current-1);
        loadDirectory(historyList[historyListIndex.current])
    }

    const Redo = () => {
        historyListIndex.current = Math.min(historyList.length-1, historyListIndex.current+1);
        loadDirectory(historyList[historyListIndex.current])
    }

    useEffect(() => {
        //@ts-ignore
        if(state.fieldMode) setTextFieldFocus();
    }, [state.fieldMode]);

    const SetPathFromField = (e: any) => {
        e.preventDefault();
        loadDirectory(e.target.value);
    }

    const SearchFromSearchField = (regexForce?: string) => {
        loadDirectory(currentPath, regexForce || regexForce === "" ? regexForce : searchFieldText)
    }

    const SearchTextFieldKeyDown = (e: any) => {
        if (e.keyCode === 13) 
            SearchFromSearchField();
        
    }

    const PathTextFieldKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            setState(prevState => ({
                ...prevState,
                fieldMode: false,
            }));
            //updateFieldMode(false);
            SetPathFromField(e);
        }
    }

    const updateTextOnTextField = (e: any) => {
        e.preventDefault();
        let val = e.target.value;
        setState(prevState => ({ ...prevState, newPath: val, }))
    }

const classes = useStyles()
    return (
        <>
                    <div className={classes.navigation}>
                    <IconButton onClick={()=>{loadDirectory('/')}} style={{ width: "48px" }}><HomeIcon /></IconButton>
                    <IconButton onClick={Undo} disabled={historyListIndex.current > 0 ? false : true} style={{ width: "48px" }}><ArrowBackIcon /></IconButton>    
                    {state.fieldMode ? 
                    <TextField inputRef    = { textFieldRef } 
                                onKeyDown  = { PathTextFieldKeyDown } 
                                onBlur     = { () =>{ UpdateFieldMode(false) } } 
                                inputProps = { { style: { fontSize: "15px", width: "350px" } } } 
                                value      = { state.newPath !== null ? state.newPath : currentPath } 
                                onChange   = { updateTextOnTextField }
                                onFocus    = { e => { e.target.select() } }
                    />
                    :
                    <Breadcrumbs style = {{display: "inline-block", minWidth: "300px"}} aria-label="breadcrumb">
                        {/* 
                            // @ts-ignore */}
                        { currentPath === '/' ? <Button style={{pointerEvents: "none"}}>/</Button> : currentPath.split('/').reduce((valIn,val,it)=>{
                            let onPath = valIn[0]
                            //console.log(onPath,valIn)
                            if(val) return [onPath+val+'/',createFragment( { a: valIn[1], b: <Button onClick={()=>{loadDirectory(onPath+val+'/')}}>{val}</Button> })]
                            else return [onPath+val+'/', valIn[1]];
                        },["",null])}
                    </Breadcrumbs>}
                    {/* 
                            // @ts-ignore */}
                    <IconButton onClick = {()=>{UpdateFieldMode(true);}} style={{ width: "48px  " }}><EditIcon/></IconButton>
                    <IconButton onClick={Redo} disabled={(historyListIndex.current < historyList.length - 1) ? false : true} style={{ width: "48px" }}><ArrowForwardIcon /></IconButton>
                    <FormControl  style = {{position: "absolute", right: "10px", display: "flex", flexDirection: "row"}} >
                    <TextField 
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                          <IconButton onClick={() => {SearchFromSearchField()}}>
                                              <SearchIcon/>
                                          </IconButton>
                                        </InputAdornment>                              
                                }}
                                onKeyDown  = { SearchTextFieldKeyDown } 
                                onBlur     = { () =>{ UpdateFieldMode(false) } } 
                                inputProps = { { style: { fontSize: "15px", width: "150px" } } } 
                                value      = { searchFieldText } 
                                onChange   = { (e)=>{e.persist(); if(searchFieldAutoSearch) SearchFromSearchField(e.target.value); updateSearchFieldText(e.target.value)}}
                                onFocus    = { e => { e.target.select() } }         
                    />
                    <FormControlLabel style = {{paddingLeft: "10px",}} control = {                    
                            <Checkbox checked = {searchFieldAutoSearch} onChange = {(e)=>{e.persist(); changeSearchFieldAutoSearch(e.target.checked)}} />
                            } label = {<span style = {{fontSize: "15px"}}>autosearch</span>} />

                    </FormControl>
                    </div>   
        </>)
}, arePropsEqual)