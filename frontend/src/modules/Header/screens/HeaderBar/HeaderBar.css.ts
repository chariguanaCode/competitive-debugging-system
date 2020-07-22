import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 2,
        color: theme.palette.type === 'dark' ? 'white' : theme.palette.primary.contrastText,
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : '',
    },
    logo: {
        '& path': {
            fill: theme.palette.type === 'dark' ? theme.palette.primary.main : theme.palette.primary.contrastText,
        },
    },
}));



export default useStyles;
