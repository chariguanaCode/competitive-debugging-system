import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    IconButton: {
        '&.Mui-disabled': {
            pointerEvents: 'auto',
        },
    },
});

export default useStyles;
