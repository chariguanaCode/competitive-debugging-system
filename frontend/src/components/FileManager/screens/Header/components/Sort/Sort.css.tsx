import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    Sort: {
        padding: '15px',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
    },
    SortLabel: {
        overflow: 'visible',
        width: 'max-content',
        marginRight: '10px',
    },
    SelectContainer: {
        minWidth: 'max-content',
    },
});

export default useStyles;
