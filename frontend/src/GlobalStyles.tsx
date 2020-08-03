import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    '@global': {
        '::-webkit-scrollbar': {
            width: 15,
            height: 15,
        },
        '::-webkit-scrollbar-track': {
            background: 'transparent',
            border: 'transparent 4px solid',
        },
        '::-webkit-scrollbar-thumb': {
            borderRadius: 12,
            backgroundColor: theme.palette.scrollbar.thumb,
            backgroundClip: 'content-box',
            border: 'transparent 4px solid',
            minHeight: 32 + 8,
        },
        '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme.palette.scrollbar.thumbHover, // TODO: pointer cursor
        },
        '::-webkit-scrollbar-corner': {
            background: 'transparent',
        },
    },
}));

export default function GlobalStyles(): ReactElement {
    useStyles();

    return <></>;
}
