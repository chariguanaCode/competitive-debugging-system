import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    TestListElement: {
        fontSize: '15px',
        paddingLeft: '10px',
        marginBottom: '10px',
        fontWeight: 400,
        textAlign: 'center',
        alignItems: 'center',
        width: '100%',
        height: '30px',
        display: 'flex',
        flexDirection: 'row',
    },
    status: {
        height: '29px',
        width: '60px',
        display: 'flex',
        alignItems: 'center',
        marginRight: '10px',
        borderRadius: '8px 3px',
        padding: '0px 5px',
    },
    testName: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    executionTime: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: '10px',
        paddingLeft: '20px',
        fontFamily: 'Roboto Mono, monospace',
        whiteSpace: 'pre',
    },
    buttons: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        width: 'min-content',
        marginLeft: '10px',
        marginRight: '10px',
    },
    Button: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
        marginLeft: '5px',
    },
});

export default useStyles;
