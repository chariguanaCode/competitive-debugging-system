import React, { useState } from 'react';
import useStyles from './Form.css';
import { FormPropsModel, FormStateModel } from './Form.d';
import { Button, TextField } from '@material-ui/core';

export const Form: React.FunctionComponent<FormPropsModel> = ({
    setFileManager,
    addFilteredFiles,
    filteredFiles,
    setSelectedFiles,
}) => {
    const classes = useStyles();
    const [pendingFiles, setPendingFiles] = useState<Array<string>>([]);
    const [regex, setRegex] = useState<string>('');

    const addFilteredFiles = () => {
        setPendingFiles((pvPendingFiles) => pvPendingFiles.filter((path) => !filteredFiles.includes(path)));
        setSelectedFiles(filteredFiles);
    };

    useEffect(() => {
        const regexp = new RegExp(regex);
        setFilteredFiles(pendingFiles.filter((path) => path.match(regexp)));
        console.log(regexp);
    }, [regex, pendingFiles]);

    // TODO: directories handle: two modes: all predecessors or just child
    // now can't handle directories
    const selectFiles = (files: Array<string>) => setPendingFiles(files);
    return (
        <>
            <div className={classes.Form}>
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
        </>
    );
};

export default Form;
