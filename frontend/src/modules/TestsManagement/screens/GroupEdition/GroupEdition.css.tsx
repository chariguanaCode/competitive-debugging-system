import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    GroupEdition: {
        width: '500px',
        height: 'min-content',
        backgroundColor: '#424242',
        borderRadius: '10px',
        padding: '20px',
        border: '1px white solid',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column',
    },
    FormContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    FormElement: {
        height: '60px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    FormElementLabel: {
        fontSize: '23px',
        fontWeight: 470,
        letterSpacing: '1px',
    },
    FormElementTextFieldContainer: {
        alignSelf: 'flex-end',
        width: '330px',
        height: '50px',
    },
    FormElementNumberTextFieldContainer: {
        width: '230px',
        minWidth: '230px'
    },
    FooterButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 'auto',
    },
    FooterButtonRoot: {
        height: '40px',
        fontSize: '17px',
    },
});

export default useStyles;
