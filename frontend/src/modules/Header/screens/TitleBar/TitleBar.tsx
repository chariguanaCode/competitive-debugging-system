import React, { ReactElement } from 'react';
import { Minimize, Close, Fullscreen } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import { useStyles } from './TitleBar.css';
const { remote } = window.require('electron');

export default function TitleBar(): ReactElement {
    const classes = useStyles();
    const theme = useTheme();
    const browserWindow = remote.BrowserWindow;
    return (
        <div className={classes.titleBar}>
            <div className={classes.titleBarMiddle} />
            <button className={classes.button} onClick={() => browserWindow.getFocusedWindow().minimize()}>
                <Minimize fontSize="inherit" />
            </button>
            <button
                className={classes.button}
                onClick={() =>
                    browserWindow.getFocusedWindow().isMaximized()
                        ? browserWindow.getFocusedWindow().unmaximize()
                        : browserWindow.getFocusedWindow().maximize()
                }
            >
                <Fullscreen fontSize="inherit" />
            </button>
            
            <button
                className={classes.button}
                style={{
                    backgroundColor: theme.palette.header.closeButton,
                }}
                onClick={() => browserWindow.getFocusedWindow().close()}
            >
                <Close fontSize="inherit" />
            </button>
        </div>
    );
}
