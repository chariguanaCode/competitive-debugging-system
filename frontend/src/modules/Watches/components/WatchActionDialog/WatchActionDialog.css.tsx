import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    WatchActionDialog: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        minWidth: 'calc(max(500px, 20vw))',
        maxWidth: '50vw',
        maxHeight: 'calc(100vh - 114px)',
        overflow: 'auto',
    },
    code: {
        fontFamily: 'Roboto Mono, monospace',
        whiteSpace: 'pre',
        backgroundColor: theme.palette.watchblocks.dialogCode,
        padding: theme.spacing(1),
    },
    actions: {
        marginTop: theme.spacing(2),
    },
    backdrop: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'transparent',
    },
    title: {
        paddingBottom: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
    },
}));

export default useStyles;
