import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import { Watch, Watchblock, WatchNodeData } from 'reduxState/models';
import { useWatchHistoryLocation, useWatchIdActions } from 'reduxState/selectors';
import { useWatchActionsHistoryActions } from 'reduxState/actions';
import WatchNode from '../WatchNode';
import useStyles from './WatchTree.css';

interface Props {
    data: Watchblock;
}

function WatchTree({ data }: Props): ReactElement {
    const classes = useStyles();

    const { setWatchHistoryLocation } = useWatchActionsHistoryActions();
    const watchHistoryLocation = useWatchHistoryLocation();
    const watchIdActions = useWatchIdActions();

    const bracketState = useRef<{ [key: string]: boolean }>({});
    const callIdOverviews = useRef<{ [key: string]: { type: 'watch' | 'watchblock'; names: string[] } }>({});
    const [rowList, setRowList] = useState<Array<WatchNodeData>>([]);

    const convertWatches = () => {
        const newRows: Array<WatchNodeData> = [];
        callIdOverviews.current = {};
        let depth = 0;

        const recurrentTraversal = (element: Watchblock | Watch, idPrefix: string) => {
            const id =
                `${idPrefix}.${element.call_id}` +
                `[${element.type !== 'watchblock' ? element.variable_id || element.name : ''}]`;

            if (element.type === 'watchblock' || element.variable_id !== undefined)
                if (!(element.call_id in callIdOverviews.current)) {
                    callIdOverviews.current[element.call_id] = {
                        type: element.type === 'watchblock' ? 'watchblock' : 'watch',
                        names: [element.name],
                    };
                } else {
                    callIdOverviews.current[element.call_id].names.push(element.name);
                }

            let indentDepth = 4;

            if (
                (element.type === 'array' ||
                    element.type === 'struct' ||
                    element.type === 'pair' ||
                    element.type === 'watchblock') &&
                !(id in bracketState.current)
            ) {
                bracketState.current[id] = true;
            }

            if (element.type === 'watchblock') {
                newRows.push({
                    ...element,
                    id,
                    depth,
                    bracketState: bracketState.current[id],
                });
            } else {
                if (element.line && element.variable_id !== 0) depth += (element.line || '').length + 1;
                newRows.push({
                    ...element,
                    id,
                    depth,
                    bracketState: bracketState.current[id],
                });
                if (element.line && element.variable_id === 0) depth += (element.line || '').length + 1;
            }

            if (
                element.type === 'array' ||
                element.type === 'struct' ||
                element.type === 'pair' ||
                element.type === 'watchblock'
            ) {
                if (bracketState.current[id] && element.children.length !== 0) {
                    depth += indentDepth;
                    for (let i = 0; i < element.children.length; i++) {
                        recurrentTraversal(element.children[i] as Watch, id);
                    }
                    depth -= indentDepth;
                    newRows.push({
                        call_id: element.call_id,
                        id,
                        depth,
                        variable_id: -1,
                        name: '',
                        line: '-1',
                        type: 'closing',
                        config: '',
                        data_type: '',
                        closingType: element.type,
                    });
                }
            }
            if (element.type !== 'watchblock' && element.line) depth -= (element.line || '').length + 1;
        };

        if (data.children[0]) recurrentTraversal(data.children[0], '0');

        setRowList(newRows);
    };

    useEffect(() => {
        convertWatches();
    }, [data]);

    const setBracketState = (id: string, value: boolean) => {
        bracketState.current[id] = value;
        convertWatches();
    };

    return (
        <>
            {data.children[0] ? (
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            height={height}
                            width={width}
                            rowHeight={19}
                            rowCount={rowList.length}
                            rowRenderer={({ index, key, style }) => (
                                <WatchNode
                                    style={style}
                                    key={key}
                                    setBracketState={setBracketState}
                                    setWatchHistoryLocation={setWatchHistoryLocation}
                                    node={rowList[index]}
                                    selected={watchHistoryLocation === rowList[index].call_id}
                                    actions={watchIdActions[rowList[index].cds_id || ''] || []}
                                    callIdOverview={callIdOverviews.current[rowList[index].call_id]}
                                />
                            )}
                        />
                    )}
                </AutoSizer>
            ) : (
                'Loading...'
            )}
        </>
    );
}

export default WatchTree;
