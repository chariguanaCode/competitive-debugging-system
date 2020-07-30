import React, { useState, useEffect } from 'react';
import useStyles from './AdditionForm.css';
import { List, AutoSizer } from 'react-virtualized';
import { AdditionFormPropsModel, AdditionFormStateModel } from './AdditionForm.d';
import { Button, TextField } from '@material-ui/core';
export const AdditionForm: React.FunctionComponent<AdditionFormPropsModel> = ({
    title,
    setSelectedFiles,
    selectedFiles,
    setFileManager,
}) => {
    const classes = useStyles();
    const [pendingFiles, setPendingFiles] = useState<Array<string>>([]);
    const [filteredFiles, setFilteredFiles] = useState<Array<string>>([]);
    const [regex, setRegex] = useState<string>('');
    // TODO: search and deletion from selected files list
    const renderRow = ({ index, key, style }: { index: number; key: string; style: any }, sourceArray: Array<string>) => {
        return (
            <div key={key} style={style}>
                {sourceArray[index]}
            </div>
        );
    };
    // TODO: directories handle: two modes: all predecessors or just child
    // now can't handle directories
    const selectFiles = (files: Array<string>) => setPendingFiles(files);

    const addFilteredFiles = () => {
        setPendingFiles((pvPendingFiles) => pvPendingFiles.filter((path) => !filteredFiles.includes(path)));
        setSelectedFiles(filteredFiles);
    };

    useEffect(() => {
        const regexp = new RegExp(regex);
        setFilteredFiles(pendingFiles.filter((path) => path.match(regexp)));
        console.log(regexp);
    }, [regex, pendingFiles]);
    console.log(regex, pendingFiles, filteredFiles, selectedFiles);
    return (
        <>
            <div className={classes.AdditionForm}>
                <div className={classes.titleContainer}>{title}</div>
                <div className={classes.selectFilesForm}>
                    {/* TODO: MOVE TO ANOTHER COMPONENT TOO AVOID RERENDERS*/}
                    <Button onClick={() => setFileManager({ open: true, selectFiles: selectFiles })}>Select files</Button>
                    <TextField
                        value={regex}
                        onChange={(e) => {
                            e.persist();
                            setRegex(e.target.value);
                        }}
                        label={'Regex to filter selected files'}
                    />
                    <Button onClick={addFilteredFiles}>Add {filteredFiles.length.toString()} files</Button>
                </div>
                <div className={classes.pendingFilesListContainer}>
                    <AutoSizer>
                        {({ width, height }) => (
                            <List
                                rowRenderer={(props) => renderRow(props, filteredFiles)}
                                width={width}
                                height={height}
                                rowCount={filteredFiles.length}
                                rowHeight={50}
                            ></List>
                        )}
                    </AutoSizer>
                </div>
                <div className={classes.selectedFilesListContainer}>
                    <AutoSizer>
                        {({ width, height }) => (
                            <List
                                rowRenderer={(props) => renderRow(props, selectedFiles)}
                                width={width}
                                height={height}
                                rowCount={selectedFiles.length}
                                rowHeight={50}
                            ></List>
                        )}
                    </AutoSizer>
                </div>
            </div>
        </>
    );
};

export default AdditionForm;
