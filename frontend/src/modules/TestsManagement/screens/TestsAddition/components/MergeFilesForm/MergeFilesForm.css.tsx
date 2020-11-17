import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    MergeFilesForm: { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' },
    determineTestDataRuleSelectRoot: {
        maxWidth: '200px'
    },
    determineTestDataRuleSelectContainer: {},
    mergeFilesButtonContainer: {},
    mergeRuleSelectContainer: {},
    addNotMatchedInputsCheckboxContainer: {},
});

export default useStyles;
