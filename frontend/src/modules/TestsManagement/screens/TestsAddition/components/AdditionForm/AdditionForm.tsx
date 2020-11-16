import React, { useState, useEffect } from 'react';
import useStyles from './AdditionForm.css';
import clsx from 'clsx';
import { AdditionFormPropsModel, AdditionFormStateModel } from './AdditionForm.d';
import { Button, TextField } from '@material-ui/core';
import { ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { mergeArrays } from 'utils/tools';
import { PathsList } from 'modules/TestsManagement/components';
import { Form } from '..';
import { FileModel } from 'components/FileManager/FileManager.d';

export const AdditionForm: React.FunctionComponent<AdditionFormPropsModel> = ({
    title,
    setSelectedFiles,
    selectedFiles,
    setFileManager,
    mirrored = false,
}) => {
    const useStylesProps: { mirrored: boolean } = {
        mirrored: mirrored,
    };
    const classes = useStyles(useStylesProps);

    return (
        <>
            <div className={classes.AdditionForm}>
                <div className={classes.selectFilesForm}>
                    <Form
                        setSelectedFiles={setSelectedFiles}
                        mirrored={mirrored}
                        setFileManager={setFileManager}
                        title={title}
                    />
                </div>
                <div className={classes.filesListContainers}>
                    <div className={classes.filesListContainer}>
                        <PathsList paths={selectedFiles} />
                    </div>
                    <div className={classes.selectFilesContainer}>{mirrored ? <ArrowBackIcon /> : <ArrowForwardIcon />}</div>
                </div>
            </div>
        </>
    );
};

export default AdditionForm;
