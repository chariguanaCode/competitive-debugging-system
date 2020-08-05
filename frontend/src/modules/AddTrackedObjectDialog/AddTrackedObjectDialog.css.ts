import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        display: 'flex',
        flexDirection: 'row',
    },
    input: {
        flexGrow: 1,
        margin: theme.spacing(1),
    },
}));

export default useStyles;
