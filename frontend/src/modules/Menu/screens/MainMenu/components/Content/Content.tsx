import React, { useState, memo } from 'react';
import useStyles from './Content.css';
import * as Contents from '../Contents';
import { ContentProps } from './Types';
import { Sector } from '../SectorsButtons';
import { FileManager } from 'components';
import { useFileManagerActions } from 'reduxState/actions';

export const Content: React.FunctionComponent<ContentProps> = memo(({ selectedSector, closeMainMenu }) => {
    const classes = useStyles();
    const { setFileManager } = useFileManagerActions();
    /* @ts-ignore TODO: FIX TS*/
    const SectorContent = !!Contents[Sector[selectedSector]] ? Contents[Sector[selectedSector]] : null;
    return (
        <div className={classes.Content}>
            {SectorContent && <SectorContent closeMainMenu={closeMainMenu} setFileManagerConfig={setFileManager} />}
        </div>
    );
});

export default Content;
