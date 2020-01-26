import React                          from "react";
import { useState, useEffect, useRef} from "react";

import { makeStyles                                        } from '@material-ui/core/styles';
import { Button, IconButton                                } from '@material-ui/core';
import { Fade, CircularProgress, Snackbar                  } from "@material-ui/core";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

import MuiAlert                                             from '@material-ui/lab/Alert';

import SettingsIcon     from '@material-ui/icons/Settings';
import CloseIcon        from '@material-ui/icons/Close';

//import { useRef } from "@storybook/addons";

import { ShowFiles }              from "./renderFileTable"
import { FileManagerToolbar }     from "./fileManagerToolbar";
import { FileManagerSettings }    from "./fileManagerSettings";
import { FileManagerFoldersTree } from './fileManagerFoldersTree'
import { FileManagerMainToolbar } from './fileManagerMainToolbar'
import { forceReRender } from "@storybook/react";
interface FileType {
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
    mouseOverPath: string,
    numberOfColumns: number,
    sortMethodNumber: number,
    areSettingsOpen: boolean
}

interface Props {
    minNumberOfSelectedFiles?: Number,
    maxNumberOfSelectedFiles?: Number,
    selectFiles: Function,
    socket: any,
    loadDirectoryOnStart: string,
    dialogClose: Function,
    availableFilesTypes: Array<string>,
    isFileManagerOpen: boolean
}

