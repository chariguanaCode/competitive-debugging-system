import React, { ReactElement } from 'react';
import { useTheme } from '@material-ui/core';
import { WatchBlockOptions } from '@material-ui/core/styles/createPalette';
import { Watchblock, Watch } from 'reduxState/models';
import { useWatchHistoryLocation } from 'reduxState/selectors';
import { useWatchActionsHistoryActions } from 'reduxState/actions';

interface Props {
    node: any;
    style: React.CSSProperties;
    onChange: (newNodes: any) => void;
}

interface ColoredProps {
    type: keyof WatchBlockOptions;
    children: ReactElement[];
}

function Colored({ type, children }: ColoredProps): ReactElement {
    const theme = useTheme();
    return (
        <span
            style={{
                color: theme.palette.watchblocks[type],
            }}
        >
            {children}
        </span>
    );
}

export default React.memo(function TreeNode({ node, style, onChange }: Props): ReactElement {
    const { setWatchHistoryLocation } = useWatchActionsHistoryActions();
    const theme = useTheme();

    const data = node as Watchblock | Watch;

    const colored = (val: { [key in keyof WatchBlockOptions]: any }) => {
        const [type, content] = Object.entries(val)[0] as [keyof WatchBlockOptions, any];
        return <Colored type={type}>{content}</Colored>;
    };

    const bracketMap = {
        watchblock: ['{', '}'],
        array: ['[', ']'],
        struct: ['{', '}'],
        pair: ['(', ')'],
    };

    const expandable = () => {
        if (data.type === 'array' || data.type === 'struct' || data.type === 'pair' || data.type === 'watchblock') {
            return data.children.length - 1 !== 0;
        }
        return false;
    };

    const selected = useWatchHistoryLocation() === data.id;
    const selectable = data.line !== undefined;
    const selectTracking = () => {
        setWatchHistoryLocation(data.id);
    };

    const { line, name } = data;
    const getContents = () => {
        const result = [] as ReactElement[];

        let open = false;
        if (data.type === 'watchblock' || data.type === 'array' || data.type === 'struct' || data.type === 'pair') {
            open = data.state?.expanded;
        }

        if (data.type === 'closing') {
            result.push(<>{colored({ [data.closingType]: bracketMap[data.closingType][1] })}</>);
            return result;
        }

        if (line !== undefined) {
            result.push(
                <span style={{ cursor: 'pointer' }}>
                    {colored({ line })}: {colored({ name })} ={' '}
                </span>
            );
        } else {
            result.push(<>{colored({ array: name })} : </>);
        }

        if (data.type !== 'watchblock' && data.pointer) result.push(<>{colored({ pointer: '*' })}</>);

        if (data.type === 'string') result.push(<>{colored({ string: `"${data.value}"` })}</>);
        if (data.type === 'bitset') result.push(<>{colored({ bitset: `${data.value}` })}</>);
        if (data.type === 'number') result.push(<>{colored({ number: data.value })}</>);

        if (data.type === 'array' || data.type === 'struct' || data.type === 'pair' || data.type === 'watchblock') {
            const toggleExpand = () =>
                onChange({
                    node: {
                        ...data,
                        state: {
                            ...data.state,
                            expanded: !open,
                        },
                    },
                    type: 2,
                });

            result.push(
                <span onClick={toggleExpand} style={{ cursor: expandable() ? 'pointer' : 'auto' }}>
                    {open && data.children.length - 1 ? (
                        <>{colored({ [data.type]: bracketMap[data.type][0] })}</>
                    ) : (
                        <>
                            {colored({ [data.type]: bracketMap[data.type][0] })} {data.children.length - 1}{' '}
                            {colored({ [data.type]: bracketMap[data.type][1] })}
                        </>
                    )}
                </span>
            );
        }

        return result;
    };

    const contents = getContents();
    return (
        <div
            style={{
                position: style.position,
                height: style.height,
                left: style.left,
                top: style.top,
                marginLeft: style.marginLeft,

                wordSpacing: 4,
                transform: `translate(${data.type === 'closing' ? -30 : 0}px)`,
                minWidth: '100%',
                backgroundColor: selected ? theme.palette.watchblocks.selected : 'transparent',
            }}
            onClick={selectable ? selectTracking : () => {}}
        >
            {contents}
        </div>
    );
});
