import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    titleBar: {
        zIndex: 11000,
        position: 'relative',
        height: 32,
        paddingBottom: '8px',
        backgroundColor: theme.palette.header.background,
        display: 'flex',
    },
    button: {
        display: 'inline-block',
        width: 16,
        height: 16,
        marginTop: 8,
        marginRight: 8,
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
