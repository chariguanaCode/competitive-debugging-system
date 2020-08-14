import React, { useState, ReactElement,useEffect } from 'react';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Header, Content, Footer } from './layout';
import GlobalStyles from './GlobalStyles';
import Daemons from './Daemons';
import AddTrackedObjectDialog from 'modules/AddTrackedObjectDialog';
import { lightTheme, darkTheme } from './Themes';
import { FileManagerContainer } from 'components/FileManager';
import { useFileManager } from 'reduxState/selectors';
import { useFileManagerActions } from 'reduxState/actions';

import 'typeface-roboto';
//import 'typeface-roboto-mono';
import { useLoadProject } from 'backend/projectManagement';

export default function App(): ReactElement {
    const [theme, setTheme] = useState(darkTheme);
    //const [theme, setTheme] = useState(lightTheme);
    const loadProject = useLoadProject();
    // TODO: autoload previous project on start
    /*useEffect(() => {
        loadProject('F:/project.cdsp');
    }, []);*/
    return (
        <ThemeProvider theme={theme}>
            <>
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                    }}
                >
                    
                    <CssBaseline />
                    <GlobalStyles />
                    <Daemons />

                    <FileManagerContainer useFileManager={useFileManager} useFileManagerActions={useFileManagerActions} />
                    <AddTrackedObjectDialog />

                    <Header />
                    <Content />
                    <Footer />
                </div>
            </>
        </ThemeProvider>
    );
}
