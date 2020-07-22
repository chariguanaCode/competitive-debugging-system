import React, { memo, useEffect, useRef, useState } from 'react';
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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import EditIcon from '@material-ui/icons/Edit';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import { getPartitionsNames } from '../../backend/filesHandlingFunctions';
import { useFocus } from '../../utils/tools';
import { MainToolbarProps, MainToolbarState } from './Types';
import useStyles from './MainToolbarStyles';

const arePropsEqual = (prevProps: MainToolbarProps, nextProps: MainToolbarProps) => {
    return prevProps.currentPath === nextProps.currentPath;
};

export const MainToolbar: React.FunctionComponent<MainToolbarProps> = memo(
    ({ loadDirectory, currentPath, setRootDirectory, currentRootDirectory }) => {
        const [state, setState] = useState<MainToolbarState>({
            newPath: null,
            historyList: [],
            fieldMode: false,
        });
        const [partitionsNamesState, setPartitionsNames] = useState<Array<string>>([]);
        const [searchFieldAutoSearch, changeSearchFieldAutoSearch] = useState<boolean>(true);
        const [searchFieldText, updateSearchFieldText] = useState<string>('');
        //const [fieldMode, updateFieldMode] = useState<boolean>(false)
        const [textFieldRef, setTextFieldFocus] = useFocus();
        let historyListIndex = useRef<number>(-1);
        let historyList = Array.from(state.historyList);

        useEffect(() => {
            savePartitionsNames();
        }, []);

        useEffect(() => {
            if (!currentPath) return;
            if (historyList[historyListIndex.current + 1] === currentPath) ++historyListIndex.current;
            else if (historyList[historyListIndex.current] !== currentPath) {
                historyList.splice(historyListIndex.current + 1, 0, currentPath);
                ++historyListIndex.current;
            }
            setState((prevState) => ({ ...prevState, historyList: historyList }));
        }, [currentPath]);

        const savePartitionsNames = async () => {
            let partitionsNamesToSet: Array<string> = [];
            console.log((await getPartitionsNames()).split('\n').slice(1)); ///usuń średnik i pokaż Adamowi
            (await getPartitionsNames())
                .split('\n')
                .slice(1)
                .forEach((item: string) => {
                    const parsedItem = item
                        .split(' ')
                        .join('')
                        .split('\t')
                        .join('')
                        .split('\r')
                        .join('');
                    parsedItem && partitionsNamesToSet.push(parsedItem);
                });
            setPartitionsNames(partitionsNamesToSet);
        };

        const updateFieldMode = (val: boolean) => {
            //updateFieldMode(val);
            setState((prevState) => ({
                ...prevState,
                fieldMode: val,
                newPath: null,
            }));
        };

        const undo = () => {
            historyListIndex.current = Math.max(0, historyListIndex.current - 1);
            loadDirectory(historyList[historyListIndex.current]);
        };

        const redo = () => {
            historyListIndex.current = Math.min(historyList.length - 1, historyListIndex.current + 1);
            loadDirectory(historyList[historyListIndex.current]);
        };

        useEffect(() => {
            //@ts-ignore
            if (state.fieldMode) setTextFieldFocus();
        }, [state.fieldMode]);

        const setPathFromField = (e: any) => {
            e.preventDefault();
            loadDirectory(e.target.value);
        };

        const searchFromSearchField = (regexForce?: string) => {
            loadDirectory(currentPath, regexForce || regexForce === '' ? regexForce : searchFieldText);
        };

        const searchTextFieldKeyDown = (e: any) => {
            if (e.keyCode === 13) searchFromSearchField();
        };

        const pathTextFieldKeyDown = (e: any) => {
            if (e.keyCode === 13) {
                setState((prevState) => ({
                    ...prevState,
                    fieldMode: false,
                }));
                //updateFieldMode(false);
                setPathFromField(e);
            }
        };

        const updateTextOnTextField = (e: any) => {
            e.preventDefault();
            let val = e.target.value;
            setState((prevState) => ({ ...prevState, newPath: val }));
        };
        const classes = useStyles();
        return (
            <>
                <div className={classes.navigation}>
                    <IconButton
                        onClick={() => {
                            loadDirectory('/');
                        }}
                        style={{ width: '48px' }}
                    >
                        <HomeIcon />
                    </IconButton>
                    <IconButton onClick={undo} disabled={historyListIndex.current > 0 ? false : true} style={{ width: '48px' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    {state.fieldMode ? (
                        <TextField
                            inputRef={textFieldRef}
                            onKeyDown={pathTextFieldKeyDown}
                            onBlur={() => {
                                updateFieldMode(false);
                            }}
                            inputProps={{ style: { fontSize: '15px', width: '350px' } }}
                            value={state.newPath !== null ? state.newPath : currentPath}
                            onChange={updateTextOnTextField}
                            onFocus={(e) => {
                                e.target.select();
                            }}
                        />
                    ) : (
                        <>
                            <Select
                                value={currentRootDirectory}
                                onChange={(e) => {
                                    e.persist();
                                    loadDirectory(e.target.value);
                                    setRootDirectory(e.target.value);
                                }}
                            >
                                {partitionsNamesState.map((name) => (
                                    <MenuItem
                                        key={`fileManager-parition-${name}`}
                                        value={name}
                                        style={{ maxWidth: 'min-content' }}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                                {currentRootDirectory === '/' && (
                                    <MenuItem value={'/'} style={{ maxWidth: 'min-content' }}>
                                        /
                                    </MenuItem>
                                )}
                            </Select>
                            <Breadcrumbs style={{ display: 'inline-block', minWidth: '300px' }} aria-label="breadcrumb">
                                {currentPath
                                    .split('/')
                                    .slice(Number(currentRootDirectory !== '/'))
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
                                                                    loadDirectory(onPath + val + '/');
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
                        </>
                    )}
                    <IconButton
                        onClick={() => {
                            updateFieldMode(true);
                        }}
                        style={{ width: '48px  ' }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={redo}
                        disabled={historyListIndex.current < historyList.length - 1 ? false : true}
                        style={{ width: '48px' }}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                    <FormControl style={{ position: 'absolute', right: '10px', display: 'flex', flexDirection: 'row' }}>
                        <TextField
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                searchFromSearchField();
                                            }}
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            onKeyDown={searchTextFieldKeyDown}
                            onBlur={() => {
                                updateFieldMode(false);
                            }}
                            inputProps={{ style: { fontSize: '15px', width: '150px' } }}
                            value={searchFieldText}
                            onChange={(e) => {
                                e.persist();
                                if (searchFieldAutoSearch) searchFromSearchField(e.target.value);
                                updateSearchFieldText(e.target.value);
                            }}
                            onFocus={(e) => {
                                e.target.select();
                            }}
                        />
                        <FormControlLabel
                            style={{ paddingLeft: '10px' }}
                            control={
                                <Checkbox
                                    color="default"
                                    classes={{ root: classes.checkboxRoot, checked: classes.checkboxChecked }}
                                    checked={searchFieldAutoSearch}
                                    onChange={(e) => {
                                        e.persist();
                                        changeSearchFieldAutoSearch(e.target.checked);
                                    }}
                                />
                            }
                            label={<span style={{ fontSize: '15px' }}>autosearch</span>}
                        />
                    </FormControl>
                </div>
            </>
        );
    },
    arePropsEqual
);

export default MainToolbar;
/*<div style = {{position: "absolute", left: "10px"}}>
    { partitionsNamesState.map(name => (
        <Button style = {{maxWidth: "min-content"}} onClick = {()=>{ 
            loadDirectory(name);
            SetRootDirectory(name);
        }}>{name}</Button>
    ))}
</div>
*/
