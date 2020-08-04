import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    Form: {
        display: 'flex',
        // @ts-ignore TODO: fix ts
        flexDirection: props=> props.mirrored ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    titleContainer: {},
    selectFilesButtonContainer: {},
    regexTextFieldContainer: {},
});

export default useStyles;
