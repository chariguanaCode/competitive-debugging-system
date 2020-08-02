import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Content: {
        height: '100%',
    },
    FilesLayout: {
        height: '100%',
        width: '100%',
    },
    DirectoryTreeLayout: {
        width: '-webkit-fill-available',
    },
    SelectedFilesLayout: {
        width: '100%',
    },
    SplitPane: {
        position: 'relative !important' as any,
    },
}));

export default useStyles;
