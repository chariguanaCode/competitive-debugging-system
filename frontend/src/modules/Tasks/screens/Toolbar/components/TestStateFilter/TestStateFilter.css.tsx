import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Button: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
        marginLeft: '5px',
    },
    selectWrapper: {
        padding: '4px 0px 8px 8px',
        height: 30,
        minWidth: 120,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
    },
    selectElement: {
        margin: '0px 2px',
        height: 30,
        width: 30,
        borderRadius: '8px 3px',
    },
    selectArrow: {
        marginLeft: 'auto',
    },
    checkBoxLabel: {
        marginLeft: 0,
    },
}));

export default useStyles;
