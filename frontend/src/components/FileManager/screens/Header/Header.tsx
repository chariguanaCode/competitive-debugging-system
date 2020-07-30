import React, { memo, useState, useRef, useEffect } from 'react';
import useStyles from './Header.css';
import { HeaderPropsModel, HeaderStateModel } from './Header.d';
import { Navigation, Search, Sort } from './components';
import OperationalButtons from './components/OperationalButtons';

const arePropsEqual = (prevProps: HeaderPropsModel, nextProps: HeaderPropsModel) => {
    return prevProps.currentPath === nextProps.currentPath && prevProps.sortMethodNumber === nextProps.sortMethodNumber;
};

export const Header: React.FunctionComponent<HeaderPropsModel> = memo(
    ({ loadDirectory, dialogClose, currentPath, setRootDirectory, setSortMethodNumber, sortMethodNumber }) => {
        const classes = useStyles();

        return (
            <>
                <div className={classes.Header}>
                    <div className={classes.leftContainer}>
                        <Sort sortMethodNumber={sortMethodNumber} setSortMethodNumber={setSortMethodNumber} />
                    </div>
                    <div className={classes.NavigationContainer}>
                        <Navigation
                            loadDirectory={loadDirectory}
                            currentPath={currentPath}
                            setRootDirectory={setRootDirectory}
                        />
                    </div>
                    <div className={classes.SearchContainer}>
                        <Search loadDirectory={loadDirectory} currentPath={currentPath} />
                    </div>
                    <div className={classes.OperationalButtonsContainer}>
                        <OperationalButtons dialogClose={dialogClose} />
                    </div>
                </div>
            </>
        );
    },
    arePropsEqual
);

export default Header;
