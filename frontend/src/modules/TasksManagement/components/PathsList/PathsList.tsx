import React from 'react';
import useStyles from './PathsList.css';
import { PathsListPropsModel, PathsListStateModel } from './PathsList.d';
import { List, AutoSizer } from 'react-virtualized';

export const PathsList: React.FunctionComponent<PathsListPropsModel> = ({ paths }) => {
    const classes = useStyles();
    // TODO: search and deletion from selected files list
    const renderRow = ({ index, key, style }: { index: number; key: string; style: any }, sourceArray: Array<string>) => {
        console.log(index,sourceArray)
        return (
            <div key={key} style={style} className={classes.pathRow}>
                {/*// TODO: do it better way */}
                {sourceArray[index].substr(sourceArray[index].lastIndexOf('/') + 1)}
            </div>
        );
    };
    return (
        <>
            <div className={classes.PathsList}>
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            rowRenderer={(props) => renderRow(props, paths)}
                            width={width}
                            height={height}
                            rowCount={paths ? paths.length : 0}
                            rowHeight={50}
                        ></List>
                    )}
                </AutoSizer>
            </div>
        </>
    );
};

export default PathsList;
