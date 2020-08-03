import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    TasksMerge: {
        height: '50%',
        width: '100%'
    },
    pathRow: {
        // TODO: reversed ellipsis
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '&:hover': {
            overflow: 'visible',
            zIndex: 20000,
        },
        whiteSpace: 'nowrap',
    },
});

export default useStyles;
