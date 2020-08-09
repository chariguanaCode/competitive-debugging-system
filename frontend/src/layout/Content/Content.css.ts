import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        height: 'calc(100vh - 50px - 24px - 24px)',
        display: 'flex',
        flexDirection: 'row',
    },
    layoutWrapper: {
        position: 'relative',
        flexGrow: 1,
        margin: theme.spacing(1),

        borderColor: theme.palette.contentLayout.borders,
        borderStyle: 'solid',
        borderWidth: 1,
    },
    addTabButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
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
        '.flexlayout__tab_button, \
         .flexlayout__border_button': {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 14,
            fontWeight: 500,
            backgroundColor: theme.palette.contentLayout.panelHeader,
            borderBottom: `2px solid ${theme.palette.contentLayout.panelHeader}`,
            padding: '3px 14px',
            margin: 0,
            height: 30,
            boxShadow: 'none',
        },
        '.flexlayout__tab_button--selected, .flexlayout__tab_button:hover, \
         .flexlayout__border_button--selected, .flexlayout__border_button:hover': {
            color: theme.palette.contentLayout.panelHeaderText,
            backgroundColor: theme.palette.contentLayout.panelHeader,
        },
        '.flexlayout__tab_button--selected, \
         .flexlayout__border_button--selected': {
            borderBottom: `2px solid ${theme.palette.contentLayout.panelHeaderText}`,
        },
        '.flexlayout__tab_button_trailing, \
         .flexlayout__border_button_trailing': {
            marginTop: 5,
            marginBottom: 5,
        },
        '.flexlayout__tabset-selected': {
            backgroundImage: 'none',
        },
        '.flexlayout__border_button': {
            borderRadius: 0,
        },
        '.flexlayout__border_left, .flexlayout__border_right, .flexlayout__border_top, .flexlayout__border_bottom': {
            backgroundColor: theme.palette.contentLayout.panelBackground,
            border: 'none',
        },
        '.flexlayout__border_inner_left': {
            right: 29,
        },
        '.flexlayout__border_inner_right': {
            left: 29,
        },
    },
}));

export default useStyles;
