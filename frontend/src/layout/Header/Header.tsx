import React, { memo } from 'react';
import useStyles from './Header.css';
import { TitleBar, HeaderBar } from './screens';
export const Header = memo(() => {
    const classes = useStyles();
    return (
        <>
            <TitleBar />
            <HeaderBar />
        </>
    );
});

export default Header;
