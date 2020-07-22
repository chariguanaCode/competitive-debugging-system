import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    mainMenu: {
        position: 'absolute',
        left: '0px',
        top: (props: any) => (props.open ? '80px' : '-400px'),
        transition: 'top 0.43s',
        zIndex: 1201,
        display: (props: any) => (props.open ? 'flex' : 'flex'),
        minWidth: '800px',
        minHeight: '400px',
        border: 'solid 1px #a0a9ad4d',
        backgroundColor: theme.palette.mainMenu.backgroundColor,
        flexDirection: 'row',
        //transitionTimingFunction: "cubic-bezier(3,4,5,6)",
        color: theme.palette.mainMenu.fontColor,
        '.mainMenu-optionIcon': {
            color: 'red',
        },
    },
    menuItem: {
        margin: '3px',
        height: '50px',
        width: '200px',
    },
    mainMenuOptionsList: {
        borderRight: 'solid 1px #a0a9ad4d',
    },
}));

export default useStyles;
