import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    MergedFilesTable: {
        width: '100%',
        flexGrow: 1
    },
    FilesTable: {
        border: '1px solid black',
    },
    FilesTableRow: {
        '& div': {
           // borderRight: '1px solid black',
            margin: '0px',
            paddingLeft: '2px'
        },
    },
});

export default useStyles;
