import { makeStyles } from '@material-ui/core/styles';
import { fileExist } from 'backend/syncFileActions';

const useStyles = makeStyles({
    TasksMerge: {
        height: '50%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    pathsListContainer: {
        border: '1px solid black',
        width: '50%'
    },
    mergeSettingContainer: {

    },
});

export default useStyles;
