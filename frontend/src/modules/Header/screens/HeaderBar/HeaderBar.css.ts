import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: 10999,
        color: theme.palette.type === 'dark' ? 'white' : theme.palette.primary.contrastText,
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : '',
        transform: 'translate(0px, -42px)',
        animation: '$appbar-grow 0.5s ease-in-out forwards 3s',
    },
    logo: {
        '& path': {
            fill: theme.palette.type === 'dark' ? theme.palette.primary.main : theme.palette.primary.contrastText,
        },
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
