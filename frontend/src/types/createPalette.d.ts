import * as createPalette from '@material-ui/core/styles/createPalette'

declare module '@material-ui/core/styles/createPalette' {
    interface WatchBlockOptions {
        line?: string
        name?: string
        data_type?: string

        array?: string
        pair?: string
        struct?: string
        watchblock?: string

        string?: string
        bitset?: string
        number?: string
        pointer?: string
    }

    interface HeaderOptions {
        background: string
        iconColor: string
        windowButtons: string
        closeButton: string
    }

    interface FileManagerOptions {
        fontColor: string,
        backgroundColor: string,
        selectionColor: string,
    }
    interface MainMenuOptions {
        backgroundColor: string,
        iconColorEnabled: string,
        iconColorDisabled: string,
        fontColor: string,
        selectedButtonBackgroundColor: string,
    }
    interface PaletteOptions {
        watchblocks: WatchBlockOptions
        header: HeaderOptions
        mainMenu: MainMenuOptions
        fileManager: FileManagerOptions
    }

    interface Palette {
        watchblocks: WatchBlockOptions
        header: HeaderOptions
        mainMenu: MainMenuOptions,
        fileManager: FileManagerOptions
    }
}
