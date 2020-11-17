import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    MuiDialogPaper: {
        overflow: 'hidden'
    },
    FileManager: {
        WebkitUserSelect: 'none',
        height: '90vh',
        width: 'min(90vw, 1400px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 10px 10px 10px',
        overflow: 'hidden',
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'red',
        },
        '&::-webkit-scrollbar': {
            width: '0 !important',
            height: '0 !important',
        },
    },
    HeaderContainer: { minHeight: '50px', marginBottom: '10px' },
    ContentContainer: { minHeight: '10px', height: '100%', marginBottom: '10px' },
    FooterContainer: { minHeight: '50px' },

    /*dialogRoot: {
        backgroundColor: theme.palette.fileManager.backgroundColor,
        color: theme.palette.fileManager.fontColor,
    },
    scrollBarHide: {
        '&::-webkit-scrollbar': {
            width: '1px',
        },
    },*/
}));

export default useStyles;
