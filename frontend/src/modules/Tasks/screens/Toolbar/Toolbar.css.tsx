import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    Toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    Button: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
        marginLeft: '5px',
    },
    searchField: {
        margin: '11px 0px 0px 20px',
    },
    sortButton: {
        margin: '16px 0px 0px 16px',
    },
});

export default useStyles;
