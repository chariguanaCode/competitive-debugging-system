import React from 'react';
import { WatchBlockOptions } from '@material-ui/core/styles/createPalette';
import { useTheme } from '@material-ui/core';

interface ColoredTextProps {
    type: keyof WatchBlockOptions;
    children: React.ReactElement[];
}

export const ColoredText: React.FunctionComponent<ColoredTextProps> = ({ type, children }) => {
    const theme = useTheme();
    return <span style={{ color: theme.palette.watchblocks[type] }}>{children}</span>;
};

export const colored = (val: { [key in keyof WatchBlockOptions]?: any }, key?: string) => {
    const [type, content] = Object.entries(val)[0] as [keyof WatchBlockOptions, any];
    return (
        <ColoredText key={key} type={type}>
            {content}
        </ColoredText>
    );
};
