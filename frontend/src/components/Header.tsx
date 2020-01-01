import React, { ReactElement, useState } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Breadcrumbs } from '@material-ui/core'
import { Apps, Settings, NavigateNext } from '@material-ui/icons'
import { styled, makeStyles } from '@material-ui/core/styles'
import MainMenu from './MainMenu'

const MarginTypography = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(2)
}))

const MarginBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    marginLeft: theme.spacing(2)
}))

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    }
}));

interface Props {
    
}

export default function Header({}: Props): ReactElement {
    const classes = useStyles()
    const [ menuOpen, setMenuOpen ] = useState(false);
    return (
        <>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <IconButton onClick={() => setMenuOpen(true)}>
                        <Apps />
                    </IconButton>
                    <MarginTypography color="textPrimary">
                        CDS
                    </MarginTypography>
                    <MarginTypography color="textPrimary">
                        My random project
                    </MarginTypography>

                    <MarginBreadcrumbs aria-label="breadcrumb">
                        <Typography color="textPrimary">Breadcrumb</Typography>
                        <Typography color="textPrimary">Breadcrumb</Typography>
                        <Typography color="textPrimary">Breadcrumb</Typography>
                    </MarginBreadcrumbs>

                    <div style={{ flexGrow: 1 }} />
                    <IconButton>
                        <Settings />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <MainMenu 
                open={menuOpen}
                handleClose={() => setMenuOpen(false)}
            />
        </>
    )
}
