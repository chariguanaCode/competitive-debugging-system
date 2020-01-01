import React, { memo } from "react";
import { useState, useEffect, useRef} from "react"
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { DialogActions, DialogContent } from "@material-ui/core";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import createFragment from "react-addons-create-fragment";
import EditIcon from '@material-ui/icons/Edit';
//import { useRef } from "@storybook/addons";

interface State {
    folders: Array<string>,
    currentPath: string,
    newPath: any,
    undoStack: Array<string>,
    redoStack: Array<string>,
    managerError: any,
    selectedFolder: any,
}

interface Folders {
    folders: Array<string>,
    selectedFolder: string,
    onFolderSelect: Function,
    currentPath: string,
}

interface Table {
    selectPath: Function,
    socket: any,
    loadDirectoryOnStart: string,
    dialogClose: Function,
}

const useStyles = makeStyles({
    navigation: {
        display: "flex",
        alignContent: "center",
        textAlign: "center",
        fontWeight: "bold",
        justifyContent: "center",
    },

});

const UseFocus = () => {
    const htmlElRef = useRef(null)
    //@ts-ignore
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

	return [ htmlElRef,  setFocus ] 
}

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (prevProps.selectedFolder === nextProps.selectedFolder) && nextProps.folders.length && (prevProps.currentPath === nextProps.currentPath);
}

const ShowFolders: React.FunctionComponent<Folders> = memo(({ folders, selectedFolder, onFolderSelect, currentPath }) => {
    let table: any;
    let temp: any = null
    let iterator = 0;
    folders.map((name: string) => {
        if (iterator === 5) {
            table = <>{table}<tr>{temp}</tr></>
            temp = null;
            iterator = 0;
        }
        if (name === selectedFolder) temp = <>{temp}<td style={{ backgroundColor: "#66ccff" }}><button style={{ backgroundColor: "#66ccff" }} onClick={() => { onFolderSelect(name) }}>{name}</button></td></>
        else temp = <>{temp}<td><button onClick={() => { onFolderSelect(name) }}>{name}</button></td></>
        iterator += 1;
        return 0;
    })
    if (temp !== null) table = <>{table}<tr>{temp}</tr></>
    return <table><tbody>{table}</tbody></table>
}, arePropsEqual)


