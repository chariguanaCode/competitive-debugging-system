import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    input: {
        flexGrow: 1,
        margin: theme.spacing(1),
    },
    addTrackedObjectButton: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
    },
}));

export default useStyles;
