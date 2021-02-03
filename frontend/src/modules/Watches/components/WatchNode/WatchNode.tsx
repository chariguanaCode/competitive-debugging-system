import React, { ReactElement, useState } from 'react';
import useStyles from './WatchNode.css';
import { WatchNodePropsModel } from './WatchNode.d';
import { Tooltip, useTheme } from '@material-ui/core';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import WatchActionDialog from '../WatchActionDialog';
import { colored } from '../ColoredText';

function WatchNode({
    node,
    selected,
    actions,
    callIdOverview,
    style,
    setBracketState,
    setWatchHistoryLocation,
}: WatchNodePropsModel): ReactElement {
    const classes = useStyles();
    const theme = useTheme();
    const [actionDialogAnchor, setActionDialogAnchor] = useState<null | (HTMLDivElement & EventTarget)>(null);

    const bracketMap = {
        watchblock: ['{', '}'],
        array: ['[', ']'],
        struct: ['{', '}'],
        pair: ['(', ')'],
    };

    const expandable =
        (node.type === 'array' || node.type === 'struct' || node.type === 'pair' || node.type === 'watchblock') &&
        node.children.length !== 0;

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
            result.push(colored({ [node.closingType]: bracketMap[node.closingType][1] }, '0'));
            return result;
        }

        if (line !== undefined) {
            if (node.type === 'watchblock' || node.variable_id === 0) {
                result.push(
                    <span key="-1">
                        {colored({ line })}
                        {':'}
                    </span>
                );
            }
            result.push(
                <React.Fragment key="0">
                    <Tooltip
                        title={
                            node.cds_id
                                ? actions.length > 0
                                    ? `${actions.length} action${actions.length > 1 ? 's' : ''} assigned`
                                    : 'No actions assigned'
                                : 'No cupl::id, unable to add actions'
                        }
                    >
                        <div
                            className={classes.actionIndicator}
                            style={{
                                backgroundColor: node.cds_id
                                    ? actions.length > 0
                                        ? theme.palette.watchblocks.hasActions
                                        : theme.palette.watchblocks.noActions
                                    : theme.palette.watchblocks.noCdsId,
                                cursor: node.cds_id ? 'pointer' : 'auto',
                            }}
                            onClick={(evt) => {
                                evt.stopPropagation();
                                setActionDialogAnchor(evt.currentTarget);
                            }}
                        />
                    </Tooltip>
                    {node.cds_id && actionDialogAnchor && (
                        <WatchActionDialog
                            actions={actions}
                            callIdOverview={callIdOverview}
                            cds_id={node.cds_id}
                            anchor={actionDialogAnchor}
                            onClose={() => setActionDialogAnchor(null)}
                        />
                    )}
                </React.Fragment>
            );
            result.push(
                <span key="1">
                    {colored({ name })}
                    {' = '}
                </span>
            );
        } else {
            result.push(<React.Fragment key="1">{colored({ array: name })} : </React.Fragment>);
        }

        if (node.type !== 'watchblock' && node.pointer) result.push(colored({ pointer: '*' }, '2'));

        if (node.type === 'string') result.push(colored({ string: `"${node.value}"` }, '3'));
        if (node.type === 'bitset') result.push(colored({ bitset: `${node.value}` }, '3'));
        if (node.type === 'number') result.push(colored({ number: node.value }, '3'));

        if (node.type === 'array' || node.type === 'struct' || node.type === 'pair' || node.type === 'watchblock') {
            const toggleExpand = () => {
                setBracketState(node.id, !node.bracketState);
            };

            result.push(
                <span key="4" onClick={toggleExpand} style={{ cursor: expandable ? 'pointer' : 'auto' }}>
                    {open && node.children.length ? (
                        <>
                            <ArrowDropDown viewBox="4 4 13 13" fontSize="inherit" className={classes.bracketArrow} />{' '}
                            {colored({ [node.type]: bracketMap[node.type][0] }, '5')}
                        </>
                    ) : (
                        <>
                            <ArrowRight viewBox="4 4 13 13" fontSize="inherit" className={classes.bracketArrow} />{' '}
                            {colored({ [node.type]: bracketMap[node.type][0] }, '5')} {node.children.length}{' '}
                            {colored({ [node.type]: bracketMap[node.type][1] }, '6')}
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
