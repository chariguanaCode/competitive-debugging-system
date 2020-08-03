import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        height: 24,
        width: '100%',

        position: 'absolute',
        zIndex: theme.zIndex.drawer + 2,

        color: theme.palette.getContrastText(theme.palette.secondary.main),
        backgroundColor: theme.palette.secondary.main,

        padding: '0px 4px',
        display: 'flex',
        flexDirection: 'row',
    },
    element: {
        margin: '2px 4px',
    },
    separator: {
        width: 1,
        margin: '2px 0px',
        backgroundColor: theme.palette.secondary.dark,
    },
}));

export default useStyles;
