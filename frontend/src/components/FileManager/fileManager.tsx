import React                          from "react";
import { useState, useEffect, useRef} from "react";

import { makeStyles, useTheme                              } from '@material-ui/core/styles';
import { Button, IconButton, Slider                        } from '@material-ui/core';
import { Fade, CircularProgress, Snackbar                  } from "@material-ui/core";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

import MuiAlert                                             from '@material-ui/lab/Alert';

import SettingsIcon     from '@material-ui/icons/Settings';
import CloseIcon        from '@material-ui/icons/Close';

import { ShowFiles }              from "./renderFileTable"
import { FileManagerToolbar }     from "./fileManagerToolbar";
import { FileManagerSettings }    from "./fileManagerSettings";
import { FileManagerFoldersTree } from './fileManagerFoldersTree'
import { FileManagerMainToolbar } from './fileManagerMainToolbar'
import { FileManagerSelectedFiles } from './fileManagerSelectedFiles'

import { loadFilesOnDirectory } from '../../backend/filesHandlingFunctions'
import { Rectangle } from './Rectangle'

import { isNumeric, checkIfActiveElementIsInput, GetRectangleRightTopAndLeftBottomCorners, DoRectanglesOverclap } from'../../utils/tools'
import { AssignmentReturnRounded } from "@material-ui/icons";
export interface FileType {
    name: string,
    type: string,
    path: string,
    typeGroup: string,
}

interface State {
    files: Array<FileType>,
    selectedFiles: Map<string,FileType>,
    currentPath: string,
    managerError: any,
    //showFilesRenderForce: Array<0>,
    filesTypes: Array<string>,
    acceptableFileTypes: Set<string> | undefined,
    mouseOverPath: string,
    numberOfColumns: number,
    sortMethodNumber: number,
    areSettingsOpen: boolean,
    filesDisplaySize: number
}

interface Props {
    minNumberOfSelectedFiles?: Number,
    maxNumberOfSelectedFiles?: Number,
    selectFiles: Function,
    loadDirectoryOnStart: string,
    dialogClose: Function,
    availableFilesTypes?: Array<string>,
    acceptableFileTypes?: Array<string>,
    isFileManagerOpen: boolean
}

const useStyles = makeStyles((theme) => ({
    navigation: {
        display: "flex",
        alignContent: "center",
        textAlign: "center",
        fontWeight: 500,
        justifyContent: "center",
    },
    filesManager: {
        WebkitUserSelect: 'none',
        "& button:focus": {
            outline: "none !import  ant",
            border: "none"
        },
        "& button": {
            width: "100%",
            fontWeight: 200,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            padding: "10px 10px",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "13px",
            cursor: "pointer",
        },
    },
    dialogPaper: {
        minHeight: '90vh',
        maxHeight: '90vh',
        minWidth: '75vw',
        maxWidth: '75vw',
        overflow: 'hidden',
        overflowX: 'hidden',
    },
    dialogRoot: {
        backgroundColor: theme.palette.fileManager.backgroundColor,
        color: theme.palette.fileManager.fontColor,
    },
    scrollBarHide: {
        '&::-webkit-scrollbar': {
            width: '1px'
        },
    }
}));

const Alert = (props : any) => (<MuiAlert elevation={6} variant="filled" {...props} />);

const sortStringCompare = (string1: string, string2: string) => {
    return string1 < string2;
    //return (string1.length < string2.length ? true : (string1.length === string2.length ? string1 < string2 : false))
}

