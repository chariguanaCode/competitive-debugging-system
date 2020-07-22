import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    navigation: {
        display: 'flex',
        alignContent: 'center',
        textAlign: 'center',
        fontWeight: 500,
        justifyContent: 'center',
    },
    checkboxRoot: {
        color: theme.palette.fileManager.checkboxColor,
        '&$checked': {
            color: theme.palette.fileManager.checkboxColor,
        },
    },
    checkboxChecked: {},
}));

export default useStyles;
