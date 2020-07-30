import React from 'react';
import useStyles from './AdditionForm.css';
import { AdditionFormPropsModel, AdditionFormStateModel } from './AdditionForm.d';

export const AdditionForm: React.FunctionComponent<AdditionFormPropsModel> = ({ title, setSelectedFiles, selectedFiles, setFileManagerConfig }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.AdditionForm}>
                <div className={classes.titleContainer}>{title}</div>
                <div className={classes.selectFilesForm}>

                </div>
                <div className={classes.selectedFilesListContainer}>

                </div>
            </div>
        </>
    );
};

export default AdditionForm;
