import React, { ReactElement } from 'react';
import useStyles from './WatchNode.css';
import { useTheme } from '@material-ui/core';
import { WatchBlockOptions } from '@material-ui/core/styles/createPalette';
import { WatchNodeData } from 'reduxState/models';
import { useWatchHistoryLocation } from 'reduxState/selectors';
import { useWatchActionsHistoryActions } from 'reduxState/actions';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';

interface Props {
    node: WatchNodeData;
    style: React.CSSProperties;
    setBracketState: (id: string, value: boolean) => void;
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

function WatchNode({ node, style, setBracketState }: Props): ReactElement {
    const { setWatchHistoryLocation } = useWatchActionsHistoryActions();
    const classes = useStyles();
    const theme = useTheme();

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
        if (node.type === 'array' || node.type === 'struct' || node.type === 'pair' || node.type === 'watchblock') {
            return node.children.length - 1 !== 0;
        }
        return false;
    };

    const selected = useWatchHistoryLocation() === node.call_id;
    const selectable = node.call_id !== undefined;
    const selectTracking = () => {
        setWatchHistoryLocation(node.call_id);
    };

    const { line, name } = node;
    const getContents = () => {
        const result = [] as ReactElement[];

        let open = false;
        if (node.type === 'watchblock' || node.type === 'array' || node.type === 'struct' || node.type === 'pair') {
            open = node.bracketState || false;
        }

        if (node.type === 'closing') {
            result.push(<>{colored({ [node.closingType]: bracketMap[node.closingType][1] })}</>);
            return result;
        }

        if (line !== undefined) {
            if (node.type === 'watchblock' || node.variable_id === 0) {
                result.push(
                    <span>
                        {colored({ line })}: {colored({ name })}
                        {' = '}
                    </span>
                );
            } else {
                result.push(
                    <span>
                        {colored({ name })}
                        {' = '}
                    </span>
                );
            }
        } else {
            result.push(<>{colored({ array: name })} : </>);
        }

        if (node.type !== 'watchblock' && node.pointer) result.push(<>{colored({ pointer: '*' })}</>);

        if (node.type === 'string') result.push(<>{colored({ string: `"${node.value}"` })}</>);
        if (node.type === 'bitset') result.push(<>{colored({ bitset: `${node.value}` })}</>);
        if (node.type === 'number') result.push(<>{colored({ number: node.value })}</>);

        if (node.type === 'array' || node.type === 'struct' || node.type === 'pair' || node.type === 'watchblock') {
            const toggleExpand = () => {
                setBracketState(node.id, !node.bracketState);
            };

            result.push(
                <span onClick={toggleExpand} style={{ cursor: expandable() ? 'pointer' : 'auto' }}>
                    {open && node.children.length - 1 ? (
                        <>
                            <ArrowDropDown viewBox="4 4 13 13" fontSize="inherit" className={classes.bracketArrow} />{' '}
                            {colored({ [node.type]: bracketMap[node.type][0] })}
                        </>
                    ) : (
                        <>
                            <ArrowRight viewBox="4 4 13 13" fontSize="inherit" className={classes.bracketArrow} />{' '}
                            {colored({ [node.type]: bracketMap[node.type][0] })} {node.children.length - 1}{' '}
                            {colored({ [node.type]: bracketMap[node.type][1] })}
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
                ...style,
                paddingLeft: 8.555 * node.depth,

                minWidth: '100%',
                backgroundColor: selected ? theme.palette.watchblocks.selected : 'transparent',
            }}
            className={classes.node}
            onClick={selectable ? selectTracking : () => {}}
        >
            {contents}
        </div>
    );
}

export default React.memo(WatchNode);
