import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    OperationalButtons: {
        display: 'flex',
        flexDirection: 'row',
    },
    OperationalButton: {
        width: '20px',
        height: '20px',
        display: 'flex',
    },
    settingsButton: {
        color: 'grey',
    },
    closeButton: {
        color: 'red',
    },
});

export default useStyles;
