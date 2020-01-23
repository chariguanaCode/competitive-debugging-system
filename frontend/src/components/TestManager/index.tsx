import React, { memo }          from "react";
import { useState, useEffect }  from "react"

import { TextField, Button, IconButton, DialogTitle, Dialog, InputAdornment }    from '@material-ui/core';
import { makeStyles                                                         }    from '@material-ui/core/styles';

import CancelIcon     from '@material-ui/icons/Cancel';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

import { FoldersTable }       from "./folderManager"
import { FileManager        } from "./fileManager"
import { FilesLoadingStatus } from "./filesLoadingStatus"
interface Props {
    socket: any,
    availableFileTypes?: Array<string>
}

interface FormError {
    regexError: string,
    pathError: string
}

const useStyles = makeStyles({
    
});

export const TestManager: React.FunctionComponent<Props> = ({ socket, availableFileTypes }) => {
    const [state, setState] = useState({
        regex: '',
        selectedPath: "/",
        folderManagerOpen: false,
        tests: [],
        isLoadButtonDisabled: false,
        formError: {
            regexError: "",
            pathError: "",
        }
    })
    /*const [regex, changeRegex] = useState('');
    const [selectedPath, updateSelectedPath] = useState("/")
    const [folderManagerOpen, updateFolderManagerOpen] = useState(false);
    const [tests, updateTests] = useState<Array<string>>([]);
    const [isLoadButtonDisabled, updateLoadButtonDisabledStatus] = useState<boolean>(false);
    const [formError, updateFormError] = useState<FormError>({
        regexError: "",
        pathError: "",
    });*/

    let { regex, selectedPath, folderManagerOpen, tests, isLoadButtonDisabled, formError } = state
    const HandleChangeRegex = (e: any) => {
        setState(prevState => ({
            ...prevState,
            regex: e.target.value,
        }))
        //changeRegex(e.target.value);
    }

    const LoadTests = () => {
        setState(prevState => ({
            ...prevState,
            isLoadButtonDisabled: true
        }))
       // updateLoadButtonDisabledStatus(true);
        socket.send(JSON.stringify({
            type: "loadTests",
            data: {
                directory: selectedPath,
                regex: regex
            }
        }))
    }

    const CancelTestsLoading = () => {
        socket.send(JSON.stringify({
            type: "loadTestsCANCEL",
            data: null
        }))
        setState(prevState => ({
            ...prevState,
            formError: {
                pathError: "", regexError: ""
            },
            isLoadButtonDisabled: false,
        }))
        //updateFormError({pathError: "", regexError: ""});
        //updateLoadButtonDisabledStatus(false);
    }

    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", (msg: any) => {
                const message = JSON.parse(msg.data)
                const type = message.type
                const data = message.data
                if (type === "loadTests") {
                    setState(prevState => ({
                        ...prevState,
                        formError: {
                            pathError: "", regexError: ""
                        },
                        isLoadButtonDisabled: false,
                        tests: data.tests,
                    }))
                    //updateFormError({pathError: "", regexError: ""})
                    //updateTestsLoadingStatus(`Successfully loaded ${data.tests.length} tests`);
                    //updateTests(data.tests);
                    //updateLoadButtonDisabledStatus(false);
                } else if (type === "loadTestsERROR") {
                    setState(prevState => ({
                        ...prevState,
                        isLoadButtonDisabled: false,
                    }))
                    //updateLoadButtonDisabledStatus(false);
                    if(data.error.code === 1000) {
                        setState(prevState => ({
                            ...prevState,
                            formError: { regexError: data.error.message, pathError: "" }
                        }))
                        //updateFormError({regexError: data.error.message, pathError: ""});
                    } else if (data.error.code === 2000) {
                        setState(prevState => ({
                            ...prevState,
                            formError: { pathError: data.error.message, regexError: "" }
                        }))
                        //updateFormError({pathError: data.error.message, regexError: ""});

                    }
                }
            })
        }
    }, [socket]);

    const updateSelectedPath = (val: string) => {
        setState(prevState => ({
            ...prevState,
            selectedPath: val,
        }))
    }

    const updateFolderManagerOpen = (val: boolean) => {
        setState(prevState => ({
            ...prevState,
            folderManagerOpen: val,
        }))
    }

    return (<div style={{padding: "20px"}}>
        <span style = {isLoadButtonDisabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
        <FileManager isFileManagerOpen = {state.folderManagerOpen} dialogClose = {() => {updateFolderManagerOpen(false)}} socket={socket} availableFilesTypes = {["."]} selectFiles = {updateSelectedPath} loadDirectoryOnStart= {selectedPath} />
           <TextField error = {formError.pathError ? true : false} helperText = {formError.pathError} value = {selectedPath} InputProps={{ style: { fontSize: "15px", width: "400px" }, endAdornment: <InputAdornment position="end">
               <IconButton onClick={() => { updateFolderManagerOpen(true) }}>
                    <FolderOpenIcon/>
                </IconButton>     
            </InputAdornment> }} label = {"Tests directory"} onChange={(e)=>{updateSelectedPath(e.target.value)}} />
            <br/>
            <TextField error = {formError.regexError ? true : false} helperText = {formError.regexError} value = {regex} inputProps={{ style: { fontSize: "15px", width: "400px" } }} label = "Regex condition for tests (leave empty for all)" onChange={HandleChangeRegex} />
            <br/><Button onClick = {LoadTests} style = {{fontWeight: "bold",fontSize: "16px", paddingLeft: "0px", paddingTop: "15px"}}>{isLoadButtonDisabled ? "Loading tests..." : "Load tests"} </Button>
        </span>
            {isLoadButtonDisabled ? ( <>
                <IconButton onClick = {CancelTestsLoading}><CancelIcon style = {{color: "red", width: "100%"}} /></IconButton>
                </> ) : null}
        <br/>   
        <FilesLoadingStatus tests = {tests} isLoadingTestsRunning = {isLoadButtonDisabled} socket = {socket}/>
    </div>)

}; 
