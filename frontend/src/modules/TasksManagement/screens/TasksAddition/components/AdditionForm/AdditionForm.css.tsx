import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    AdditionForm: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' },
    titleContainer: {},
    selectFilesForm: { width: '100%' },
    filesListContainer: {
        flexGrow: 1,
    },
    filesListContainers: {
        flexGrow: 1,
        display: 'flex',
        //@ts-ignore TODO: fix ts
        flexDirection: (props) => (props.mirrored ? 'row-reverse' : 'row'),
    },
    selectFilesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
});

export default useStyles;
