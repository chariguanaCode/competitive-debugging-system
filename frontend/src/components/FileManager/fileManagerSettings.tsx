import React, { memo }                from "react";
import { useState, useEffect, useRef} from "react";

import { TextField, InputAdornment    } from '@material-ui/core';
import { makeStyles                   } from '@material-ui/core/styles';
import { Button, IconButton           } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText        } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { Select, MenuItem, InputLabel } from '@material-ui/core';
import { FormControl                  } from '@material-ui/core';  

import CloseIcon                from '@material-ui/icons/Close';
import PermDataSettingIcon      from '@material-ui/icons/PermDataSetting';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import HelpIcon                 from '@material-ui/icons/Help';

import { isNumeric } from '../../utils/tools';
interface FileManagerSettingsTypes {
    open: boolean,
    dialogClose: Function,
    loadedSettings?: any
}

interface SettingsTypes {
    homeDirectory: string,
    renderFilesBlockSize: number
}


const useStyles = makeStyles({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
        minWidth: '80vh',
        maxWidth: '80vh'
    },
})

const settingsInfo = new Map([
    ["homeDirectory", "Set the home directory, for example C:/ or dev/ ."],
    ["renderFilesBlockSize", "Defines how many files are rerendered. If the value is small, file mananger could be laggy because of many child components. If the value is big, file manager could be laggy because of many rerenders at one time."]
])


export const FileManagerSettings: React.FunctionComponent<FileManagerSettingsTypes> = ({open, dialogClose, loadedSettings}) => {
    const classes = useStyles()
    const [ selectedSettings, changeSelectedSettings ] = useState<string>("Basic settings")
    const [ settings, updateSettings ] = useState<SettingsTypes>({
        homeDirectory: "/",

        renderFilesBlockSize: 50,
    })

    const [ infoPopOver, setInfoPopOver ] = useState({
        text: "",
        AnchorEl: null,
    })

    const ShowInfoPopOver = (about: string, e: any) => {
        e.persist();
        let AnchorEl = e.currentTarget;
        let infoText = settingsInfo.get(about);
        if(!infoText) infoText = "";
        setInfoPopOver({
            AnchorEl: AnchorEl,
            text: infoText, 
        })
    }

    const CloseInfoPopOver = () => {
        setInfoPopOver({
            text: "",
            AnchorEl: null,
        });
    }

    const renderSettings = () => {
        switch(selectedSettings){
            case "Basic settings":
                return <>
                    <TextField InputProps = {{endAdornment:
                        <InputAdornment position="end">
                            <IconButton onClick = {(e) => ShowInfoPopOver("homeDirectory", e)}>
                                <HelpIcon style = {{color: "#1976d2"}}/>
                            </IconButton>
                        </InputAdornment>}}
                    label = "Home directory" value = {settings.homeDirectory} onChange = {(e) => {e.persist();updateSettings(prevState => ({...prevState, homeDirectory: e.target.value}))}}></TextField>
                </>
            case "Developer settings":
                return <>
                    <Typography style = {{color: "red", fontWeight: "bold"}}>Warning: changing this settings may cause app problems. If you don't know what it does, leave it alone</Typography>
                    <TextField
                        InputProps = {{endAdornment:
                            <InputAdornment position="end">
                                <IconButton onClick = {(e) => ShowInfoPopOver("renderFilesBlockSize", e)}>
                                    <HelpIcon style = {{color: "#1976d2"}}/>
                                </IconButton>
                            </InputAdornment>}}
                    label = "Files render block size" value = {settings.renderFilesBlockSize} onChange = {(e) => {e.persist(); if(isNumeric(e.target.value))updateSettings(prevState => ({...prevState, renderFilesBlockSize: Number(e.target.value)}))}}></TextField>
                </>
        }
    }

    return <>
        <Dialog open = {open} maxWidth = {"sm"} fullWidth classes = {{ paper: classes.dialogPaper }}>
            <IconButton style = {{position: "absolute", color: "red", right: "10px", top: "10px", width: "20px", height: "20px", display: "flex"}} onClick = {()=>{dialogClose()}}><CloseIcon/></IconButton>                
            <DialogTitle style = {{textAlign: "center"}}>{selectedSettings}</DialogTitle>
            <DialogContent style = {{display: "flex"}}>
                <List style = {{paddingRight: "10px"}}>
                    <ListItem button onClick = {() => {changeSelectedSettings("Basic settings")}}>
                        <ListItemIcon><SettingsApplicationsIcon/></ListItemIcon>
                        <ListItemText>Basic settings</ListItemText>
                    </ListItem>
                    <ListItem button onClick = {() => {changeSelectedSettings("Developer settings")}}>
                        <ListItemIcon><PermDataSettingIcon/></ListItemIcon>
                        <ListItemText>Developer settings</ListItemText>
                    </ListItem>
                </List>
                <div style = {{display: "flex", flexDirection: "column"}}>{renderSettings()}</div>
                <Popover
                    open={infoPopOver.AnchorEl ? true : false}
                    anchorEl={infoPopOver.AnchorEl}
                    onClose={CloseInfoPopOver}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography style = {{padding: 2}}>{infoPopOver.text}</Typography>
                </Popover>
            </DialogContent>
        </Dialog>
    </>
}