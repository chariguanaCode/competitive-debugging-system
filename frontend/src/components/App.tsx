import React, { useState } from 'react';
import {
    CssBaseline,
    createMuiTheme,
    Switch,
    FormControlLabel,
} from '@material-ui/core';
import Header from './Header';
import Content from './Content';
import Sidebar from './Sidebar';
import {
    amber,
    yellow,
    orange,
    lightGreen,
    grey,
    green,
    teal,
    cyan,
    purple,
    blue,
    deepOrange,
    indigo,
} from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/core/styles';
import TestProgress from './TestProgress';
import { connect } from 'react-redux';
import { changeLanguage } from '../redux/actions';
import TitleBar from './TitleBar';

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: amber,
        watchblocks: {
            //do ogarniecia bo srednio wyglada
            line: orange[500],
            name: blue[600],
            data_type: grey[600],

            array: cyan[600],
            pair: purple[500],
            struct: teal[700],
            watchblock: teal[700],

            string: green[500],
            bitset: deepOrange[500],
            number: indigo[500],
            pointer: '#FF80FF',
        },
        header: {
            background: amber[500],
            iconColor: 'black',
            windowButtons: amber[200],
            closeButton: grey[600],
        },
        mainMenu: {
            backgroundColor: 'white',
            iconColorEnabled: grey[900],
            iconColorDisabled: '',
            fontColor: 'black',
            selectedButtonBackgroundColor: '#b0bec5',
        },
        fileManager: {
            fontColor: 'black',
            backgroundColor: 'white',
            selectionColor: cyan[300] + '44',
        },
    },
});

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: amber,
        watchblocks: {
            line: yellow[600],
            name: lightGreen['A400'],
            data_type: grey[500],

            array: cyan[600],
            pair: purple['A100'],
            struct: teal[700],
            watchblock: teal[500],

            string: green[700],
            bitset: teal['A400'],
            number: cyan['A400'],
            pointer: '#FF80FF',
        },
        header: {
            background: grey[800],
            iconColor: amber[500],
            windowButtons: grey[600],
            closeButton: amber[500],
        },
        mainMenu: {
            backgroundColor: grey[800],
            iconColorEnabled: amber[500],
            iconColorDisabled: '',
            fontColor: 'white',
            selectedButtonBackgroundColor: '#8ea3ad',
        },
        fileManager: {
            fontColor: 'white',
            backgroundColor: grey[800],
            selectionColor: cyan[300] + '44',
        },
    },
});

const mapStateToProps = (state: any) => {
    return { language: state.language };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        changeLanguge: (language: string) => dispatch(changeLanguage(language)),
    };
};

interface sr {
    language?: string;
    changeLanguage?: Function;
}

const App: React.FC<sr> = ({ language, changeLanguage }) => {
    //const [ filePath, setFilePath ] = useState("/home/charodziej/Documents/OIG/OI27/nww.cpp")
    const [theme, setTheme] = useState(darkTheme);

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
                    <TitleBar />

                    <Header />
                    <Sidebar variant="left">
                        <TestProgress />
                    </Sidebar>
                    {/*
                //@ts-ignore    }
            <button onClick = {()=>{changeLanguage("pl")}}>LOL</button>
            {/*<Content />*/}
                    <Content />

                    <Sidebar variant="right">
                        <div style={{ margin: 8 }}>
                            <FormControlLabel
                                label="Dark mode"
                                control={
                                    <Switch
                                        checked={theme.palette.type === 'dark'}
                                        onChange={(evt) =>
                                            setTheme(
                                                evt.target.checked
                                                    ? darkTheme
                                                    : lightTheme
                                            )
                                        }
                                    />
                                }
                            />
                            {[...Array(100)].map((val, index) => (
                                <p key={index}>Testing</p>
                            ))}
                        </div>
                    </Sidebar>
                </div>
            </>
        </ThemeProvider>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
