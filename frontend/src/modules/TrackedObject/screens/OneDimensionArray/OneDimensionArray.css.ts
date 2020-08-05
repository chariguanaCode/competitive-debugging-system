import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    cell: {
        padding: 8,
        fontFamily: 'Roboto Mono, monospace',
        fontSize: 14,
        borderRight: `1px solid ${theme.palette.contentLayout.borders}`,
        borderBottom: `1px solid ${theme.palette.contentLayout.borders}`,
    },
    topRightGrid: {
        borderBottom: '2px solid grey',
        paddingBottom: 10,
        fontWeight: 'bold',
    },
    topLeftGrid: {
        borderBottom: '2px solid grey',
        borderRight: '2px solid grey',
    },
    bottomLeftGrid: {
        borderRight: '2px solid grey',
        paddingRight: 10,
        fontWeight: 'bold',
    },
}));

export default useStyles;
