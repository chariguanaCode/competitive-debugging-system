import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme=>({
    Search: {},
    checkboxRoot: {
        color: theme.palette.fileManager.checkboxColor,
        '&$checked': {
            color: theme.palette.fileManager.checkboxColor,
        },
    },
    checkboxChecked: {},
}));

export default useStyles;
