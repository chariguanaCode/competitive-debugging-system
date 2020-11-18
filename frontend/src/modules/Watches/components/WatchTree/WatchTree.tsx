import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import { Watch, Watchblock, WatchNodeData } from 'reduxState/models';
import WatchNode from '../WatchNode';
import useStyles from './WatchTree.css';

interface Props {
    data: Watchblock;
}

function WatchTree({ data }: Props): ReactElement {
    const bracketState = useRef<{ [key: string]: boolean }>({});

    const convertWatches = () => {
        const newRows: Array<WatchNodeData> = [];
        let depth = 0;

        const recurrentTraversal = (element: Watchblock | Watch, idPrefix: string) => {
            const id =
                `${idPrefix}.${element.call_id}` +
                `[${element.type !== 'watchblock' ? element.variable_id || element.name : ''}]`;

            let indentDepth = 4;

            if (element.type === 'watchblock') {
                newRows.push({
                    ...element,
                    id,
                    depth,
                    bracketState: bracketState.current[id],
                });
            } else {
                if (element.line && element.variable_id !== 0) depth += (element.line || '').length + 2;
                newRows.push({
                    ...element,
                    id,
                    depth,
                    bracketState: bracketState.current[id],
                });
                if (element.line && element.variable_id === 0) depth += (element.line || '').length + 2;
            }

            if (
                element.type === 'array' ||
                element.type === 'struct' ||
                element.type === 'pair' ||
                element.type === 'watchblock'
            ) {
                if (bracketState.current[id] === undefined) bracketState.current[id] = true;
                if (bracketState.current[id]) {
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
            if (element.type !== 'watchblock' && element.line) depth -= (element.line || '').length + 2;
        };

        if (data.children[0]) recurrentTraversal(data.children[0], '0');

        return newRows;
    };

    const classes = useStyles();
    const [rowList, setRowList] = useState(convertWatches());

    useEffect(() => {
        setRowList(convertWatches());
    }, [data]);

    const setBracketState = (id: string, value: boolean) => {
        bracketState.current[id] = value;
        setRowList(convertWatches());
    };

    return (
        <AutoSizer>
            {({ width, height }) => (
                <List
                    height={height}
                    width={width}
                    rowHeight={19}
                    rowCount={rowList.length}
                    rowRenderer={({ index, key, style }) => {
                        return <WatchNode style={style} key={key} node={rowList[index]} setBracketState={setBracketState} />;
                    }}
                />
            )}
        </AutoSizer>
    );
}

export default WatchTree;
