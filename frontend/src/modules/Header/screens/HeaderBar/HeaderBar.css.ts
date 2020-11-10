import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 2,
        color: theme.palette.type === 'dark' ? 'white' : theme.palette.primary.contrastText,
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : '',
    },
    logo: {
        marginLeft: theme.spacing(2),
        padding: '0px 8px',
        '& path': {
            fill: theme.palette.type === 'dark' ? theme.palette.primary.main : theme.palette.primary.contrastText,
        },
    },
    margin: {
        marginLeft: theme.spacing(2),
    },
    '@keyframes appbar-grow': {
        '0%': {
            transform: 'translate(0px, -42px)',
        },
        '100%': {
            transform: 'translate(0px, 0px)',
        },
    },
}));

export default useStyles;
