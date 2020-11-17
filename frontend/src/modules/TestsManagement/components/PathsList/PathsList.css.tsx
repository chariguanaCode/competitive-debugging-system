import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    PathsList: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    pathsListTitle: { width: '100%', textAlign: 'center', fontWeight: 700 },
    pathsListContainer: { width: '100%', flexGrow: 1, border: '1px solid #616161' },
    pathRow: {
        // TODO: reversed ellipsis
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '&:hover': {
            overflow: 'visible',
            zIndex: 20000,
        },
        whiteSpace: 'nowrap',
        padding: '0px 3px 0px 3px',
    },
});

export default useStyles;
