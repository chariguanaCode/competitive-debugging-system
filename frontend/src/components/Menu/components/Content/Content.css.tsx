import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
    createStyles({
        Content: {
            color: theme.palette.mainMenu.fontColor,
            padding: '20px',
            width: '100%'
        },
    })
);

export default useStyles;
