import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

export default styled(Paper)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
}));