export const FoldersTable: React.FunctionComponent<Table> = ({ selectPath, socket, loadDirectoryOnStart, dialogClose }) => {
    const [state, setState] = useState<State>({
        folders: [],
        currentPath: "",
        newPath: null,
        undoStack: [],
        redoStack: [],
        managerError: null,
        selectedFolder: null,
    })
    const [fieldMode, updateFieldMode] = useState<boolean>(false)
    const [textFieldRef, setTextFieldFocus] = UseFocus();
    /*const [selectedFolder, updateSelectedFolder] = useState<any>(null)
    const [folders, updateFolders] = useState([])
    const [currentPath, updateCurrentPath] = useState("/")
    const [newPath, updateNewPath] = useState("")
    const [undoStack, updateUndoStack] = useState<Array<string>>([])
    const [redoStack, updateRedoStack] = useState<Array<string>>([])
    const [managerError, updateManagerError] = useState<any>(null)*/

    let { selectedFolder, folders, currentPath, newPath, undoStack, redoStack, managerError } = state;

    const Undo = () => {
        
        if (undoStack.length) {
            // @ts-ignore
            let val: string = undoStack.pop();
            if((!redoStack.length || redoStack[redoStack.length-1]!==currentPath)){
                redoStack.push(currentPath)
                setState(prevState => (
                    { ...prevState, redoStack: redoStack }
                ))
            }
            
            //updateRedoStack(redoStack);
            loadDirectory(val, false);
        }
    }

    const Redo = () => {
        if (redoStack.length) {
            // @ts-ignore
            let val: string = redoStack.pop();
            if(!undoStack.length || undoStack[undoStack.length-1]!==currentPath){
                undoStack.push(currentPath)
                setState(prevState => (
                    { ...prevState, undoStack: undoStack }
                ))
            }
          
            //updateUndoStack(undoStack)
            loadDirectory(val, false);
        }
    }

    useEffect(() => {
        loadDirectory(loadDirectoryOnStart, false);
    }, [loadDirectoryOnStart]);

    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", (msg: any) => {
                const message = JSON.parse(msg.data)
                const type = message.type
                const data = message.data
                if (type === "loadDirectory") {
                    setState(prevState => (
                        {
                            ...prevState,
                            currentPath: data.path,
                            newPath: null,
                            managerError: null,
                            folders: data.files,
                            selectedFolder: "",
                        }
                    ))
                    /*updateCurrentPath(data.path);
                    updateNewPath("");
                    updateManagerError(null);
                    updateFolders(data.files);
                    updateSelectedFolder("");*/
                } else if (type === "loadDirectoryERROR") {
                    setState(prevState => (
                        {
                            ...prevState,
                            currentPath: data.path,
                            newPath: null,
                            managerError: data.error,
                            folders: [],
                            selectedFolder: "",
                        }
                    ))
                    /*updateCurrentPath(data.path);
                    updateNewPath("");
                    updateFolders([]);
                    updateManagerError(data.error);
                    updateSelectedFolder("");*/
                }
            })
        }
    }, [socket]);
    useEffect(() => {
        //@ts-ignore
        if(fieldMode) setTextFieldFocus();
    }, [fieldMode]);
    const loadDirectory = (path: string, updateStack: boolean = true) => {
        if(socket){
        if (updateStack) {
            if((!undoStack.length || undoStack[undoStack.length-1]!==currentPath)&& path!==currentPath ){
                console.error(undoStack[undoStack.length-1],currentPath,undoStack)
                    undoStack.push(currentPath)
                    setState(prevState => (
                        { ...prevState, undoStack: undoStack, }
                    ))
            }
            //updateUndoStack(undoStack);
        }
        socket.send(JSON.stringify({
            type: "loadDirectory",
            data: {
                directory: path,
            }
        }))
        } else console.log("connection error")
    }

    const onFolderSelect = (name: string) => {
        if (selectedFolder === name) loadDirectory(currentPath + name);
        else setState(prevState => (
            { ...prevState, selectedFolder: name, }
        ))
    }

    const SetPathFromField = (e: any) => {
        e.preventDefault();
        loadDirectory(e.target.value);
    }

    const PathTextFieldKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            updateFieldMode(false);
            SetPathFromField(e);
        }
    }

    const updateTextOnTextField = (e: any) => {
        e.preventDefault();
        let val = e.target.value;
        setState(prevState => ({ ...prevState, newPath: val, }))
    }
    return (
        <>
            <div className={useStyles().navigation}>
                <IconButton onClick={()=>{loadDirectory('/')}} style={{ width: "48px" }}><HomeIcon /></IconButton>
                <IconButton onClick={Undo} disabled={undoStack.length ? false : true} style={{ width: "48px" }}><ArrowBackIcon /></IconButton>
               
                {fieldMode ? 
                <TextField inputRef={textFieldRef} onKeyDown={PathTextFieldKeyDown} onBlur={()=>{updateFieldMode(false)/*setState(prevState => ({ ...prevState, newPath: null, }))*/}} inputProps={{ style: { fontSize: "15px", width: "350px" } }} value={newPath !== null ? newPath : currentPath} onChange={updateTextOnTextField}/*updateNewPath(e.target.value);*/ />
                :
                <Breadcrumbs style = {{display: "inline-block"}} aria-label="breadcrumb">
                    {/* 
                        // @ts-ignore */}
                     {currentPath === '/' ? <Button style={{pointerEvents: "none"}}>/</Button> : currentPath.split('/').reduce((valIn,val,it)=>{
                        let onPath = valIn[0]
                        console.log(onPath,valIn)
                        if(val) return [onPath+val+'/',createFragment({a: valIn[1],b: <Button onClick={()=>{loadDirectory(onPath+val+'/')}}>{val}</Button>})]
                        else return [onPath+val+'/',valIn[1]];
                    },["",null])}
                </Breadcrumbs>}
                 {/* 
                        // @ts-ignore */}
                <IconButton onClick = {()=>{updateFieldMode(true);}} style={{ width: "48px  " }}><EditIcon/></IconButton>
                <IconButton onClick={Redo} disabled={redoStack.length ? false : true} style={{ width: "48px" }}><ArrowForwardIcon /></IconButton>
            </div>
            <DialogContent style={{ padding: "0px" }}>
                {managerError ?
                    <div style={{ textAlign: "center" }}>
                        <span style={{ color: "red", fontSize: "25px" }}><b>Error</b></span> <br />
                        Error message: <b>{managerError.message}</b> <br />
                        Error code: <b>{managerError.code}</b> <br />
                        Error number: <b>{managerError.number}</b>
                    </div> : null}
                <ShowFolders currentPath={currentPath + selectedFolder} folders={folders} selectedFolder={selectedFolder} onFolderSelect={onFolderSelect} />
            </DialogContent>
            <DialogActions>
                <Button disabled={(currentPath + selectedFolder === "null" || managerError) ? true : false} onClick = {() => {selectPath(currentPath + selectedFolder);dialogClose();}}>Select <b>{currentPath + selectedFolder}</b></Button>
            </DialogActions>
        </>)
}