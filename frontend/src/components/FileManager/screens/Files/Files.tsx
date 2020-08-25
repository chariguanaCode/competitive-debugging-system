import React, { useState, useRef, ElementRef, useEffect } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import { File } from './components';
import { FilesPropsModel, HiddenSearchRefModel } from './Files.d';
import { FileModel } from '../../FileManager.d';
import { checkIfActiveElementIsInput, isNumeric, isRightButton, sortStringCompare } from 'utils/tools';
import useStyles from './Files.css';
import { useHotkeys } from 'react-hotkeys-hook';

const Files: React.FunctionComponent<FilesPropsModel> = ({
    maxNumberOfSelectedFiles,
    setSelectedFiles,
    selectedFiles,
    loadDirectory,
    files,
    acceptableFilesExtensions,
    searchText,
    zoomFactor,
    setZoomFactor,
}) => {
    const classes = useStyles();
    const [hiddenSearchResultIndex, setHiddenSearchResultIndex] = useState<number>(0);
    const hiddenSearchData = useRef<HiddenSearchRefModel>({
        currentHiddenSearchText: '',
        lastHiddenSearchTime: 0,
    });
    const [filesFilteredBySearch, setFilesFilteredBySearch] = useState<typeof files>([]);

    useEffect(() => {
        if (!searchText) return setFilesFilteredBySearch(files);
        let searchRegex = new RegExp('');
        try {
            searchRegex = new RegExp(searchText);
        } catch {}
        setFilesFilteredBySearch(files.filter((file: FileModel) => file.name.match(searchRegex)));
    }, [files, searchText]);
    const selectAllFiles = () => {
        handleSelectedFiles(
            new Map(
                // TODO: optimize that
                [...selectedFiles.entries()].concat(
                    files.reduce((pvVal: Array<any>, file: FileModel) => pvVal.concat([[file.path, file]]), [])
                )
            )
        );
    };
    useHotkeys('ctrl+a', selectAllFiles, {}, [filesFilteredBySearch]);

    const onKeyDownOnFiles = (e: any) => {
        if (e.keyCode >= 49 && e.keyCode <= 125 && /*isHiddenSearchOn.current && */ !checkIfActiveElementIsInput()) {
            //hiddenSearch(e);
        }
    };

    const handleSelectedFiles = (selectedFilesToSet: typeof selectedFiles, idsToRerender?: Array<number>, e?: any) => {
        if (selectedFilesToSet.size > (maxNumberOfSelectedFiles || 0)) {
            //setErrorSnackbarMessage(`Maximum number of selected files is ${maxNumberOfSelectedFiles}`);
            return false;
        }
        //if(e) e.target.style.backgroundColor = "red"
        setSelectedFiles(selectedFilesToSet);
        return true;
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
            let selectedFilesMap = new Map(selectedFiles);
            if ((fileIsAlreadyClicked && isRightMB) || (fileIsAlreadyClicked && file.type !== 'DIRECTORY')) {
                selectedFilesMap.delete(file.path);
            }
            if (fileIsAlreadyClicked && file.type === 'DIRECTORY' && !isRightMB) {
                selectedFilesMap.delete(file.path);
                handleSelectedFiles(selectedFilesMap, []);
                loadDirectory({ path: file.path });
            } else if (!isRightMB && !fileIsAlreadyClicked) {
                selectedFilesMap.set(file.path, file);
                if (!handleSelectedFiles(selectedFilesMap, [id], e) && file.type === 'DIRECTORY')
                    loadDirectory({ path: file.path });
            } else {
                handleSelectedFiles(selectedFilesMap, [id], e);
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
        for (let i = 0; i < filesFilteredBySearch.length; ++i) {
            if (regexExp.test(filesFilteredBySearch[i].name)) {
                setHiddenSearchResultIndex(i);
                //filesRefs.current[i].style.backgroundColor = '#e0e0e0';
                return;
            }
        }
        // TODO: hidden search
    };

    let renderRow = ({ index, key, style }: { index: number; key: string; style: any }) => {
        const file = filesFilteredBySearch[index];
        // TODO: focus file if shouldBeFocused is true
        let isSelected = selectedFiles.has(file.path);
        let isAcceptable = acceptableFilesExtensions ? acceptableFilesExtensions.has(file.type) : true;
        let shouldBeFocused = hiddenSearchResultIndex === index;
        return (
            <div onKeyDown={onKeyDownOnFiles} key={key} style={style}>
                <File
                    // shouldBeFocused={shouldBeFocused}
                    zoomFactor={zoomFactor}
                    isSelected={isSelected}
                    isAcceptable={isAcceptable}
                    file={file}
                    onFileClick={onFileClick}
                    fileIndex={index}
                    onKeyDownOnFile={onKeyDownOnFile}
                />
            </div>
        );
    }; //min: 0.5 max 3 step 0.1

    const handleZoom = (e: any) => {
        if (!e.ctrlKey) return;
        e.persist();
        const delta = Math.sign(e.deltaY) * -0.1; //Number(Math.fround(e.deltaY * -0.001).toFixed(1))
        setZoomFactor((currentZoomFactor: number): number => Math.min(Math.max(0.5, currentZoomFactor + delta), 3));
    };
    return (
        <>
            <div className={classes.Files} onWheel={handleZoom}>
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            rowRenderer={renderRow}
                            width={width}
                            height={height}
                            rowCount={filesFilteredBySearch.length}
                            rowHeight={40 * zoomFactor} //TODO: set default height to lower? (was 50)
                            scrollToIndex={hiddenSearchResultIndex}
                            overscanRowCount={30}
                        ></List>
                    )}
                </AutoSizer>
            </div>
        </>
    );
};

export default Files;
