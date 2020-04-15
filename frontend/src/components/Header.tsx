import React, { ReactElement, useState, useContext, useMemo } from 'react'
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Breadcrumbs,
} from '@material-ui/core'
import { Apps, Settings, PlayArrow, Refresh } from '@material-ui/icons'
import { styled, makeStyles } from '@material-ui/core/styles'
import { MainMenu } from './MainMenu/index'
import { ReactComponent as Logo } from '../assets/cds_logo.svg'

import GlobalStateContext from '../utils/GlobalStateContext'
import { useRunTasks } from '../backend/main'
import { useLoadProject } from '../backend/projectManagement'

const MarginTypography = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(2),
}))

const MarginBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    marginLeft: theme.spacing(2),
}))

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 2,
        color:
            theme.palette.type === 'dark'
                ? 'white'
                : theme.palette.primary.contrastText,
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.background.paper : '',
    },
    logo: {
        '& path': {
            fill:
                theme.palette.type === 'dark'
                    ? theme.palette.primary.main
                    : theme.palette.primary.contrastText,
        },
    },
}))

export default function Header(): ReactElement {
    const classes = useStyles()
    const [menuOpen, setMenuOpen] = useState(false)
    const { config } = useContext(GlobalStateContext)
    const runTasks = useRunTasks()
    const LoadProject = useLoadProject();
    //const reloadProject = useReloadProject()
    console.log(config)

    return useMemo(
        () => (
            <>
                <AppBar position="relative" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            onClick={() => setMenuOpen(previousState => !previousState)}
                            color="inherit"
                        >
                            <Apps color="inherit" />
                        </IconButton>
                        <MarginTypography color="inherit"></MarginTypography>
                        <Logo className={classes.logo} width={50} height={50} />
                        <MarginTypography color="inherit">
                            My random project
                        </MarginTypography>

                        <MarginBreadcrumbs color="inherit">
                            {/*config.projectInfo.files[0].split('/').map((val) => (
                                <Typography key={val} color="inherit">
                                    {val}
                                </Typography>
                            ))*/}
                        </MarginBreadcrumbs>

                        <div style={{ flexGrow: 1 }} />

                        <IconButton color="inherit" onClick={runTasks}>
                            <PlayArrow color="inherit" />
                        </IconButton>
                        <IconButton color="inherit" onClick = {() => {LoadProject("D://test.cdsp")}} /*onClick={/*reloadProject}*/>
                            <Refresh color="inherit" />
                        </IconButton>
                        <IconButton color="inherit">
                            <Settings color="inherit" />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <MainMenu
                    open={menuOpen}
                    isAnyProjectOpen={true}
                    handleClose={() => setMenuOpen(false)}
                />
            </>
        ),
        [config, classes, menuOpen, runTasks]
    )
}
