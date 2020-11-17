import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import useStyles from './SelectedList.css';
import { SelectedListPropsModel, SelectedListStateModel } from './SelectedList.d';
import { AutoSizer, List } from 'react-virtualized';
export const SelectedList: React.FunctionComponent<SelectedListPropsModel> = ({ selectedFiles, loadDirectory }) => {
    const classes = useStyles();
    const [selectedFilesPaths, setSelectedFilesPaths] = useState<Array<string>>([]);

    let renderRow = ({ index, key, style }: { index: number; key: string; style: any }) => {
        return (
            <div key={key} style={style} className={classes.ButtonContainer}>
                <Button
                    classes={{ label: classes.ButtonLabel, root: classes.ButtonRoot }}
                    onClick={() => {
                        loadDirectory({ path: selectedFilesPaths[index].split('/').slice(0,-1).join('/') });
                    }}
                >
                    {selectedFilesPaths[index]}
                </Button>
            </div>
        );
    }; //min: 0.5 max 3 step 0.1
    useEffect(() => {
        setSelectedFilesPaths([...selectedFiles.keys()]);
    }, [selectedFiles]);

    return (
        <>
            <div className={classes.SelectedList}>
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            rowRenderer={renderRow}
                            width={width}
                            height={height}
                            rowCount={selectedFilesPaths.length}
                            rowHeight={30}
                            overscanRowCount={10}
                        ></List>
                    )}
                </AutoSizer>
            </div>
        </>
    );
};

export default SelectedList;
