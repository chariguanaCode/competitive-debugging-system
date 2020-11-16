import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    Toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    ButtonRoot: {
        minWidth: '20px',
        minHeight: '20px',
        marginLeft: '20px',
    },
});

export default useStyles;
