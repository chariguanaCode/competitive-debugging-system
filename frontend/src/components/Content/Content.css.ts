import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(6) + 24,
        marginRight: 24,
        height: 'calc(100vh - 64px - 24px)',
    },
    appBar: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'row',
    },
    '@global': {},
}));

export default useStyles;
