import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    RecentProjects: { display: 'flex', flexDirection: 'column-reverse', justifyContent: 'left' },
    RecentProjectButton: {
        display: 'flex',
        justifyContent: 'left'
    }
});

export default useStyles;
