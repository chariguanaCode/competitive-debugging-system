import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    ToggleButton: {
        '&.Mui-disabled': {
            pointerEvents: 'auto',
        },
    },
});

export default useStyles;
