import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: 32,
        height: 'calc(100vh - 64px - 24px)',
        position: 'absolute',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.drawer,
        boxShadow: theme.shadows[4],
    },
    taskStateSegment: {
        transition: theme.transitions.create(['flex-grow', 'flex-basis', 'width']),
        flexBasis: 16,
        width: 32,
        '&:hover': {
            flexBasis: 24,
            width: 40,
        },
    },
}));

export default useStyles;
