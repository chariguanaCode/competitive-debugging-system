import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: 32,
        height: '100%',
        zIndex: theme.zIndex.drawer,

        backgroundColor: theme.palette.background.default,
        boxShadow: theme.shadows[4],

        display: 'flex',
        flexDirection: 'column',
    },
    taskStateSegment: {
        transition: theme.transitions.create(['flex-grow', 'flex-basis', 'width', 'margin-left']),
        flexBasis: 16,
        width: 32,
        marginLeft: 0,
        '&:hover': {
            flexBasis: 24,
            width: 40,
            marginLeft: -8,
        },
    },
}));

export default useStyles;
