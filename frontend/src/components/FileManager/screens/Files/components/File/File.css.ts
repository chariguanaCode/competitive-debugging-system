import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    FileIcon: {
        width: (props: any) => props.FileIconWidth,
        height: (props: any) => props.FileIconWidth,
    },
    FileButton: {
        backgroundColor: 'transparent',
        color: theme.palette.fileManager.fontColor,
        fontWeight: 200,
        margin: '2px',
        height: '100%',
        width: '100%',
        fontSize: '13px', //(props: any) => props.fileTextSize, //13px
        maxWidth: (props: any) => props.fileButtonWidth, //"120px",
        border: 'none',
        outline: 'none',
        padding: '10px 10px',
        textDecoration: 'none',
        display: 'inline-block',
        cursor: 'pointer',
        '&:focus': {
            outline: 'none !import  ant',
            border: 'none',
        },
    },
    selectedFileButton: {
        backgroundColor: theme.palette.fileManager.selectionColor + '!important',
    },
    FileButtonContent: {
        display: 'flex',
        // flexDirection: (props: any) => props.fileView.flexDirection, //"column",
        // justifyContent: (props: any) => props.fileView.alignContent, //"center",
        alignContent: 'center',
        alignItems: 'center',
    },
    FileIconContainer: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        marginRight: '4px'
    },
    filenameContainer: {
        //fontSize: displaySettingsStyle.fileTextSize, TODO: dynamic font size
        wordBreak: 'break-all',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
    },
    // TODO:
    iconButtonButton: {
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
    iconButtonIcon: {
        fontSize: 20,
    },
}));

export default useStyles;
