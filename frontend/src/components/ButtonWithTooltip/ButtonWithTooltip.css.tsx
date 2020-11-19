import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    Button: {
        '&.Mui-disabled': {
            pointerEvents: 'auto',
        },
    },
});

export default useStyles;
