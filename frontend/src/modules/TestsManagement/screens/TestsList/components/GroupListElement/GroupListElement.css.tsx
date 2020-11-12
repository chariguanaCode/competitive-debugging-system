import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    GroupListElement: {
        fontSize: '25px',
        fontWeight: 400,
        textAlign: 'center',
        alignItems: 'center',
        width: '100%',
        height: '30px',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '20px',
        marginTop: '20px',
    },
    groupName: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        paddingLeft: '10px',
    },
    groupTestsAmountLabel: {
        fontSize: '20px',
        fontWeight: 500,
        color: '#bdbdbd',
        paddingLeft: '10px',
        display: 'flex',
        alignItems: 'center',
        height: '100%',

    },
    buttons: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: '20px',
        width: 'min-content',
        marginLeft: 'auto',
        marginRight: '10px',
    },
    Button: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
        marginLeft: '5px',
    },
    EditButton: {},
    RemoveButton: {},
});

export default useStyles;
