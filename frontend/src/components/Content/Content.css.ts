import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(4),
        height: 'calc(100vh - 64px - 24px)',
    },
    appBar: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'row',
    },
    '@global': {
        '.flexlayout__splitter': {
            backgroundColor: 'transparent',
        },
        '.flexlayout__splitter:hover, .flexlayout__splitter_drag': {
            backgroundColor: theme.palette.contentLayout.borders,
        },
        '.flexlayout__tabset': {
            backgroundColor: theme.palette.contentLayout.panelBackground,
            borderColor: theme.palette.contentLayout.borders,
            borderWidth: 1,
            borderStyle: 'solid',
            boxSizing: 'content-box',
            transform: 'translate(-1px, -1px)',
        },
        '.flexlayout__tabset_header_outer': {
            backgroundColor: theme.palette.contentLayout.panelHeader,
        },
        '.flexlayout__tab': {
            backgroundColor: theme.palette.contentLayout.panelBackground,
            color: theme.palette.getContrastText(theme.palette.contentLayout.panelBackground),
        },
        '.flexlayout__tab_button': {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            backgroundColor: theme.palette.contentLayout.panelHeader,
            padding: '3px 14px',
            margin: 0,
            boxShadow: 'none',
        },
        '.flexlayout__tab_button--selected, .flexlayout__tab_button:hover': {
            color: theme.palette.secondary.main,
            backgroundColor: theme.palette.contentLayout.panelHeader,
        },
        '.flexlayout__tab_button--selected': {
            borderBottom: `2px solid ${theme.palette.secondary.main}`,
        },
        '.flexlayout__tabset-selected': {
            backgroundImage: 'none',
        },
        '.flexlayout__tab_button_trailing': {
            marginTop: 5,
            marginBottom: 5,
        },
    },
}));

export default useStyles;
