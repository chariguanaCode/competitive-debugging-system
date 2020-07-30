import React from 'react';
import { Button } from '@material-ui/core';
import useStyles from './SelectedList.css';
import { SelectedListPropsModel, SelectedListStateModel } from './SelectedList.d';

export const SelectedList: React.FunctionComponent<SelectedListPropsModel> = ({ selectedFiles, loadDirectory }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.SelectedList}>
                {[...selectedFiles.keys()].map((key, index) => (
                    <div key={`selectedFiles-${index}`} className={classes.ButtonContainer}>
                        <Button
                            classes={{ label: classes.ButtonLabel, root: classes.ButtonRoot }}
                            onClick={() => {
                                loadDirectory({ path: key.split('/').slice(0, -1).join('/') });
                            }}
                        >
                            {key}
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default SelectedList;
