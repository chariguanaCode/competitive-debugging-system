import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    FileIcon: {
        width: (props: any) => props.FileIconWidth,
        height: (props: any) => props.FileIconWidth,
    },
    FileButton: {
        backgroundColor: (props: any) =>
            props.isSelected ? theme.palette.fileManager.selectionColor : 'transparent',
        color: theme.palette.fileManager.fontColor,
        fontWeight: 200,
        margin: '2px',
        height: '100%',
        width: '100%',
        maxWidth: (props: any) => props.fileButtonWidth, //"120px",
        border: 'none',
        outline: 'none',
        textDecoration: 'none',
        display: 'inline-block',
        cursor: 'pointer',
        '&:focus': {
            outline: 'none !import  ant',
            border: 'none',
        },
    },
    fileButtonContent: {
        display: 'flex',
        // flexDirection: (props: any) => props.fileView.flexDirection, //"column",
        // justifyContent: (props: any) => props.fileView.alignContent, //"center",
        alignContent: 'center',
        alignItems: 'center',
    },
    fileIconContainer: (props: any) => ({
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        marginRight: '4px',
        width: props.fileIconWidth,
        height: props.fileIconHeight,
    }),
    filenameContainer: (props: any) => ({
        fontSize: props.fontSize, //(props) => `calc(13px * ${props.zoomFactor ? props.zoomFactor : 1})`, //displaySettingsStyle.fileTextSize, TODO: dynamic font size
        wordBreak: 'break-all',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
    }),
    fileButtonContainer: {
        display: 'inline',
        position: 'relative',
        padding: '2px',
    },
    // TODO:
    deleteFileFromSelectedFilesButton: {
        width: '14px !important',
        height: '14px !important',
        color: 'red',
        backgroundColor: 'green !important' /*"#0099e6"*/,
        position: 'absolute',
        zIndex: 999,
        right: 4,
        top: 2,
    },
    // TODO:
    deleteFileFromSelectedFilesIcon: {
        fontSize: 20,
    },
}));

export default useStyles;
