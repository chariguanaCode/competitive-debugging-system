import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    optionType: {
        padding: '15px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    optionLabel: {
        overflow: 'visible',
        width: 'max-content',
        marginRight: '10px',
    },
    optionElement: {
        minWidth: 'max-content',
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
