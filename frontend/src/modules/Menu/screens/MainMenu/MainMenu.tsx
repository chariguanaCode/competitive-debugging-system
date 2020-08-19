import React, { memo } from 'react';
import { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useStyles from './MainMenu.css';
import { MainMenuProps } from './Types';
//import { Sidebar, Content } from './components';
import { Sector } from './components/SectorsButtons';
import { useFileManagerActions } from 'reduxState/actions';
import { Menu } from 'components';
import * as Contents from './components/Contents';
import Buttons from './components/SectorsButtons';
import { useProjectFile } from 'reduxState/selectors';
const MainMenu: React.FunctionComponent<MainMenuProps> = memo(({ open, handleClose, isAnyProjectOpen }) => {
    const classes = useStyles({
        open: open,
    });
    const { setFileManager } = useFileManagerActions();
    const projectFile = useProjectFile();
    return (
        <>
            <div className={classes.MainMenu}>
                {open && (
                    <Menu
                        contentsProps={{ closeMainMenu: handleClose, setFileManagerConfig: setFileManager }}
                        sectors={[...Object.keys(Sector)]}
                        contents={Contents}
                        buttons={Buttons.map((button) => ({
                            name: button.name,
                            key: button.key,
                            icon: button.icon,
                            disabled:
                                button.disabled ||
                                (button.doesNeedOpenProject && !isAnyProjectOpen) ||
                                (button.doesNeedSaveLocation && !!!projectFile),
                        }))}
                    />
                )}
            </div>
        </>
    );
});

export default MainMenu;
