import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    titleBar: {
        zIndex: theme.zIndex.drawer + 1000,
        position: 'relative',
        padding: '0px 12px',
        backgroundColor: theme.palette.header.background,
        display: 'flex',
    },
    button: {
        display: 'inline-block',
        width: 16,
        height: 16,
        margin: '8px 4px',
        marginBottom: 0,
        padding: 2,
        border: 0,
        textAlign: 'center',
        fontSize: 12,
        borderRadius: '50%',
        backgroundColor: theme.palette.header.windowButtons,
        color: 'transparent',
        '&:hover': {
            color: theme.palette.getContrastText(theme.palette.header.windowButtons as string),
            transition: theme.transitions.create(['color'], {}),
        },
        '&:focus': {
            outline: 'none',
        },
    },
    titleBarMiddle: {
        flexGrow: 1,
        WebkitAppRegion: 'drag',
    },
}));

export default useStyles;
