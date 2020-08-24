import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Header: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    leftContainer: {
        flexGrow: 1,
    },
    SearchContainer: { flexGrow: 1, textAlign: 'right', minWidth: '200px'},
    NavigationContainer: {minWidth: '210px'},
    OperationalButtonsContainer: { position: 'absolute', top: '10px', right: '10px' },
}));

export default useStyles;
