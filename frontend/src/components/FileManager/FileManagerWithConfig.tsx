import React from 'react';
import { useContextSelector } from 'use-context-selector';
import GlobalStateContext from '../../utils/GlobalStateContext';
import { FileManager as FileManagerRow } from './FileManager';
import { FileManagerProps } from './Types';

export const FileManager: React.FunctionComponent<FileManagerProps> = (props) => {
    const config = useContextSelector(GlobalStateContext, (v) => v.config);
    let FileManagerConfig;
    console.log(config);
    if (config) FileManagerConfig = config.settings.fileManager;
    return <FileManagerRow {...props} config={props.config ? props.config : FileManagerConfig} />;
};