const useStyles = makeStyles({
    navigation: {
        display: "flex",
        alignContent: "center",
        textAlign: "center",
        fontWeight: 500,
        justifyContent: "center",
    },
    fileTable: {
        border: "none",
        '& tbody': {
          '& tr': {
              '& td': {
                  border: "1px solid",
                  borderColor: "#e0ebeb",
                  borderCollapse: "collapse",
                  align: "left",
                  '& button': {
                      textAlign: "left",
                      }
              }
            }
        }
        
      },
      filesManager: {
        '& td': {
            width: "50%",
            minWidth: "250px",
            textAlign: "center",
            border: "1px solid black",
        },
        "& table": {
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            minHeight: "600px",
            //tableLayout: "auto"
        },
        "& button:focus": {
            outline: "none !important",
            border: "none"
        },
        "& button": {
            width: "100%",
            fontWeight: 600,
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
    scrollBarHide: {
        '&::-webkit-scrollbar': {
            width: '1px'
        },
    }
});

const Alert = (props : any) => (<MuiAlert elevation={6} variant="filled" {...props} />);

const useFocus = () => {
    const htmlElRef = useRef(null)
    //@ts-ignore
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
	return [ htmlElRef,  setFocus ] 
}

const isNumeric = (number: any) => {
    return +number === +number
}

export const FileManager: React.FunctionComponent<Props> = ({maxNumberOfSelectedFiles = Infinity, minNumberOfSelectedFiles = 1, isFileManagerOpen, availableFilesTypes, selectFiles, socket, loadDirectoryOnStart, dialogClose }) => {
    
    const [state, setState] = useState<State>({
        files: [],
        currentPath: "",
        managerError: null,
        selectedFiles: new Map(),
        //showFilesRenderForce: [],
        filesTypes: [],
        mouseOverPath: "",
        numberOfColumns: 5,
        sortMethodNumber: 0,
        areSettingsOpen: false,
    })
    const [errorSnackbarMessage, SetErrorSnackbarMessage] = useState("");
    let isHiddenSearchOn = useRef<boolean>(true);
    const [advancedSettings, setAdvancedSettings] = useState({
        renderFilesLimit: 50
    })
    const [loadingCircular, showLoadingCircular] = useState<boolean>(false);
    const [stateToRerenderSelf, RerenderSelf] = useState<boolean>(false);
    //const [fieldMode, updateFieldMode] = useState<boolean>(false)

    let showFilesRenderForce = useRef<Array<number>>(new Array(10000));
    let renderFilesLimit = advancedSettings.renderFilesLimit + state.numberOfColumns - (advancedSettings.renderFilesLimit % state.numberOfColumns);
    
    let previousHiddenSearch = useRef<any>(null)
    let lastSearchOnHiddenSearch = useRef<number>(0)
    let searchWord = useRef<string>("")
    let filesRefs = useRef<Array<any>>([]);
    let { selectedFiles, files, currentPath, managerError, mouseOverPath } = state;
    
    const SetFilesRefs = (where: number, refValue: any) => {
        filesRefs.current[where] = refValue;
    }

    let renderFilesTableRef = useRef();

    const RenderForceFoo = (index: number) => {
        if(index === -1){
            for(let i = 0; i < showFilesRenderForce.current.length; ++i){
                showFilesRenderForce.current[i] = (showFilesRenderForce.current[i] > 32000 ? 5 : showFilesRenderForce.current[i] + 1)
            }
        } else
            showFilesRenderForce.current[index] = (showFilesRenderForce.current[index] > 32000 ? 5 : showFilesRenderForce.current[index] + 1)

    }

    const checkIfActiveElementIsInput = () => {
        let activeElement = document.activeElement;
        let inputs = ['input', 'select', 'textarea'];
        return (activeElement && inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1);
    }

    useEffect(() => {
        showFilesRenderForce.current.fill(0)
        loadDirectory(loadDirectoryOnStart);
    }, [loadDirectoryOnStart]);

    const sortStringCompare = (string1: string, string2: string) => {
        return string1 < string2;
        //return (string1.length < string2.length ? true : (string1.length === string2.length ? string1 < string2 : false))
    }

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

    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", (msg: any) => {
                const message = JSON.parse(msg.data)
                const type = message.type
                const data = message.data
                if (type === "loadDirectory") {
                    if(previousHiddenSearch.current) previousHiddenSearch.current.style.backgroundColor = "transparent"
                    data.files.sort(comparatorForFilesSort);
                    showLoadingCircular(false);
                    RenderForceFoo(-1);
                    setState(prevState => ({
                            ...prevState,
                            currentPath: data.path,
                            managerError: data.files.length ? null : {message: "No files found from given regex :(", code: "404", number: "404"},
                            files: data.files,
                            //showFilesRenderForce: (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1)
                    }))
                } else if (type === "loadDirectoryERROR") {
                    RenderForceFoo(-1)
                    setState(prevState => (
                        {
                            ...prevState,
                            currentPath: data.path,
                            newPath: null,
                            managerError: data.error,
                            files: [],
                           // showFilesRenderForce: (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1)
                        }
                    ))  
                }
            })
        }
    }, [socket]);

    const loadDirectory = (path: string, regex?: string) => {
        showLoadingCircular(true);
        if(socket){
            socket.send(JSON.stringify({
                type: "loadFilesOnDirectory",
                data: {
                    directory: path,
                    ShowFilesTypes: state.filesTypes,
                    regex: regex ? regex : null
                }
            }))
        } else console.log("connection error")
    }

    const onFileClick = (file: FileType, e: any, fileIsAlreadyClicked = false, id: number) => {
        if(e.persist) e.persist();    
        let isRightMB = false;
        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3; 
        else if ("button" in e)  // IE, Opera 
            isRightMB = e.button == 2; 
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
            if(selectedFiles.size < maxNumberOfSelectedFiles) {
                selectedFiles.set(file.path, file);
                //e.target.style.backgroundColor = "green"
                RenderForceFoo(id)
                setState(prevState => (
                    { ...prevState, selectedFiles: selectedFiles, /*showFilesRenderForce: (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1)*/ }
                ))
            } else {
                SetErrorSnackbarMessage(`Maximum number of selected files is ${maxNumberOfSelectedFiles}`);
            }
        } else {
            //e.target.style.backgroundColor = "green"
            RenderForceFoo(id)
            setState(prevState => (
                { ...prevState, selectedFiles: selectedFiles, /*showFilesRenderForce: (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1)*/ }
            ))
        }
    }

    const showDeleteFileFromSelectedFilesButton = (overPath: string, currentOverPath = "", id: number) => {
        if(currentOverPath === "" || (currentOverPath === state.mouseOverPath)){
            //console.log("UPDATE", overPath);
            RenderForceFoo(id)
            setState(prevState=>({
                ...prevState,
                mouseOverPath: overPath,
                //showFilesRenderForce: (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1)
            }))
        }
        
        
    }

    useEffect(() => {
        files.sort(comparatorForFilesSort);
        RenderForceFoo(-1)
        setState(prevState => ({
            ...prevState,
            //showFilesRenderForce: (prevState.showFilesRenderForce > 32000 ? 5 : prevState.showFilesRenderForce + 1),
            files: files
        }))

    }, [state.sortMethodNumber]);

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
    const classes = useStyles()
    let testmap = [];
    for(let i = 0; i < files.length; i += renderFilesLimit){
        testmap.push(i);
    }

    const onKeyDownOnFile = (e: any, path: string) => {
        if(e.keyCode === 13){
            loadDirectory(path);
        }
    }

    const onKeyDownOnDialog = (e: any) => {
        if(e.keyCode === 37 ) return;
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
            console.log(searchWord.current)
        }
    }

    const HiddenSearch = (regex: string) => {
        if(previousHiddenSearch.current) previousHiddenSearch.current.style.backgroundColor = "transparent"
        const regexExp = new RegExp(regex);
        for(let i = 0; i < files.length; ++i){
            if(regexExp.test(files[i].name)){
                filesRefs.current[i].focus(); filesRefs.current[i].style.backgroundColor = "#e0e0e0"
                previousHiddenSearch.current = filesRefs.current[i];
                return;
            }
        }
    }

    return (
        <>
        <FileManagerSettings open = { state.areSettingsOpen } dialogClose = { () => {setState(prevState => ({...prevState, areSettingsOpen: false}))} } />
        <Dialog onKeyDown = {(e)=>{onKeyDownOnDialog(e)}} scroll = "body" classes = {{ paper: classes.dialogPaper }} fullWidth={true} maxWidth="lg" className={classes.filesManager} open={isFileManagerOpen} >
                <div style = {{zIndex: 9999, position: "absolute", left: "calc(50% - 20px)", top: "calc(50% - 20px)"}}>
                            <Fade in={loadingCircular} style={{ transitionDelay: '100ms',}} unmountOnExit>
                                <CircularProgress size={40}/>
                            </Fade>
                </div>
                <IconButton style = {{position: "absolute", color: "red", right: "10px", top: "10px", width: "20px", height: "20px", display: "flex"}} onClick = {()=>{dialogClose()}}><CloseIcon/></IconButton>                
                <IconButton style = {{position: "absolute", color: "grey", right: "40px", top: "10px", width: "20px", height: "20px", display: "flex"}} onClick = {()=>{setState(prevState => ({...prevState, areSettingsOpen: true}))}}><SettingsIcon/></IconButton>                
                {/*<FoldersTable dialogClose = {() => {updateFolderManagerOpen(false)}} socket={socket} selectPath={updateSelectedPath} loadDirectoryOnStart={selectedPath} />*/}
            <DialogTitle className = {classes.scrollBarHide} style={{ textAlign: "center", minHeight: "15vh", overflowY: "visible", overflowX: "hidden", scrollbarWidth: "none" }}>
                <div>Select directory</div>
                <div style = {{display: "flex", flexDirection: "column"}}>
                    <div className={classes.navigation}>
                    <FileManagerToolbar SetHiddenSearch = {() => {isHiddenSearchOn.current = !isHiddenSearchOn.current; if(isHiddenSearchOn.current){ RenderForceFoo(-1); RerenderSelf(ps => !ps)}}} sortMethodNumber = { state.sortMethodNumber } numberOfColumns = { state.numberOfColumns } ChangeNumberOfColumns = { ChangeNumberOfColumns } ChangeSortMethodNumber = { ChangeSortMethodNumber }/>
                    </div>
                    <FileManagerMainToolbar socket = {socket} currentPath = {currentPath} loadDirectory = {loadDirectory} />
                </div>
            </DialogTitle>       
            <DialogContent style={{ overflowX: "hidden", paddingLeft: 5, paddingRight: 5, display: "flex", minHeight: '69vh', maxHeight: '69vh', }}>
                <div className = {classes.scrollBarHide} style = {{overflow: "scroll", scrollbarWidth: 'thin', minWidth: '13vw', maxWidth: '13vw'}}>
                    <FileManagerFoldersTree showLoadingCircular = {()=>{showLoadingCircular(true)}} currentPath = {state.currentPath} socket = {socket}/>
                </div>  
                <div className = {classes.scrollBarHide} style = {{overflow: "scroll", minWidth: '62vw', maxWidth: '62vw', scrollbarWidth: 'thin'}}>
                    {managerError ?
                        <div style={{ textAlign: "center" }}>
                            <span style={{ color: "red", fontSize: "25px" }}><b>Error</b></span> <br />
                            Error message: <b>{managerError.message}</b> <br />
                            Error code: <b>{managerError.code}</b> <br />
                            Error number: <b>{managerError.number}</b>
                        </div> : null}
                    <table className = {classes.fileTable} ><tbody>
                        {testmap.map((i,ac)=>{
                            if(i > files.length) return null;
                            return <ShowFiles onFileKeyDown = {onKeyDownOnFile} saveRefs = {isHiddenSearchOn.current} SetFilesRefs = {SetFilesRefs} key = {`filesRender-${i}`} renderFilesLimit = { renderFilesLimit } startIndex = {i} displaySettings = {{numberOfColumns: state.numberOfColumns}} showDeleteFileFromSelectedFilesButton = { showDeleteFileFromSelectedFilesButton } mouseOverPath={ mouseOverPath } files={files} selectedFiles = {selectedFiles} onFileClick={onFileClick} renderForce = {showFilesRenderForce.current[ac]} />
                        })}
                    </tbody></table>
                </div>
                <Snackbar open={errorSnackbarMessage ? true : false} autoHideDuration={2000} onClose={()=>{SetErrorSnackbarMessage("")}}>
                    <Alert onClose={()=>{SetErrorSnackbarMessage("")}} severity="error">
                        {errorSnackbarMessage}
                    </Alert>
                </Snackbar>
            </DialogContent>
            <DialogActions style = {{justifyContent: "center",  overflowY: "visible", display: "flex", minHeight: '6vh', maxHeight: '6vh'}}>
                <div style = {{alignContent: "center", textAlign: "center", overflowY: "visible", overflowX: "hidden", scrollbarWidth: "none"}}>
                <Button disabled={selectedFiles.size < minNumberOfSelectedFiles} onClick = {() => {selectFiles(selectedFiles); dialogClose()}}>Select <b>{selectedFiles.size}</b> files</Button>
                </div>
            </DialogActions>
            </Dialog>
        </>)
}