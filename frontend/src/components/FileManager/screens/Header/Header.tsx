import React, { memo, useState, useRef, useEffect } from 'react';
import useStyles from './Header.css';
import { HeaderPropsModel, HeaderStateModel } from './Header.d';
import { Navigation, Search } from './components';

const arePropsEqual = (prevProps: HeaderPropsModel, nextProps: HeaderPropsModel) => {
    return prevProps.currentPath === nextProps.currentPath;
};

export const Header: React.FunctionComponent<HeaderPropsModel> = memo(
    ({ loadDirectory, currentPath, setRootDirectory, currentRootDirectory }) => {
        const classes = useStyles();

        return (
            <>
                <div className={classes.Header}>
                    <Navigation
                        loadDirectory={loadDirectory}
                        currentPath={currentPath}
                        setRootDirectory={setRootDirectory}
                        currentRootDirectory={currentRootDirectory}
                    />
                    <Search loadDirectory={loadDirectory} currentPath={currentPath} />
                </div>
            </>
        );
    },
    arePropsEqual
);

export default Header;
