import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    node: {
        fontFamily: 'Roboto Mono, monospace',
        whiteSpace: 'pre',
    },
    bracketArrow: {
        color: theme.palette.watchblocks.bracketArrow,
    },
}));

export default useStyles;
