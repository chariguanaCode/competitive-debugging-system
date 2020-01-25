import React, { ReactElement, useState } from 'react'
import { useTheme } from '@material-ui/core'
import { WatchBlockOptions } from '@material-ui/core/styles/createPalette'

interface Props {
    data: any,
}

interface ColoredProps {
    type: keyof WatchBlockOptions,
    children: ReactElement[],
}

function Colored({ type, children }: ColoredProps): ReactElement {
    const theme = useTheme()
    return (
        <span 
            style={{
                color: theme.palette.watchblocks[type]

            }}
        >
            {children}
        </span>
    )
}

export default function TreeNode({ data }: Props): ReactElement {
    const [ open, setOpen ] = useState(true)
    const { name, line, type, children, value, data_type, pointer } = data

    let childCount: number = 0

    if (type === "watchblock") childCount = Object.keys(children).length;
    if (type === "array")      childCount = value.length;
    if (type === "struct")     childCount = value.length;
    if (type === "pair")       childCount = 2;

    const colored = (val: any) => {
        const [ type, content ]: [ keyof WatchBlockOptions, ReactElement[] ] = Object.entries(val)[0] as any
        return <Colored type={type}>{content}</Colored>
    }

    const getLabelPrefix = () => {
        if (type === "watchblock") {
            return (<>{colored({ line })}: {colored({ name })} = </>)
        }

        if (!line && !data_type) {
            return <>{colored({ array: name })} : </>
        }

        return (<>{colored({ line })}: {colored({ data_type })} {colored({ name })} = </>)
    }

    const getLabel = () => {
        switch (type) {
            case "watchblock":
                return (open && childCount) ? 
                    [ <>{colored({ watchblock: '{' })}</>, <>{colored({ watchblock: '}' })}</> ] : 
                    [ <>{colored({ watchblock: '{' })} {childCount} {colored({ watchblock: '}' })}</>, '' ]

            case "array":
                return (open && childCount) ? 
                    [ <>{colored({ array: '[' })}</>, <>{colored({ array: ']' })}</> ] : 
                    [ <>{colored({ array: '[' })} {childCount} {colored({ array: ']' })}</>, '' ]

            case "struct":
                return (open && childCount) ? 
                    [ <>{colored({ array: '{' })}</>, <>{colored({ array: '}' })}</> ] : 
                    [ <>{colored({ array: '{' })} {childCount} {colored({ array: '}' })}</>, '' ]

            case "pair":
                return (open) ? 
                    [ <>{colored({ pair: '(' })}</>, <>{colored({ pair: ')' })}</> ] : 
                    [ <>{colored({ pair: '(' })} {colored({ pair: ')' })}</>, '' ]

            case "string":
                return [ <>{colored({ string: `"${value}"` })}</>, '' ]

            case "bitset":
                return [ <>{colored({ bitset: `${value}` })}</>, '' ]

            case "number":
                return [ <>{colored({ number: value })}</>, '' ]

            default:
                return [ `${value}`, '' ]
        }
    }

    const getContent = () => {
        if (type === "watchblock") {
            return (
                <>
                    {Object.entries(data.children).map(([ id, val ]: any[]) => (
                        <TreeNode 
                            key={id} 
                            data={val} 
                        />
                    ))}
                </>
            )
        }

        if (type === "array") {
            return (
                <>
                    {data.value.map((val: any, id: number) => (
                        <TreeNode 
                            key={id} 
                            data={{ ...val, name: id }} 
                        />
                    ))}
                </>
            )
        }

        if (type === "struct") {
            return (
                <>
                    {data.value.map((val: any, id: number) => (
                        <TreeNode 
                            key={id} 
                            data={val} 
                        />
                    ))}
                </>
            )
        }

        if (type === "pair") {
            return (
                <>
                    <TreeNode 
                        data={data.value.first} 
                    />
                    <TreeNode 
                        data={data.value.second} 
                    />
                </>
            )
        }

        return null
    }

    return (
        <div>
            <div 
                style={{ 
                    width: "100%", 
                    wordSpacing: 4 
                }}
                onClick={() => setOpen((prev) => !prev)}
            >
                {getLabelPrefix()}{(pointer) && colored({ pointer: '*' })}{getLabel()[0]}
            </div>
            {(open && childCount !== 0) && 
                <>
                    <div style={{ paddingLeft: 32 }}>
                        {getContent()}
                    </div>
                    <span>{getLabel()[1]}</span>
                </>
            }
        </div>
    )
}
