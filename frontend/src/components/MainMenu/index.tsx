import React                           from "react";
import { useState, useEffect, useRef } from "react";
import { Fade, IconButton, Button    } from "@material-ui/core"
import CloseIcon                       from "@material-ui/icons/Close"
import SaveIcon                        from '@material-ui/icons/Save';
import FolderOpenIcon                  from '@material-ui/icons/FolderOpen';
import AllInboxIcon                    from '@material-ui/icons/AllInbox';
import InfoIcon                        from '@material-ui/icons/Info';
import CreateIcon                      from '@material-ui/icons/Create';
import NoteIcon                        from '@material-ui/icons/Note';
import SaveAltIcon                     from '@material-ui/icons/SaveAlt';
import PrintIcon                       from '@material-ui/icons/Print';
import ImportExportIcon                from '@material-ui/icons/ImportExport';
import FolderIcon                      from '@material-ui/icons/Folder';
import { FileManager                 } from "../FileManager/fileManager";
import { TextField, FormLabel, InputAdornment } from "@material-ui/core";
interface Props {
   open: boolean,
   handleClose: Function,
   isAnyProjectOpen: boolean,
   socket: any
}

interface optionsButtonTypes {
    name: string,
    icon: JSX.Element,
    doesNeedOpenProject: boolean,
}

const Buttons: Array<optionsButtonTypes> = [{
    name: "Create Project",
    icon: <NoteIcon style = {{color: "#64b5f6"}}/>,
    doesNeedOpenProject: false,
},{
    name: "Open Project",
    icon: <FolderOpenIcon style = {{color: "#ffeb3b"}}/>,
    doesNeedOpenProject: false,
},{
    name: "Recent Projects",
    icon: <AllInboxIcon style = {{color: "blue"}}/>,
    doesNeedOpenProject: false,
},{
    name: "Save As",
    icon: <SaveAltIcon style = {{color: "blue"}}/>,
    doesNeedOpenProject: true,
},{
    name: "Save",
    icon: <SaveIcon style = {{color: "blue"}}/>,
    doesNeedOpenProject: true,
},{
    name: "Informations",
    icon: <InfoIcon style = {{color: "blue"}}/>,
    doesNeedOpenProject: true,
},{
    name: "Export",
    icon: <ImportExportIcon style = {{color: "blue"}}/>,
    doesNeedOpenProject: true,
},{
    name: "Print",
    icon: <PrintIcon style = {{color: "blue"}}/>,
    doesNeedOpenProject: true,
}]


interface OptionsInfoTypes {
    optionName: string,
    selectCreateProjectOption: Function
}

const OptionsInfo: React.FunctionComponent<OptionsInfoTypes> = ({optionName, selectCreateProjectOption}) => {
    switch(optionName){
        case "Create Project":
            return <>
                <Button onClick = {()=>{selectCreateProjectOption("onecpp")}}> New project from one .cpp file </Button>
                <Button onClick = {()=>{selectCreateProjectOption("empty")}}> New empty project </Button>
                <Button onClick = {()=>{selectCreateProjectOption("manycpp")}}> New project from many .cpp files </Button>
            </>
        case "Save As":
            return <>
                <form style = {{display: "flex", flexDirection: "column"}}>
                    <div style={{paddingBottom: "6px", fontSize: "24px",}}>Save as</div>
                    <TextField label = "Project name"     />    
                    <TextField 
                        label = "Project location" 
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                  <IconButton>
                                    <FolderIcon/>
                                  </IconButton>
                              </InputAdornment>
                            ),
                          }}
                    />    
                    <Button style = {{padding: "3px"}}>Confirm</Button>
                    <div style={{paddingTop: "6px", paddingBottom: "5px", fontSize: "18px", opacity: 0.7}}>Optional</div>
                    <TextField 
                        label = "Project description"
                        placeholder = "nlogn solve testing"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />   
                    <TextField label = "Project author"/>     

                </form>
            </>
        default:
            return <></>
    }
    return <></> 
}

export const MainMenu: React.FunctionComponent<Props> = ({open, handleClose, isAnyProjectOpen, socket}) => {

    const [optionInfo, setOptionInfo] = useState<string>(Buttons[0].name);
    const defaultFileManagerConfig = {
        isOpen: false,
        maxNumberOfFiles: 1,
        onSelectFiles: ()=>{}
    }
    const [fileManagerConfig, changeFileManagerConfig] = useState<{
        isOpen: boolean,
        maxNumberOfFiles: Number,
        onSelectFiles: Function,
    }>(defaultFileManagerConfig);

    const createProject = (files?: Array<string>) => {
        if(socket){
            socket.send(JSON.stringify({
                type: "createNewProject",
                data: {
                    name: "Pies",
                    path: '/cds',
                    description: 'My first solve',
                    author: 'Jozek Kowalski'
                }
            }))
        } else console.log("connection error")
    }

    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", (msg: any) => {
                const message = JSON.parse(msg.data)
                const type = message.type
                const data = message.data
                if (type === "createNewProjectResponse") {
                    console.log(data)
                }
            })
        }
    }, [socket]);

    const createProjectFromOneFile = () => {
        changeFileManagerConfig({
            maxNumberOfFiles: 1,
            onSelectFiles: createProject,
            isOpen: true,
        })
    }

    const createProjectFromManyFiles = () => {
        changeFileManagerConfig({
            maxNumberOfFiles: Infinity,
            onSelectFiles: createProject,
            isOpen: true,
        })
    }

    const selectCreateProjectOption = (option: string) => {
        switch(option) {
            case "onecpp": 
                createProjectFromOneFile();
                return;
            case "manycpp":
                createProjectFromManyFiles();
                return;
            case "empty":
                createProject();
                return;
            default:
                return;
        }
    }

    return (<>
        <Fade in = {open}>
            <div style = {{display: "flex", border: "solid 1px", left: "60px", position: "absolute", zIndex: 1201, top: "65px", minWidth: "800px", minHeight: "400px", backgroundColor: "white", flexDirection: "row"}}>
                <IconButton style = {{color: "red", right: "2px", top: "2px", position: "absolute", padding: "0px"}} onClick = { ()=>{handleClose()} }><CloseIcon/></IconButton>
                <div style = {{padding: "6px", display: "flex", minWidth: "200px", maxWidth: "200px", minHeight: "400px", height: "400px", flexDirection: "column"}}>
                    {Buttons.map((obj)=>{
                        return <Button disabled = {obj.doesNeedOpenProject && !isAnyProjectOpen} onClick = { () => {setOptionInfo(obj.name)} } style = {{margin: "3px", justifyContent: "left", height: "50px", width: "200px", border: "solid 2px", backgroundColor: obj.name === optionInfo ? "#b0bec5" : "transparent" }}>
                                    {obj.icon}
                                    <span style={{paddingLeft: "10px"}}>{obj.name}</span>
                                </Button>
                    })}
                </div>
                <Fade in = {optionInfo ? true : false} timeout = {2000}>
                    <div style ={{color: "black", padding: "20px"}}>
                        <OptionsInfo optionName = {optionInfo} selectCreateProjectOption = {selectCreateProjectOption} />
                    </div>
                </Fade>
            </div>
        </Fade>
        {fileManagerConfig.isOpen ? <FileManager socket = {socket} maxNumberOfSelectedFiles = {fileManagerConfig.maxNumberOfFiles} selectFiles = {fileManagerConfig.onSelectFiles} loadDirectoryOnStart = {'/'} isFileManagerOpen = {fileManagerConfig.isOpen} dialogClose = {()=>{changeFileManagerConfig(defaultFileManagerConfig)}} /> : null}
        </>)
}