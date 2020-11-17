import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Navigation: {
        display: 'flex',
        alignContent: 'center',
        textAlign: 'center',
        fontWeight: 500,
        justifyContent: 'center',
        alignSelf: 'center',
        marginLeft: 'auto',
    },
    BreadcrumbsContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '300px', // TODO: scrollbar handle
        overflow: 'overlay',
        '&::-webkit-scrollbar': {
            width: '0 !important',
            height: '1 !important',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.scrollbar.thumbHover,
        },
    },
    BreadcrumbsOl: { flexWrap: 'nowrap' },
    BreadcrumbsButton: {
        width: 'max-content',
    },
}));

export default useStyles;
