import React, { ReactElement } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Minimize, Close, Fullscreen } from '@material-ui/icons';

const { remote } = window.require('electron');

const useStyles = makeStyles((theme) => ({
    titleBar: {
        zIndex: 11000,
        position: 'relative',
        width: '100hv',
        height: 24,
        padding: '0px 8px',
        backgroundColor: theme.palette.header.background,
        display: 'flex',
    },
    button: {
        display: 'inline-block',
        width: 16,
        height: 16,
        marginTop: 8,
        marginRight: 8,
        padding: 2,
        border: 0,
        textAlign: 'center',
        fontSize: 12,
        borderRadius: '50%',
        backgroundColor: theme.palette.header.windowButtons,
        color: 'transparent',
        '&:hover': {
            color: theme.palette.getContrastText(theme.palette.header.windowButtons as string),
            transition: theme.transitions.create(['color'], {}),
        },
        '&:focus': {
            outline: 'none',
        },
    },
    titleBarMiddle: {
        flexGrow: 1,
        WebkitAppRegion: 'drag',
    },
}));

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
