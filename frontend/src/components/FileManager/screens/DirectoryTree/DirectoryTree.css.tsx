import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    DirectoryTree: {
        color: theme.palette.fileManager.fontColor,
        alignContent: 'left',
        alignItems: 'left',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
    },
    ArrowIcon: {
        color: theme.palette.fileManager.fontColor,
    },
    ExpandButton: {
        padding: '0px',
        margin: '0px',
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
        backgroundColor: 'transparent',
    },
    JoinDirectoryButton: {
        padding: '0px',
        margin: '0px',
        textAlign: 'left',
        paddingBottom: '3px',
        outline: 'none',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    directoryNameContainer: { color: theme.palette.fileManager.fontColor },
    currentDirectoryNameContainer: {
        backgroundColor: theme.palette.fileManager.selectionColor,
        padding: '4px',
    },
}));

export default useStyles;
