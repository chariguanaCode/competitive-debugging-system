import React, { memo } from 'react';
import useStyles from './Footer.css';
import { FooterPropsModel, FooterStateModel } from './Footer.d';
import { Button } from '@material-ui/core';
export const Footer: React.FunctionComponent<FooterPropsModel> = memo(
    ({ minNumberOfSelectedFiles, selectedFiles, selectFiles, dialogClose }) => {
        const classes = useStyles();
        // TODO: add select of visible types
        return (
            <>
                <div className={classes.Footer}>
                    <div className={classes.selectFilesButtonContainer}>
                        <Button
                            disabled={selectedFiles.size < minNumberOfSelectedFiles}
                            onClick={() => {
                                selectFiles([...selectedFiles.values()]);
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
