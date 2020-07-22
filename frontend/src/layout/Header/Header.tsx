import React from 'react';
import useStyles from './Header.css';
import { TitleBar, HeaderBar } from 'modules/Header/screens';
export const Header = () => {
    const classes = useStyles();
    return (
        <>
            <TitleBar />
            <HeaderBar />
        </>
    );
};

export default Header;
