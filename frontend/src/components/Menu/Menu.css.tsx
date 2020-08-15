import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Menu: {
        display: 'flex',
        minWidth: '800px',
        minHeight: '400px',
        border: 'solid 1px #a0a9ad4d',
        backgroundColor: theme.palette.Menu.backgroundColor,
        flexDirection: 'row',
        //transitionTimingFunction: "cubic-bezier(3,4,5,6)",
        color: theme.palette.Menu.fontColor,
        '.Menu-optionIcon': {
            color: 'red',
        },
    },
}));

export default useStyles;
