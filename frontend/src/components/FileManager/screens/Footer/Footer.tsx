import React, { memo } from 'react';
import useStyles from './Footer.css';
import { FooterPropsModel, FooterStateModel } from './Footer.d';
import { Button } from '@material-ui/core';
export const Footer: React.FunctionComponent<FooterPropsModel> = memo(
    ({ minNumberOfSelectedFiles, selectedFiles, selectFiles, dialogClose, withFilesStats }) => {
        const classes = useStyles();
        // TODO: add select of visible types
        // TODO: maybe selectFiles should be in FileManager.tsx
        return (
            <>
                <div className={classes.Footer}>
                    <div className={classes.selectFilesButtonContainer}>
                        <Button
                            disabled={selectedFiles.size < minNumberOfSelectedFiles}
                            onClick={() => {
                                selectFiles(withFilesStats ? [...selectedFiles.values()] : [...selectedFiles.keys()]);
                                dialogClose();
                            }}
                        >
                            {`Select ${selectedFiles.size} files`}
                        </Button>
                    </div>
                </div>
            </>
        );
    }
);

export default Footer;
