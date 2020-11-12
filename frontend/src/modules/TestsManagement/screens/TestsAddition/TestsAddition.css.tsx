import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    TasksAddition: {
        height: '900px',
        width: '1400px',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 20px 5px 20px',
        overflow: 'hidden',
    },
    additionFormContainers: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    additionFormContainer: {
        flexGrow: 1,
    },
    mergedFilesTableContainer: {
        flexGrow: 20,
        display: 'flex',
        flexDirection: 'column',
    },
    submitButton: { minHeight: '50px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    groupSelectLabel: {
        fontSize: '0.875rem',
    },
    submitButtonRoot: {
        width: '500px',
    },
});

export default useStyles;
