import React, { memo } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SelectedFilesProps } from './Types';

const useStyles = makeStyles({
    buttonLabel: {
        fontSize: '10px',
    },
});

export const SelectedFiles: React.FunctionComponent<SelectedFilesProps> = memo(({ selectedFiles, loadDirectory }) => {
    const classes = useStyles();
    return (
        <>
            <div>
                {[...selectedFiles.keys()].map((key, index) => (
                    <div key={`selectedFiles-${index}`}>
                        <Button
                            classes={{ label: classes.buttonLabel }}
                            onClick={() => {
                                loadDirectory(
                                    key
                                        .split('/')
                                        .slice(0, -1)
                                        .join('/')
                                );
                            }}
                        >
                            {key}
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
});

export default SelectedFiles;
