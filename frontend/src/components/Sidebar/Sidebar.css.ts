import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        width: drawerWidth + 24,
    },
    drawerClose: (props: any) => ({
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden' as 'hidden',
        width: (props.variant === 'left' ? theme.spacing(6) : 0) + 24,
    }),
    paperOpen: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        width: drawerWidth,
    },
    paperClose: (props: any) => ({
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden' as 'hidden',
        width: props.variant === 'left' ? theme.spacing(6) : 0,
    }),
    wrapper: {
        '& button::-moz-focus-inner': {
            border: 0,
        },
        '& button:focus': {
            outline: '0 !important',
        },
        '& button:hover': {
            backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
        },
        '& button': {
            height: '100%',
            width: 24,
            padding: 0,
            border: 0,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.type === 'dark' ? 'white' : 'black',
        },
        marginTop: 64 + 24,
        height: 'calc(100% - 64px)',
        display: 'flex',
    },
    scrollBar: {
        backgroundColor: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        borderRadius: 3,
    },
}));

export default useStyles;
