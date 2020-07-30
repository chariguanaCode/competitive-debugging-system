import React, { useState, useRef, ElementRef, useEffect } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import { File } from './components';
import { FilesPropsModel, HiddenSearchRefModel } from './Files.d';
import { FileModel } from '../../FileManager.d';
import { checkIfActiveElementIsInput, isNumeric, isRightButton, sortStringCompare } from 'utils/tools';
import useStyles from './Files.css';
import { Button } from '@material-ui/core';

const Files: React.FunctionComponent<FilesPropsModel> = ({
    maxNumberOfSelectedFiles,
    setSelectedFiles,
    selectedFiles,
    loadDirectory,
    files,
    acceptableFilesExtensions,
}) => {
    const classes = useStyles();
    const [hiddenSearchResultIndex, setHiddenSearchResultIndex] = useState<number>(0);
    const hiddenSearchData = useRef<HiddenSearchRefModel>({
        currentHiddenSearchText: '',
        lastHiddenSearchTime: 0,
    });

    const onKeyDownOnFiles = (e: any) => {
        if (e.keyCode >= 49 && e.keyCode <= 125 && /*isHiddenSearchOn.current && */ !checkIfActiveElementIsInput()) {
            //hiddenSearch(e);
        }
    };

    const handleSelectedFiles = (selectedFilesToSet: Set<string>, idsToRerender: Array<number>, e?: any) => {
        if (selectedFilesToSet.size > maxNumberOfSelectedFiles) {
            //setErrorSnackbarMessage(`Maximum number of selected files is ${maxNumberOfSelectedFiles}`);
            return;
        }
        //if(e) e.target.style.backgroundColor = "red"
        setSelectedFiles(selectedFilesToSet);
    };
    const onKeyDownOnFile = (file: FileModel, e: any, fileIsAlreadyClicked: boolean = false, id: number) => {
        if (e.keyCode === 13) {
            if (file.type === 'DIRECTORY') {
                onFileClick(file, e, fileIsAlreadyClicked, id);
            }
        }
    };
    const onFileClick = (file: FileModel, e: any, fileIsAlreadyClicked = false, id: number) => {
        if (e.persist) e.persist();
        let isRightMB = isRightButton(e);
        if (!acceptableFilesExtensions || acceptableFilesExtensions.has(file.type)) {
            let selectedFilesSet = new Set(selectedFiles);
            if ((fileIsAlreadyClicked && isRightMB) || (fileIsAlreadyClicked && file.type !== 'DIRECTORY')) {
                selectedFilesSet.delete(file.path);
            }
            if (fileIsAlreadyClicked && file.type === 'DIRECTORY' && !isRightMB) {
                selectedFilesSet.delete(file.path);
                handleSelectedFiles(selectedFilesSet, []);
                loadDirectory({ path: file.path });
            } else if (!isRightMB && !fileIsAlreadyClicked) {
                selectedFilesSet.add(file.path);
                handleSelectedFiles(selectedFilesSet, [id], e);
            } else {
                handleSelectedFiles(selectedFilesSet, [id], e);
            }
        } else if (file.type === 'DIRECTORY') {
            loadDirectory({ path: file.path });
        }
    };

    const hiddenSearch = (e: any) => {
        let currentTime = new Date().getTime();
        if (currentTime - hiddenSearchData.current.lastHiddenSearchTime >= 1000)
            hiddenSearchData.current.currentHiddenSearchText = '';
        hiddenSearchData.current.lastHiddenSearchTime = currentTime;
        let key = e.keyCode;
        if (!e.shiftKey && key >= 65 && key <= 90) key += 32;
        hiddenSearchData.current.currentHiddenSearchText += String.fromCharCode(key);
        const regexExp = new RegExp(hiddenSearchData.current.currentHiddenSearchText);
        for (let i = 0; i < files.length; ++i) {
            if (regexExp.test(files[i].name)) {
                setHiddenSearchResultIndex(i);
                //filesRefs.current[i].style.backgroundColor = '#e0e0e0';
                return;
            }
        }
        // TODO: hidden search
    };

    let renderRow = ({ index, key, style }: { index: number; key: string; style: any }) => {
        const file = files[index];
        // TODO: focus file if shouldBeFocused is true
        let isSelected = selectedFiles.has(file.path);
        let isAcceptable = acceptableFilesExtensions ? acceptableFilesExtensions.has(file.type) : true;
        let shouldBeFocused = hiddenSearchResultIndex === index;
        return (
            <div onKeyDown={onKeyDownOnFiles} key={key} style={style}>
                <File
                    // shouldBeFocused={shouldBeFocused}
                    isSelected={isSelected}
                    isAcceptable={isAcceptable}
                    file={file}
                    onFileClick={onFileClick}
                    fileIndex={index}
                    onKeyDownOnFile={onKeyDownOnFile}
                />
            </div>
        );
    };
    return (
        <>
            <div className={classes.Files}>
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            rowRenderer={renderRow}
                            width={width}
                            height={height}
                            rowCount={files.length}
                            rowHeight={50}
                            scrollToIndex={hiddenSearchResultIndex}
                        ></List>
                    )}
                </AutoSizer>
            </div>
        </>
    );
};

export default Files;
