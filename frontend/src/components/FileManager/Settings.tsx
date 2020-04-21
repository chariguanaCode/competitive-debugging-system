import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Popover,
    TextField,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/Help';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { isNumeric } from '../../utils/tools';
import { SettingsProps, SettingsState } from './Types';

const useStyles = makeStyles({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
        minWidth: '80vh',
        maxWidth: '80vh',
    },
});

const settingsInfo = new Map([
    ['homeDirectory', 'Set the home directory, for example C:/ or dev/ .'],
    [
        'renderFilesBlockSize',
        'Defines how many files are rerendered. If the value is small, file mananger could be laggy because of many child components. If the value is big, file manager could be laggy because of many rerenders at one time.',
    ],
]);

export const Settings: React.FunctionComponent<SettingsProps> = ({ open, dialogClose, loadedSettings }) => {
    const classes = useStyles();
    const [selectedSettings, changeSelectedSettings] = useState<string>('Basic settings');
    const [settings, updateSettings] = useState<SettingsState>({
        homeDirectory: '/',
        renderFilesBlockSize: 50,
    });
    const [infoPopOver, setInfoPopOver] = useState({
        text: '',
        AnchorEl: null,
    });

    const showInfoPopOver = (about: string, e: any) => {
        e.persist();
        let AnchorEl = e.currentTarget;
        let infoText = settingsInfo.get(about);
        if (!infoText) infoText = '';
        setInfoPopOver({
            AnchorEl: AnchorEl,
            text: infoText,
        });
    };

    const closeInfoPopOver = () => {
        setInfoPopOver({
            text: '',
            AnchorEl: null,
        });
    };

    const renderSettings = () => {
        switch (selectedSettings) {
            case 'Basic settings':
                return (
                    <>
                        <TextField
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={(e) => showInfoPopOver('homeDirectory', e)}>
                                            <HelpIcon style={{ color: '#1976d2' }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            label="Home directory"
                            value={settings.homeDirectory}
                            onChange={(e) => {
                                e.persist();
                                updateSettings((prevState) => ({ ...prevState, homeDirectory: e.target.value }));
                            }}
                        ></TextField>
                    </>
                );
            case 'Developer settings':
                return (
                    <>
                        <Typography style={{ color: 'red', fontWeight: 'bold' }}>
                            Warning: changing this settings may cause app problems. If you don't know what it does, leave it
                            alone
                        </Typography>
                        <TextField
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={(e) => showInfoPopOver('renderFilesBlockSize', e)}>
                                            <HelpIcon style={{ color: '#1976d2' }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            label="Files render block size"
                            value={settings.renderFilesBlockSize}
                            onChange={(e) => {
                                e.persist();
                                if (isNumeric(e.target.value))
                                    updateSettings((prevState) => ({
                                        ...prevState,
                                        renderFilesBlockSize: Number(e.target.value),
                                    }));
                            }}
                        ></TextField>
                    </>
                );
        }
    };

    return (
        <>
            <Dialog open={open} maxWidth={'sm'} fullWidth classes={{ paper: classes.dialogPaper }}>
                <IconButton
                    style={{
                        position: 'absolute',
                        color: 'red',
                        right: '10px',
                        top: '10px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                    }}
                    onClick={() => {
                        dialogClose();
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogTitle style={{ textAlign: 'center' }}>{selectedSettings}</DialogTitle>
                <DialogContent style={{ display: 'flex' }}>
                    <List style={{ paddingRight: '10px' }}>
                        <ListItem
                            button
                            onClick={() => {
                                changeSelectedSettings('Basic settings');
                            }}
                        >
                            <ListItemIcon>
                                <SettingsApplicationsIcon />
                            </ListItemIcon>
                            <ListItemText>Basic settings</ListItemText>
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => {
                                changeSelectedSettings('Developer settings');
                            }}
                        >
                            <ListItemIcon>
                                <PermDataSettingIcon />
                            </ListItemIcon>
                            <ListItemText>Developer settings</ListItemText>
                        </ListItem>
                    </List>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>{renderSettings()}</div>
                    <Popover
                        open={infoPopOver.AnchorEl ? true : false}
                        anchorEl={infoPopOver.AnchorEl}
                        onClose={closeInfoPopOver}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Typography style={{ padding: 2 }}>{infoPopOver.text}</Typography>
                    </Popover>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Settings;
