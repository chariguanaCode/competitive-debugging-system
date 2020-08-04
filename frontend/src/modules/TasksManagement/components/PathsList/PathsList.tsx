import React from 'react';
import useStyles from './PathsList.css';
import { PathsListPropsModel, PathsListStateModel } from './PathsList.d';
import { List, AutoSizer } from 'react-virtualized';

export const PathsList: React.FunctionComponent<PathsListPropsModel> = ({ paths, title }) => {
    const classes = useStyles();
    // TODO: search and deletion from selected files list
    const renderRow = ({ index, key, style }: { index: number; key: string; style: any }, sourceArray: typeof paths) => {
        return (
            <div key={key} style={style} className={classes.pathRow}>
                {/*// TODO: do it better way */}
                {sourceArray[index].name}
            </div>
        );
    };
    return (
        <>
            <div className={classes.PathsList}>
                <div className={classes.pathsListTitle}>{title}</div>
                <div className={classes.pathsListContainer}>
                    <AutoSizer>
                        {({ width, height }) => (
                            <List
                                rowRenderer={(props) => renderRow(props, paths)}
                                width={width}
                                height={height}
                                rowCount={paths ? paths.length : 0}
                                rowHeight={20}
                            ></List>
                        )}
                    </AutoSizer>
                </div>
            </div>
        </>
    );
};

export default PathsList;
