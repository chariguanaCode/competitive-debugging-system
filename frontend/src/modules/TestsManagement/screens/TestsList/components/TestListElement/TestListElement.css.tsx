import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    TestListElement: {
        fontSize: '15px',
        paddingLeft: '30px',
        marginBottom: '10px',
        fontWeight: 500,
        textAlign: 'center',
        alignItems: 'center',
        width: '100%',
        height: '30px',
        display: 'flex',
        flexDirection: 'row',
    },
    testName: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
    },
    buttons: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: '20px',
        width: 'min-content',
        marginLeft: 'auto',
        marginRight: '10px'
    },
    Button: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
        marginLeft: '5px'
    },
    EditButton: {},
    RemoveButton: {},
});

export default useStyles;
