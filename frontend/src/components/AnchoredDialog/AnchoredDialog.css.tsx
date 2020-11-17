import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    AnchoredDialog: {
        zIndex: 1200,
        position: 'fixed',
        animation: '$dialog-grow 0.2s', //0.2s',
        overflow: 'hidden',
        opacity: 1,
    },
    '@keyframes dialog-grow': {
        '0%': {
            opacity: 0,
            transform: 'scale(1)', // needed to set position
        },
        '1%': {
            transform: 'scale(0)',
            opacity: 0,
        },
        '60%': {
            opacity: 1,
            transform: 'scale(1.04)',
        },
        '100%': {
            transform: 'scale(1)',
        },
    },
    DialogBackground: {
        position: 'fixed',
        height: '100%',
        width: '100%',
        zIndex: 1199,
        left: 0,
        top: 0,
    },
});

export default useStyles;
