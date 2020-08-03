import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    PathsList: {
        width: '100%',
        height: '100%',
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
