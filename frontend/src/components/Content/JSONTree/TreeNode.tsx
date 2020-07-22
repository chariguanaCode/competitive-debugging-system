import React, { ReactElement } from 'react';
import { useTheme } from '@material-ui/core';
import { WatchBlockOptions } from '@material-ui/core/styles/createPalette';
import { Watchblock, Watch } from 'reduxState/models';

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

    const { line, name } = data;
    const getContents = () => {
        const result = {
            onClick: () => {},
            body: [] as ReactElement[],
        };

        let open = false;
        if (data.type === 'watchblock' || data.type === 'array' || data.type === 'struct' || data.type === 'pair') {
            open = data.state?.expanded;
            result.onClick = () =>
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
        }

        if (data.type === 'closing') {
            result.body.push(<>{colored({ [data.closingType]: bracketMap[data.closingType][1] })}</>);
            return result;
        }

        if (data.type === 'watchblock') {
            result.body.push(
                <>
                    {colored({ line })}: {colored({ name })} ={' '}
                </>
            );
        } else if (!line && !data.data_type) {
            result.body.push(<>{colored({ array: name })} : </>);
        } else {
            result.body.push(
                <>
                    {colored({ line })}: {colored({ name })} ={' '}
                </>
            );
        }

        if (data.type !== 'watchblock' && data.pointer) {
            result.body.push(<>{colored({ pointer: '*' })}</>);
        }

        if (data.type === 'string') {
            result.body.push(<>{colored({ string: `"${data.value}"` })}</>);
        }

        if (data.type === 'bitset') {
            result.body.push(<>{colored({ bitset: `${data.value}` })}</>);
        }

        if (data.type === 'number') {
            result.body.push(<>{colored({ number: data.value })}</>);
        }

        if (data.type === 'array' || data.type === 'struct' || data.type === 'pair' || data.type === 'watchblock') {
            result.body.push(
                open && data.children.length - 1 ? (
                    <>{colored({ [data.type]: bracketMap[data.type][0] })}</>
                ) : (
                    <>
                        {colored({ [data.type]: bracketMap[data.type][0] })} {data.children.length - 1}{' '}
                        {colored({ [data.type]: bracketMap[data.type][1] })}
                    </>
                )
            );
        }

        return result;
    };

    const clickable = () => {
        if (data.type === 'array' || data.type === 'struct' || data.type === 'pair' || data.type === 'watchblock') {
            return data.children.length - 1 !== 0;
        }
        return false;
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
                cursor: clickable() ? 'pointer' : 'auto',
            }}
            onClick={contents.onClick}
        >
            {contents.body}
        </div>
    );
});
