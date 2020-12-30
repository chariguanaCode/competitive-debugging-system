import * as createPalette from '@material-ui/core/styles/createPalette';
import { ExecutionState, TaskState } from 'reduxState/models';

declare module '@material-ui/core/styles/createPalette' {
    interface WatchBlockOptions {
        line: string;
        name: string;
        data_type: string;

        array: string;
        pair: string;
        struct: string;
        watchblock: string;

        string: string;
        bitset: string;
        number: string;
        pointer: string;

        selected: string;
        bracketArrow: string;

        noCdsId: string;
        noActions: string;
        hasActions: string;

        dialogCode: string;
        dialogTrackedObject: string;
    }

    interface HeaderOptions {
        background: string;
        iconColor: string;
        windowButtons: string;
        closeButton: string;
    }

    interface FileManagerOptions {
        fontColor: string;
        backgroundColor: string;
        selectionColor: string;
        checkboxColor: string;
    }
    interface MainMenuOptions {
        backgroundColor: string;
        iconColorEnabled: string;
        iconColorDisabled: string;
        fontColor: string;
        selectedButtonBackgroundColor: string;
    }

    interface MenuOptions {
        backgroundColor: string;
        iconColorEnabled: string;
        iconColorDisabled: string;
        fontColor: string;
        selectedButtonBackgroundColor: string;
    }

    interface ContentLayoutOptions {
        panelHeader: string;
        panelBackground: string;
        borders: string;
        panelHeaderText: string;
    }

    type TaskStateOptions = {
        [key in TaskState]: string;
    };

    type ExecutionStateOptions = {
        [key in ExecutionState]: string;
    };

    interface ScrollbarOptions {
        thumb: string;
        thumbHover: string;
    }

    interface PaletteOptions {
        watchblocks: WatchBlockOptions;
        header: HeaderOptions;
        mainMenu: MainMenuOptions;
        Menu: MenuOptions;
        fileManager: FileManagerOptions;
        contentLayout: ContentLayoutOptions;
        taskState: TaskStateOptions;
        executionState: ExecutionStateOptions;
        scrollbar: ScrollbarOptions;
    }

    interface Palette {
        watchblocks: WatchBlockOptions;
        header: HeaderOptions;
        mainMenu: MainMenuOptions;
        Menu: MenuOptions;
        fileManager: FileManagerOptions;
        contentLayout: ContentLayoutOptions;
        taskState: TaskStateOptions;
        executionState: ExecutionStateOptions;
        scrollbar: ScrollbarOptions;
    }
}
