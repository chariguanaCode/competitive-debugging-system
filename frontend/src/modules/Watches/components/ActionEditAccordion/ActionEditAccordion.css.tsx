import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    code: {
        fontFamily: 'Roboto Mono, monospace',
        whiteSpace: 'pre',
        backgroundColor: theme.palette.watchblocks.dialogCode,
        padding: theme.spacing(1),
    },
    codeComment: {
        fontStyle: 'italic',
        color: theme.palette.watchblocks.dialogCodeComment,
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    actionsContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    headingTarget: {
        flexBasis: '33.3%',
        flexShrink: 0,
    },
    headingAction: {
        color: theme.palette.text.secondary,
    },
    selectContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        alignItems: 'baseline',
    },
    selectWrapper: {
        display: 'flex',
        margin: theme.spacing(1),
    },
    addTrackedObjectButton: {
        height: '30px',
        width: '30px',
        minWidth: '30px',
    },
    deleteButton: {
        color: theme.palette.error.main,
    },
}));

export default useStyles;
