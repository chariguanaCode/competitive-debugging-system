import React, { useState, ReactElement } from 'react';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Header, Content, Footer } from './layout';
import GlobalStyles from './GlobalStyles';
import Daemons from './Daemons';
import { lightTheme, darkTheme } from './Themes';
import { FileManagerContainer } from 'components';

export default function App({}): ReactElement {
    const [theme, setTheme] = useState(darkTheme);

    return (
        <ThemeProvider theme={theme}>
            <>
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'black',
                    }}
                >
                    <CssBaseline />
                    <GlobalStyles />
                    <FileManagerContainer />
                    <Daemons />
                    <Header />
                    <Content />
                    <Footer />
                </div>
            </>
        </ThemeProvider>
    );
}
