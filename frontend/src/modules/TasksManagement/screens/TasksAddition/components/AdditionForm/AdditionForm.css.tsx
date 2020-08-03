import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    AdditionForm: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' },
    titleContainer: {},
    selectFilesForm: {width: '100%'},
    selectedFilesListContainer: { width: '50%', height: '100%' },
    pendingFilesListContainer: { width: '50%', height: '100%' },
    filesListContainer: {
        border: '2px solid black',
        flexGrow: 1,
    },
    filesListContainers: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    selectFilesContainer: {
        flexGrow: 2,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
});

export default useStyles;
