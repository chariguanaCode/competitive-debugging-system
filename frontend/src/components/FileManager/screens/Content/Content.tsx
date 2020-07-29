import React from 'react';
import useStyles from './Content.css';
import { ContentPropsModel, ContentStateModel } from './Content.d';
import { Files, DirectoryTree, SelectedList } from '../';
import { SplitPane } from 'react-multi-split-pane';
import './ReactMultiSplitLayout.css'; // TODO: move css to makeStyles

export const Content: React.FunctionComponent<ContentPropsModel> = ({
    files,
    selectedFiles,
    acceptableFilesExtensions,
    setSelectedFiles,
    maxNumberOfSelectedFiles,
    loadDirectory,
    currentPath,
    currentRootDirectory,
}) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.Content}>
                <SplitPane split="vertical" className={classes.SplitPane} minSize={[0, 200, 0]} defaultSizes={[100, 500, 100]}>
                    <div className={classes.DirectoryTreeLayout}>
                        <DirectoryTree
                            currentPath={currentPath}
                            joinDirectory={loadDirectory}
                            currentRootDirectory={currentRootDirectory}
                        />
                    </div>
                    <div className={classes.FilesLayout}>
                        <Files
                            files={files}
                            selectedFiles={selectedFiles}
                            acceptableFilesExtensions={acceptableFilesExtensions}
                            setSelectedFiles={setSelectedFiles}
                            maxNumberOfSelectedFiles={maxNumberOfSelectedFiles}
                            loadDirectory={loadDirectory}
                        />
                    </div>
                    <div className={classes.SelectedFilesLayout}>
                        <SelectedList selectedFiles={selectedFiles} loadDirectory={loadDirectory} />
                        {/* TODO: focus file after click*/}
                    </div>
                </SplitPane>
            </div>
        </>
    );
};

export default Content;
