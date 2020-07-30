import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    TasksAddition: {
        width: '1000px', // DEV
        height: '700px', // DEV
        margin: '50px', // DEV
        backgroundColor: '#424242', // DEV
    },
    additionFormContainers: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    additionFormContainer: {
        width: '50%',
        height: '100%',
    },
});

export default useStyles;
