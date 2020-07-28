import React, { useState, useEffect, useRef } from 'react';
import createFragment from 'react-addons-create-fragment';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Breadcrumbs,
} from '@material-ui/core';
import {
    Edit as EditIcon,
    Home as HomeIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
} from '@material-ui/icons';
import useStyles from './Navigation.css';
import { NavigationPropsModel, NavigationStateModel } from './Navigation.d';
import { useFocus } from 'utils/tools';

export const Navigation: React.FunctionComponent<NavigationPropsModel> = ({
    currentPath,
    loadDirectory,
    currentRootDirectory,
    setRootDirectory,
}) => {
    const classes = useStyles();
    const [state, setState] = useState<NavigationStateModel>({
        historyList: [],
        newPath: null,
        isEditMode: false,
    });
    const [textFieldRef, setTextFieldFocus] = useFocus();

    useEffect(() => {
        if (state.isEditMode) setTextFieldFocus();
    }, [state.isEditMode]);

    const historyListIndex = useRef<number>(-1);

    useEffect(() => {
        if (!currentPath) return;
        if (historyList[historyListIndex.current + 1] === currentPath) ++historyListIndex.current;
        else if (historyList[historyListIndex.current] !== currentPath) {
            historyList.splice(historyListIndex.current + 1, 0, currentPath);
            ++historyListIndex.current;
        }
        setState((prevState) => ({ ...prevState, historyList: historyList }));
    }, [currentPath]);

    let historyList = Array.from(state.historyList);

    const undo = () => {
        historyListIndex.current = Math.max(0, historyListIndex.current - 1);
        loadDirectory({ path: historyList[historyListIndex.current] });
    };

    const redo = () => {
        historyListIndex.current = Math.min(historyList.length - 1, historyListIndex.current + 1);
        loadDirectory({ path: historyList[historyListIndex.current] });
    };

    const setNewPathOnTextField = (e: any) => {
        e.preventDefault();
        setState((prevState) => ({ ...prevState, newPath: e.target.value }));
    };
    const setIsEditMode = (value: boolean) => {
        setState((prevState) => ({ ...prevState, newPath: null, isEditMode: value }));
    };

    const pathTextFieldKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            setState((prevState) => ({
                ...prevState,
                isEditMode: false,
            }));
            loadDirectory({ path: e.target.value });
        }
    };

    /*        const [partitionsNamesState, setPartitionsNames] = useState<Array<string>>([]);

        useEffect(() => {
            savePartitionsNames();
        }, []);
    const savePartitionsNames = async () => {
        let partitionsNamesToSet: Array<string> = [];
        //console.log((await getPartitionsNames()).split('\n').slice(1)); ///usuń średnik i pokaż Adamowi
        (await getPartitionsNames())
            .split('\n')
            .slice(1)
            .forEach((item: string) => {
                const parsedItem = item.split(' ').join('').split('\t').join('').split('\r').join('');
                parsedItem && partitionsNamesToSet.push(parsedItem);
            });
        setPartitionsNames(partitionsNamesToSet);
    };*/
    return (
        <>
            <div className={classes.Navigation}>
                <IconButton
                    onClick={() => {
                        loadDirectory({ path: '/' });
                    }}
                    style={{ width: '48px' }}
                >
                    <HomeIcon />
                </IconButton>
                <IconButton onClick={undo} disabled={historyListIndex.current > 0 ? false : true} style={{ width: '48px' }}>
                    <ArrowBackIcon />
                </IconButton>
                {state.isEditMode ? (
                    <TextField
                        inputRef={textFieldRef}
                        onKeyDown={pathTextFieldKeyDown}
                        onBlur={() => {
                            setIsEditMode(false);
                        }}
                        inputProps={{ style: { fontSize: '15px', width: '350px' } }}
                        value={state.newPath !== null ? state.newPath : currentPath}
                        onChange={setNewPathOnTextField}
                        onFocus={(e) => {
                            e.target.select();
                        }}
                    />
                ) : (
                    <>
                        {/*<Select
                        value={currentRootDirectory}
                        onChange={(e) => {
                            e.persist();
                            loadDirectory({ path: e.target.value });
                            setRootDirectory(e.target.value);
                        }}
                    >
                        {partitionsNamesState.map((name: string) => (
                            <MenuItem key={`fileManager-parition-${name}`} value={name} style={{ maxWidth: 'min-content' }}>
                                {name}
                            </MenuItem>
                        ))}
                        {currentRootDirectory === '/' && (
                            <MenuItem value={'/'} style={{ maxWidth: 'min-content' }}>
                                /
                            </MenuItem>
                        )}
                        </Select>*/}
                        <Breadcrumbs style={{ display: 'inline-block', minWidth: '300px' }} aria-label="breadcrumb">
                            {currentPath
                                .split('/')
                                //.slice(Number(currentRootDirectory !== '/'))
                                .reduce(
                                    (valIn: Array<string | null | React.ReactFragment>, val) => {
                                        let onPath = valIn[0];
                                        if (val)
                                            return [
                                                onPath + val + '/',
                                                createFragment({
                                                    a: valIn[1],
                                                    b: (
                                                        <Button
                                                            onClick={() => {
                                                                loadDirectory({ path: onPath + val + '/' });
                                                            }}
                                                        >
                                                            {val}
                                                        </Button>
                                                    ),
                                                }),
                                            ];
                                        else return [onPath + val + '/', valIn[1]];
                                    },
                                    ['', null]
                                )}
                        </Breadcrumbs>
                        <IconButton
                            onClick={() => {
                                setIsEditMode(true);
                            }}
                            style={{ width: '48px' }}
                        >
                            <EditIcon />
                        </IconButton>
                    </>
                )}
                <IconButton
                    onClick={redo}
                    disabled={historyListIndex.current < historyList.length - 1 ? false : true}
                    style={{ width: '48px' }}
                >
                    <ArrowForwardIcon />
                </IconButton>
            </div>
        </>
    );
};

export default Navigation;
