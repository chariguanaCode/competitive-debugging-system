import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    FileManager: {
        WebkitUserSelect: 'none',
        height: '900px',
        width: '1400px',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 10px 10px 10px',
        overflow: 'auto',
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
