import React, { memo, useState, useRef, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Button } from '@material-ui/core';
import { Folder as FolderIcon } from '@material-ui/icons';
import { useSaveProjectAs, useLoadProject } from 'backend/projectManagement';
import { ContentProps } from '../Types';
import { SaveAsFormValues } from './Types';
import useStyles from './SaveAs.css';
import { useConfig } from 'reduxState/selectors';
import { useConfigActions } from 'reduxState/actions';

export const SaveAs: React.FunctionComponent<ContentProps> = memo(({ setFileManagerConfig, closeMainMenu }) => {
    const classes = useStyles();
    const saveProjectAs = useSaveProjectAs();
    const loadProject = useLoadProject();
    const isUpdatedConfigSaved = useRef<boolean>(true);
    const [isLoading, setLoadingStatus] = useState<boolean>(false);
    const config = useConfig();
    const { setConfig } = useConfigActions();
    const [formValues, setFormValues] = useState<SaveAsFormValues>({
        projectName: '',
        projectLocation: '',
        projectDescription: '',
        projectAuthor: '',
        projectFilename: '',
    });
    // TODO: ? set default values from current config (has prons and cons)
    // TODO: focus on name
    // TODO: better location handling
    // TODO: auto filename
    useEffect(() => {
        /** when config is set, save .cdsp file **/
        /** TODO: it should be called only after setNewConfig call, not after mount */
        let saveAndLoadConfig = async () => {
            isUpdatedConfigSaved.current = true;
            const projectPath = await saveProjectAs(formValues.projectLocation, formValues.projectFilename).catch((err) => {
                console.log(err);
            });
            if (!projectPath) return;
            // TODO: handle errors
            loadProject(projectPath);
            setLoadingStatus(false);
            closeMainMenu();
        };

        if (!isUpdatedConfigSaved.current) saveAndLoadConfig();
    }, [config]);

    const setNewConfig = () => {
        setLoadingStatus(true);
        const newConfig = Object.assign({}, config);
        newConfig.projectInfo.name = formValues.projectName;
        newConfig.projectInfo.description = formValues.projectDescription;
        newConfig.projectInfo.author = formValues.projectAuthor;
        isUpdatedConfigSaved.current = false;
        setConfig(newConfig);
    };

    let saveAs = () => setNewConfig();

    let selectProjectLocation = () =>
        setFileManagerConfig({
            maxNumberOfSelectedFiles: 1,
            selectFiles: (files: Array<string>) => setFormValue({ target: { value: files[0], name: 'projectLocation' } }),
            open: true,
            acceptableFilesExtensions: ['DIRECTORY'],
            visibleFilesExtensions: ['DIRECTORY'],
        });

    let setFormValue = (e: any) => {
        if (e.persist) e.persist();
        let additionalChangedFormValues = {};
        if (e.target.name === 'projectName' && formValues.projectFilename === '') {
            additionalChangedFormValues = {
                projectFilename: e.target.value,
            };
        }
        if (e.target.name === 'projectFilename' && formValues.projectName === '') {
            additionalChangedFormValues = {
                projectName: e.target.value,
            };
        }

        setFormValues((pvFormValues) => ({
            ...pvFormValues,
            [e.target.name]: e.target.value,
            ...additionalChangedFormValues,
        }));
    };
    return (
        <>
            <form style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ paddingBottom: '6px', fontSize: '24px' }}>Save as</div>
                <TextField label="Project name" name="projectName" value={formValues.projectName} onChange={setFormValue} />
                <TextField
                    label="Project file name"
                    name="projectFilename"
                    value={formValues.projectFilename}
                    onChange={setFormValue}
                />
                <TextField
                    label="Project location"
                    name="projectLocation"
                    value={formValues.projectLocation}
                    onChange={setFormValue}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={selectProjectLocation}>
                                    <FolderIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button style={{ padding: '3px', marginTop: '2px' }} onClick={() => saveAs()}>
                    Confirm
                </Button>
                <div style={{ paddingTop: '6px', paddingBottom: '5px', fontSize: '18px', opacity: 0.7 }}>Optional</div>
                <TextField
                    label="Project description"
                    placeholder="nlogn solve testing"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    name="projectDescription"
                    value={formValues.projectDescription}
                    onChange={setFormValue}
                />
                <TextField
                    label="Project author"
                    name="projectAuthor"
                    value={formValues.projectAuthor}
                    onChange={setFormValue}
                />
            </form>
        </>
    );
});

export default SaveAs;
