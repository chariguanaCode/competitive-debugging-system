import { createMuiTheme } from '@material-ui/core';
import {
    amber,
    yellow,
    orange,
    lightGreen,
    lightBlue,
    grey,
    green,
    teal,
    cyan,
    purple,
    blue,
    deepOrange,
    indigo,
    red,
} from '@material-ui/core/colors';
import { ExecutionState, TaskState } from 'reduxState/models';

export const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: amber,
        secondary: cyan,
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

            selected: grey[200],
            bracketArrow: grey[600],

            noCdsId: grey[600],
            noActions: orange[400],
            hasActions: lightBlue[400],

            dialogCode: grey[200],
            dialogCodeComment: grey[500],
            dialogTrackedObject: orange[400],
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
        Menu: {
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
            checkboxColor: 'red',
        },
        contentLayout: {
            panelHeader: grey[100],
            panelHeaderText: cyan[600],
            panelBackground: '#ffffff',
            borders: grey[200],
        },
        taskState: {
            [TaskState.Pending]: grey[800],
            [TaskState.Running]: lightBlue[400],
            [TaskState.Successful]: lightGreen[400],
            [TaskState.Timeout]: yellow[400],
            [TaskState.WrongAnswer]: red[400],
            [TaskState.Crashed]: purple[400],
            [TaskState.Killed]: grey[400],
            [TaskState.OK]: teal[400],
        },
        executionState: {
            [ExecutionState.NoProject]: grey[800],
            [ExecutionState.ProjectLoaded]: teal[400],
            [ExecutionState.Compiling]: grey[800],
            [ExecutionState.CompilationError]: red[400],
            [ExecutionState.Running]: lightBlue[400],
            [ExecutionState.Finished]: lightGreen[400],
        },
        scrollbar: {
            thumb: grey[200],
            thumbHover: grey[300],
        },
    },
});

export const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: amber,
        secondary: cyan,
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

            selected: grey[800],
            bracketArrow: grey[500],

            noCdsId: grey[700],
            noActions: orange[400],
            hasActions: lightBlue[400],

            dialogCode: grey[900],
            dialogCodeComment: grey[400],
            dialogTrackedObject: orange[400],
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
        Menu: {
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
            checkboxColor: 'red',
        },
        contentLayout: {
            panelHeader: grey[800],
            panelHeaderText: cyan['A400'],
            panelBackground: grey['A400'],
            borders: grey[800],
        },
        taskState: {
            [TaskState.Pending]: '#ffffff',
            [TaskState.Running]: lightBlue[400],
            [TaskState.Successful]: lightGreen[400],
            [TaskState.Timeout]: yellow[400],
            [TaskState.WrongAnswer]: red[400],
            [TaskState.Crashed]: purple[400],
            [TaskState.Killed]: grey[400],
            [TaskState.OK]: teal[400],
        },
        executionState: {
            [ExecutionState.NoProject]: '#ffffff',
            [ExecutionState.ProjectLoaded]: teal[400],
            [ExecutionState.Compiling]: '#ffffff',
            [ExecutionState.CompilationError]: red[400],
            [ExecutionState.Running]: lightBlue[400],
            [ExecutionState.Finished]: lightGreen[400],
        },
        scrollbar: {
            thumb: grey[800],
            thumbHover: grey[700],
        },
    },
});
