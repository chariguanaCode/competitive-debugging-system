import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    navigation: {
        display: 'flex',
        alignContent: 'center',
        textAlign: 'center',
        fontWeight: 500,
        justifyContent: 'center',
    },
    filesManager: {
        WebkitUserSelect: 'none',
        '& button:focus': {
            outline: 'none !import  ant',
            border: 'none',
        },
        '& button': {
            width: '100%',
            fontWeight: 200,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '10px 10px',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '13px',
            cursor: 'pointer',
        },
    },
    dialogPaper: {
        minHeight: '90vh',
        maxHeight: '90vh',
        minWidth: '75vw',
        maxWidth: '75vw',
        overflow: 'hidden',
        overflowX: 'hidden',
    },
    dialogRoot: {
        backgroundColor: theme.palette.fileManager.backgroundColor,
        color: theme.palette.fileManager.fontColor,
    },
    scrollBarHide: {
        '&::-webkit-scrollbar': {
            width: '1px',
        },
    },
}));

export default useStyles;