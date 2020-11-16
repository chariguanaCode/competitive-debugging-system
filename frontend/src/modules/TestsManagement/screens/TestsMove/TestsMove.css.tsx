import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    TestsMove: {
        display: 'flex',
        flexDirection: 'column',
        height: 'min-content',
        maxHeight: '600px',
        overflow: 'hidden auto',
        width: 'max-content',
        backgroundColor: '#424242',
        borderRadius: '10px',
        padding: '4px',
        border: '1px white solid',
    },
});

export default useStyles;
