import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    fileIcon: {
        width: (props: any) => props.fileIconWidth,
        height: (props: any) => props.fileIconWidth,
    },
    fileButtonSelected: {
        backgroundColor: theme.palette.fileManager.selectionColor + '!important',
        color: theme.palette.fileManager.fontColor,
        fontWeight: 100,
        fontSize: '13px', //(props: any) => props.fileTextSize, //13px
        maxWidth: (props: any) => props.fileButtonWidth, //"120px",,
        margin: '2px',
    },
    fileView: {
        display: 'flex',
        flexDirection: (props: any) => props.fileView.flexDirection, //"column",
        justifyContent: (props: any) => props.fileView.alignContent, //"center",
        alignContent: 'center',
        alignItems: 'center',
    },
    fileButton: {
        backgroundColor: '',
        color: theme.palette.fileManager.fontColor,
        fontWeight: 100,
        margin: '2px',
        //fontWeight: "bold",
        fontSize: '13px', //(props: any) => props.fileTextSize, //13px
        maxWidth: (props: any) => props.fileButtonWidth, //"120px",
    },
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
    iconButtonIcon: {
        fontSize: 20,
    },
}));

export default useStyles; 
