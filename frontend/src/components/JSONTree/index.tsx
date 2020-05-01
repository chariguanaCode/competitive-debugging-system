import React, { ReactElement } from 'react';
import TreeNode from './TreeNode';
import Tree from 'react-virtualized-tree';

interface Props {
    data: any;
    updateData: (newData: any) => void;
}

export default function JSONTree({ data, updateData }: Props): ReactElement {
    return (
        <div style={{ flex: '1 1 auto' }}>
            <Tree nodes={data} onChange={updateData}>
                {({ node, style, onChange, ...rest }) => {
                    return <TreeNode style={style} node={node} onChange={onChange} />;
                }}
            </Tree>
        </div>
    );
}
