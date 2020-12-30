import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    node: {
        fontFamily: 'Roboto Mono, monospace',
        whiteSpace: 'pre',
    },
    bracketArrow: {
        color: theme.palette.watchblocks.bracketArrow,
    },
    actionIndicator: {
        width: 8.555,
        height: 8.555,
        margin: '0px 4.277px',
        display: 'inline-block',
    },
}));

export default useStyles;
