import React, {memo} from "react";
import { useState, useEffect } from "react"
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import { DialogTitle, Dialog } from "@material-ui/core";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {FoldersTable} from "./folderManager"
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
interface Props {
    socket: any,
}

interface LoadingStatusProps{
    socket: any,
    isLoadingTestsRunning: boolean,
    tests: Array<string>
}

interface FormError {
    regexError: string,
    pathError: string
}

const useStyles = makeStyles({
    folderManager: {
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
            fontWeight: "bold",
            backgroundColor: "white",
            border: "none",
            outline: "none",
            padding: "10px 10px",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "13px",
            cursor: "pointer",
        }
    },
});

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (prevProps.socket === nextProps.socket && prevProps.isLoadingTestsRunning === nextProps.isLoadingTestsRunning)
}

const TestsLoadingStatus: React.FunctionComponent<LoadingStatusProps> = memo(({ tests, socket, isLoadingTestsRunning }) => {
    const [testsLoadingStatus, updateTestsLoadingStatus] = useState<any>({
        filesScanned: "",
        filesLoaded: "",
    })
    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", (msg: any) => {
                const message = JSON.parse(msg.data)
                const type = message.type
                const data = message.data
                if (type === "loadTestsSTATUS") {
                    updateTestsLoadingStatus(data.status);
                }
            })
        }
    }, [socket]);
    return(<>
    <span style = {{marginRight: "20px"}}>{testsLoadingStatus.filesScanned}</span>
    <Fade
        in = {isLoadingTestsRunning}
        style={{
        position: "fixed",
        transitionDelay: '200ms',
        }}
        unmountOnExit
    >    
    <CircularProgress />
    </Fade>
    <br/>
    {testsLoadingStatus.filesLoaded} 
    <br/>
    {/*tests.slice(0,10000).map((val)=>(<p>{val}</p>))*/}
    </>)
},arePropsEqual)

export const TestManager: React.FunctionComponent<Props> = ({ socket }) => {

    const [regex, changeRegex] = useState('');
    const [selectedPath, updateSelectedPath] = useState("/")
    const [folderManagerOpen, updateFolderManagerOpen] = useState(false);
    const [tests, updateTests] = useState<Array<string>>([]);
    const [isLoadButtonDisabled, updateLoadButtonDisabledStatus] = useState<boolean>(false);
    const [formError, updateFormError] = useState<FormError>({
        regexError: "",
        pathError: "",
    });
    const HandleChangeRegex = (e: any) => {
        changeRegex(e.target.value);
    }

    const LoadTests = () => {
        updateLoadButtonDisabledStatus(true);
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
        updateFormError({pathError: "", regexError: ""});
        updateLoadButtonDisabledStatus(false);
    }

    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", (msg: any) => {
                const message = JSON.parse(msg.data)
                const type = message.type
                const data = message.data
                if (type === "loadTests") {
                    updateFormError({pathError: "", regexError: ""})
                    //updateTestsLoadingStatus(`Successfully loaded ${data.tests.length} tests`);
                    updateTests(data.tests);
                    updateLoadButtonDisabledStatus(false);
                } else if (type === "loadTestsERROR") {
                    updateLoadButtonDisabledStatus(false);
                    if(data.error.code === 1000) {
                        updateFormError({regexError: data.error.message, pathError: ""});
                    } else if (data.error.code === 2000) {
                        updateFormError({pathError: data.error.message, regexError: ""});

                    }
                }
            })
        }
    }, [socket]);

    return (<>
        <span style={{position: "absolute", left: "20px"}}>
        <span style = {isLoadButtonDisabled ? {pointerEvents: "none", opacity: "0.4"} : {}}>
            <Dialog fullWidth={true} maxWidth="lg" className={useStyles().folderManager} open={folderManagerOpen} >
                <IconButton style = {{position: "absolute", color: "red", right: "10px", top: "10px", width: "5%"}} onClick = {()=>{updateFolderManagerOpen(false)}}><CloseIcon/></IconButton>
                <DialogTitle style={{ textAlign: "center" }}>Select directory</DialogTitle>
                <FoldersTable dialogClose = {() => {updateFolderManagerOpen(false)}} socket={socket} selectPath={updateSelectedPath} loadDirectoryOnStart={selectedPath} />
            </Dialog>
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
        <IconButton onClick = {CancelTestsLoading}><CancelIcon style = {{color: "red"}} /></IconButton>
        </> ) : null}
        <br/>
        <TestsLoadingStatus tests = {tests} isLoadingTestsRunning = {isLoadButtonDisabled} socket = {socket}/>
        </span>
    </>)

};
