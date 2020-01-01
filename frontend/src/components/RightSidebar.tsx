import React, { ReactElement, useState } from 'react'
import { Drawer, makeStyles, Paper } from '@material-ui/core'
import { NavigateNext, NavigateBefore } from '@material-ui/icons'
import clsx from 'clsx'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        width: drawerWidth + 24,
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: 24,
    },
    paperOpen: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        width: drawerWidth,
    },
    paperClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: 0,
    },
    wrapper: {
        "& button::-moz-focus-inner": {
            border: 0
        },
        "& button:focus": {
            outline: "0 !important",
        },
        "& button": {
            height: "100%", 
            width: 24, 
            padding: 0, 
            border: 0, 
        },
        marginTop: 64, 
        height: "calc(100% - 64px)", 
        display: "flex",
    }
}));

interface Props {
    children: ReactElement | ReactElement[]
}

export default function LeftSidebar({ children }: Props): ReactElement {
    const classes = useStyles();
    const [ open, setOpen ] = useState(false);
    return (
        <>
            <Drawer
                variant="permanent"
                anchor="right"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
            >
                <div className={classes.wrapper} style={{ }}>
                    <button 
                        onClick={() => setOpen(!open)}
                    >
                        {(open) ? <NavigateNext /> : <NavigateBefore /> }
                    </button>
                    <div
                        className={clsx({
                            [classes.paperOpen]: open,
                            [classes.paperClose]: !open,
                        })}
                    >
                        {children}
                    </div>
                </div>
            </Drawer>
        </>
    )
}
