import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    MainMenu: {
        position: 'absolute',
        left: '0px',
        top: (props: any) => (props.open ? '74px' : '-400px'),
        transition: 'top 0.43s',
        zIndex: 1201,
        display: 'flex',
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
}));

export default useStyles;