export const FileManager: React.FunctionComponent<Props> = ({
    maxNumberOfSelectedFiles = Infinity, 
    minNumberOfSelectedFiles = 1, 
    isFileManagerOpen, 
    availableFilesTypes, 
    acceptableFileTypes,
    selectFiles,
    loadDirectoryOnStart, 
    dialogClose 
}) => {
    const [state, setState] = useState<State>({
        files: [], 
        currentPath: "", 
        managerError: null, 
        selectedFiles: new Map(),
        filesTypes: availableFilesTypes ? availableFilesTypes : [],
        acceptableFileTypes: acceptableFileTypes ? new Set(acceptableFileTypes) : undefined,
        mouseOverPath: "",
        numberOfColumns: 5,
        filesDisplaySize: 100,
        sortMethodNumber: 0,
        areSettingsOpen: false,
    })
    const [mouseSelectionStart, setMouseSelectionStart] = useState<{
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        isRightMB: boolean
    } | undefined>(undefined)
    const [errorSnackbarMessage, SetErrorSnackbarMessage] = useState("");
    const [advancedSettings, setAdvancedSettings] = useState({
        renderFilesLimit: 50
    })
    const [loadingCircular, showLoadingCircular] = useState<boolean>(false);
    const [stateToRerenderSelf, RerenderSelf] = useState<boolean>(false);
    //const [fieldMode, updateFieldMode] = useState<boolean>(false)
    let previousHiddenSearch = useRef<any>(null)
    let lastSearchOnHiddenSearch = useRef<number>(0)
    let searchWord = useRef<string>("")
    let filesRefs = useRef<Array<any>>([]);
    let showFilesRenderForce = useRef<Array<number>>(new Array(10000));
    let isHiddenSearchOn = useRef<boolean>(true);
    let lastCheckSelectionTime = useRef<number>(0);
    let renderFilesLimit = advancedSettings.renderFilesLimit + state.numberOfColumns - (advancedSettings.renderFilesLimit % state.numberOfColumns);

    /********************************
    *           USEEFFECT           *    
    ********************************/

    useEffect(() => {
        let currentTime = window.process.hrtime()
        let currentMicroSeconds = currentTime[0]*1000+Math.ceil(currentTime[1]/1000000)
        if(mouseSelectionStart && (currentMicroSeconds - lastCheckSelectionTime.current > 1000)) {
            CheckSelection();
            lastCheckSelectionTime.current = currentMicroSeconds
        }
    }, [mouseSelectionStart])

    useEffect(() => {
        RenderForceFoo(-1);
    }, [state.filesDisplaySize])

    useEffect(() => {
        showFilesRenderForce.current.fill(0)
        //console.log(loadDirectoryOnStart)
        loadDirectory(loadDirectoryOnStart);
    }, [loadDirectoryOnStart]);

    useEffect(() => {
        RenderForceFoo(-1)
        setState(prevState => ({
            ...prevState,
            //showFilesRenderForce: (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1),
            files: Array.from(prevState.files).sort(comparatorForFilesSort)
        }))

    }, [state.sortMethodNumber]);

    /********************************
    *            BACKEND            *    
    ********************************/

    const loadDirectory = async (path: string, regex?: string) => {
        showLoadingCircular(true);
        //@ts-ignore
        let [files, newPath]= await loadFilesOnDirectory({
            directory: path, 
            regex: regex ? regex : null, 
            filetypes: state.filesTypes
        });
        if(previousHiddenSearch.current) previousHiddenSearch.current.style.backgroundColor = "transparent"
        files.sort(comparatorForFilesSort);
        showLoadingCircular(false);
        RenderForceFoo(-1);
        setState(prevState => ({
            ...prevState,
            currentPath: newPath,
            managerError: files.length ? null : {message: "No files found from given regex :(", code: "404", number: "404"},
            files: files,
                            //showFilesRenderForce: (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1)
        }))
    }

     /********************************
    *        DISPLAYING FILES        *    
    ********************************/

    const onFileClick = (file: FileType, e: any, fileIsAlreadyClicked = false, id: number) => {
        if(e.persist) e.persist();    
        let isRightMB = false;
        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3; 
        else if ("button" in e)  // IE, Opera 
            isRightMB = e.button == 2; 
        if(!state.acceptableFileTypes || (state.acceptableFileTypes && state.acceptableFileTypes.has(file.type))) {
            let selectedFiles = new Map(state.selectedFiles)
            if((fileIsAlreadyClicked && isRightMB) || (fileIsAlreadyClicked && file.type !== "DIRECTORY")){
                selectedFiles.delete(file.path);
            }
            if (fileIsAlreadyClicked && file.type === "DIRECTORY" && !isRightMB){
                selectedFiles.delete(file.path);
                setState(prevState => (
                    { ...prevState, selectedFiles: selectedFiles}
                ))
                loadDirectory(file.path);
            }
            else if(!isRightMB && !fileIsAlreadyClicked){
                if(state.selectedFiles.size < maxNumberOfSelectedFiles) {
                    selectedFiles.set(file.path, file);
                        RenderForceFoo(id)
                    setState(prevState => (
                        { ...prevState, selectedFiles: selectedFiles }
                    ))
                } else {
                    SetErrorSnackbarMessage(`Maximum number of selected files is ${maxNumberOfSelectedFiles}`);
                }
            } else {
                RenderForceFoo(id)
                setState(prevState => (
                    { ...prevState, selectedFiles: selectedFiles }
                ))
            }
        } else if(file.type === "DIRECTORY") {
            loadDirectory(file.path);
        }
       
    }

    const showDeleteFileFromSelectedFilesButton = (overPath: string, currentOverPath = "", id: number) => {
        if(currentOverPath === "" || (currentOverPath === state.mouseOverPath)){
            RenderForceFoo(id)
            setState(prevState=>({
                ...prevState,
                mouseOverPath: overPath,
            }))
        }
        
        
    }

    const SetFilesRefs = (where: number, refValue: any) => {
        filesRefs.current[where] = refValue;
    }

    const RenderForceFoo = (index: number) => {
        if(index === -1){
            for(let i = 0; i < showFilesRenderForce.current.length; ++i){
                showFilesRenderForce.current[i] = (showFilesRenderForce.current[i] > 32000 ? 5 : showFilesRenderForce.current[i] + 1)
            }
        } else
            showFilesRenderForce.current[index] = (showFilesRenderForce.current[index] > 32000 ? 5 : showFilesRenderForce.current[index] + 1)
    }

    /********************************
    *    ON KEY DOWN & SELECTION    *    
    ********************************/


    const CheckSelection = () => {
        if(mouseSelectionStart)
            for(let i = 0; i < filesRefs.current.length; ++i) {
                if(!filesRefs.current[i]) continue;
                let isSelected = false;
                if(filesRefs.current[i].classList.contains('fileButton-selected')) 
                    isSelected = true;
                if(!filesRefs.current[i].classList.contains('fileButton-acceptable') ||
                    (isSelected && !mouseSelectionStart.isRightMB) ||
                    (!isSelected && mouseSelectionStart.isRightMB)) continue;
                let cords = filesRefs.current[i].getBoundingClientRect(); 
                let corners = GetRectangleRightTopAndLeftBottomCorners(cords.x, cords.y, cords.x + cords.width, cords.y + cords.height)
                let selectionCorners = GetRectangleRightTopAndLeftBottomCorners(mouseSelectionStart.x1, mouseSelectionStart.y1, mouseSelectionStart.x2, mouseSelectionStart.y2)
                if(DoRectanglesOverclap(
                    {x1: corners[0].x, y1: corners[0].y, x2: corners[1].x, y2: corners[1].y}, 
                    {x1: selectionCorners[0].x, y1: selectionCorners[0].y, x2: selectionCorners[1].x, y2: selectionCorners[1].y}
                ))
                    console.log(filesRefs.current[i])
                    filesRefs.current[i].click();
            }
    }

    const onMouseMoveOnDialogContent = (e: any) => {
        e.persist();
        if(mouseSelectionStart) {
            setMouseSelectionStart((pv: any) => ({
                ...pv,
                x2: e.pageX,
                y2: e.pageY
            }));
        }
    }

    const onMouseDownOnDialog = (e: any) => {
        if(e.target.tagName !== "DIV" || (
            e.target.id !== "FileManager-DialogContent" &&
            e.target.id !== "FileManager-SelectedFiles" &&
            e.target.id !== "FileMangers-RenderedFiles")) return;
        e.persist();
        let isRightMB = false;
        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3; 
        else if ("button" in e)  // IE, Opera 
            isRightMB = e.button == 2; 
        setMouseSelectionStart({
            x1: e.pageX,
            y1: e.pageY,
            x2: e.pageX,
            y2: e.pageY,
            isRightMB: isRightMB,
        })
    }

    const onMouseUpOnDialogContent = (e: any) => {
        if(!mouseSelectionStart) return;
        e.persist();
        setMouseSelectionStart(undefined)
    }

    const onKeyDownOnFile = (e: any, path: string) => {
        if(e.keyCode === 13){
            loadDirectory(path);
        }
    }

    const onKeyDownOnDialog = (e: any) => {
        if(e.keyCode === 27) dialogClose();
        else if(e.keyCode === 13){
            //selectFiles([...selectedFiles.values()]); 
            //dialogClose();
        } else if(e.keyCode === 37 ) return;
        else if(e.keyCode === 39) return;
        else if(isHiddenSearchOn.current && !checkIfActiveElementIsInput() && e.keyCode >= 49 && e.keyCode <= 125){
            let currentTime = (new Date()).getTime()
            if(currentTime-lastSearchOnHiddenSearch.current >= 1000){
                searchWord.current = "";
            }
            lastSearchOnHiddenSearch.current = currentTime
            let key = e.keyCode;
            if(!e.shiftKey && key >= 65 && key <= 90) key += 32
            searchWord.current += String.fromCharCode(key);
            HiddenSearch(searchWord.current)
            //console.log(searchWord.current)
        }
    }

    /********************************
    *         SORTING FILES         *    
    ********************************/

    const comparatorForFilesSort = (obj1: FileType, obj2: FileType) => {
        switch(state.sortMethodNumber){
            case 0:
                return (obj1.typeGroup < obj2.typeGroup ? -1 : 
                    (obj1.typeGroup === obj2.typeGroup ? (obj1.type < obj2.type ? -1 : (obj1.type===obj2.type ? (sortStringCompare(obj1.name, obj2.name) ? -1 : 1) : 1)) : 1))
            case 1:
                return (obj1.typeGroup > obj2.typeGroup ? -1 : 
                    (obj1.typeGroup === obj2.typeGroup ? (obj1.type < obj2.type ? -1 : (obj1.type===obj2.type ? (sortStringCompare(obj1.name, obj2.name) ? -1 : 1) : 1)) : 1))
            case 2:
                return sortStringCompare(obj2.name, obj1.name) ? -1 : 1
            case 3:
                return sortStringCompare(obj1.name, obj2.name) ? -1 : 1
            default:
                return -1
        }
    }

    const ChangeSortMethodNumber = (e: any) => {
        e.persist();
        setState(prevState => ({
            ...prevState,
            sortMethodNumber: e.target.value,
        }))
    }

    const ChangeNumberOfColumns = (val: any) => {
        if(isNumeric(val)){
            if(val) RenderForceFoo(-1)
            setState(prevState => ({
                ...prevState, 
                //showFilesRenderForce: val ? (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1) : prevState.showFilesRenderForce,
                numberOfColumns: Math.max(val, 0)
            }))
        }   
    }

    const ChangeFilesDisplaySize = (e: any, newValue: number) => {
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            filesDisplaySize: newValue,
        }),)
    }

    /********************************
    *         HIDDEN SEARCH         *    
    ********************************/

    const HiddenSearch = (regex: string) => {
        if(previousHiddenSearch.current) previousHiddenSearch.current.style.backgroundColor = "transparent"
        const regexExp = new RegExp(regex);
        for(let i = 0; i < state.files.length; ++i){
            if(regexExp.test(state.files[i].name)){
                filesRefs.current[i].focus(); filesRefs.current[i].style.backgroundColor = "#e0e0e0"
                previousHiddenSearch.current = filesRefs.current[i];
                return;
            }
        }
    }
    /********************************/

    const classes = useStyles()
    let renderLimesArray = Array.from({length: Math.ceil(state.files.length/renderFilesLimit)}, (v, k) => k * renderFilesLimit);
    /*for(let i = 0; i < files.length; i += renderFilesLimit)
        renderLimesArray.push(i);*/
    console.log(1)
    return (
        <>
        { mouseSelectionStart ? 
            <Rectangle 
                x0 = {mouseSelectionStart.x1} 
                x1 = {mouseSelectionStart.x2} 
                y0 = {mouseSelectionStart.y1} 
                y1 = {mouseSelectionStart.y2}
            /> : null}
        <FileManagerSettings open = { state.areSettingsOpen } dialogClose = { () => {setState(prevState => ({...prevState, areSettingsOpen: false}))} } />
        <Dialog onMouseUp = {(e) => {onMouseUpOnDialogContent(e)}} onMouseMove = {(e) => {onMouseMoveOnDialogContent(e)}} onMouseDown = {(e) => {onMouseDownOnDialog(e)}} onKeyDown = {(e)=>{onKeyDownOnDialog(e)}} scroll = "body" classes = {{ paper: classes.dialogPaper}} fullWidth={true} maxWidth="lg" className={classes.filesManager} open={isFileManagerOpen} >
                <div style = {{zIndex: 9999, position: "absolute", left: "calc(50% - 20px)", top: "calc(50% - 20px)"}}>
                            <Fade in={loadingCircular} style={{ transitionDelay: '100ms',}} unmountOnExit>
                                <CircularProgress size={40}/>
                            </Fade>
                </div>
                <IconButton style = {{position: "absolute", color: "red", right: "10px", top: "10px", width: "20px", height: "20px", display: "flex"}} onClick = {()=>{dialogClose()}}><CloseIcon/></IconButton>                
                <IconButton style = {{position: "absolute", color: "grey", right: "40px", top: "10px", width: "20px", height: "20px", display: "flex"}} onClick = {()=>{setState(prevState => ({...prevState, areSettingsOpen: true}))}}><SettingsIcon/></IconButton>                
                {/*<FoldersTable dialogClose = {() => {updateFolderManagerOpen(false)}} socket={socket} selectPath={updateSelectedPath} loadDirectoryOnStart={selectedPath} />*/}
            <DialogTitle id = "FileManager-DialogTitle" className = {classes.scrollBarHide} style={{ textAlign: "center", minHeight: "15vh", overflowY: "visible", overflowX: "hidden", scrollbarWidth: "none" }}>
                <div>Select directory</div>
                <div style = {{display: "flex", flexDirection: "column"}}>
                    <div className={classes.navigation}>
                    <FileManagerToolbar 
                        SetHiddenSearch = {() => {isHiddenSearchOn.current = !isHiddenSearchOn.current; if(isHiddenSearchOn.current){ RenderForceFoo(-1); RerenderSelf(ps => !ps)}}} 
                        sortMethodNumber = { state.sortMethodNumber } 
                        ChangeSortMethodNumber = { ChangeSortMethodNumber }
                        numberOfColumns = { state.numberOfColumns } 
                        ChangeNumberOfColumns = { ChangeNumberOfColumns } 
                        filesDisplaySize = { state.filesDisplaySize }
                        ChangeFilesDisplaySize = { ChangeFilesDisplaySize }
                    />
                    </div>
                    <FileManagerMainToolbar socket = {null} currentPath = {state.currentPath} loadDirectory = {loadDirectory} />
                </div>
            </DialogTitle>       
            <DialogContent id = "FileManager-DialogContent" classes = {{root: classes.dialogRoot}} style={{ overflowX: "hidden", paddingLeft: 5, paddingRight: 5, display: "flex", minHeight: '69vh', maxHeight: '69vh', }}>

                <div className = {classes.scrollBarHide} style = {{overflow: "scroll", scrollbarWidth: 'thin', minWidth: '13vw', maxWidth: '13vw'}}>
                    <FileManagerFoldersTree showLoadingCircular = {()=>{showLoadingCircular(true)}} currentPath = {state.currentPath} joinDirectory = {loadDirectory}/>
                </div>  
                <div className = {classes.scrollBarHide} style = {{borderLeft: "solid 1px #a0a9ad4d", overflow: "scroll", minWidth: '40vw', maxWidth: '62vw', scrollbarWidth: 'thin'}}>
                    {state.managerError ?
                        <div style={{ textAlign: "center" }}>
                            <span style={{ color: "red", fontSize: "25px" }}><b>Error</b></span> <br />
                            Error message: <b>{state.managerError.message}</b> <br />
                            Error code: <b>{state.managerError.code}</b> <br />
                            Error number: <b>{state.managerError.number}</b>
                        </div> : null}
                        <div id = "FileMangers-RenderedFiles">
                        {renderLimesArray.map((i,ac)=>{
                            if(i > state.files.length) return null;
                            return <ShowFiles acceptableFileTypes = {state.acceptableFileTypes} filesDisplaySize = { state.filesDisplaySize } key = {`filesBlock-${i}-${ac}`} onFileKeyDown = {onKeyDownOnFile} saveRefs = {isHiddenSearchOn.current} SetFilesRefs = {SetFilesRefs} renderFilesLimit = { renderFilesLimit } startIndex = {i} displaySettings = {{numberOfColumns: state.numberOfColumns}} showDeleteFileFromSelectedFilesButton = { showDeleteFileFromSelectedFilesButton } mouseOverPath={ state.mouseOverPath } files={state.files.slice(i, i + renderFilesLimit)} selectedFiles = {state.selectedFiles} onFileClick={onFileClick} renderForce = {showFilesRenderForce.current[ac]} />
                        })}
                        </div>
                </div>
                <div id = "FileManager-SelectedFiles" className = {classes.scrollBarHide} style = {{overflow: "scroll", scrollbarWidth: 'thin', minWidth: '13vw', maxWidth: '13vw'}}>
                    <FileManagerSelectedFiles LoadDirectory = {loadDirectory} selectedFiles = {state.selectedFiles}/>
                </div>  
                <Snackbar open={errorSnackbarMessage ? true : false} autoHideDuration={2000} onClose={()=>{SetErrorSnackbarMessage("")}}>
                    <Alert onClose={()=>{SetErrorSnackbarMessage("")}} severity="error">
                        {errorSnackbarMessage}
                    </Alert>
                </Snackbar>
            </DialogContent>
            <DialogActions style = {{justifyContent: "center",  overflowY: "visible", display: "flex", minHeight: '6vh', maxHeight: '6vh'}}>
                <div style = {{alignContent: "center", textAlign: "center", overflowY: "visible", overflowX: "hidden", scrollbarWidth: "none"}}>
                <Button disabled={state.selectedFiles.size < minNumberOfSelectedFiles} onClick = {() => {selectFiles([...state.selectedFiles.values()]); dialogClose()}}>Select <b>{state.selectedFiles.size}</b> files</Button>
                </div>
            </DialogActions>
            </Dialog>
        </>)
}