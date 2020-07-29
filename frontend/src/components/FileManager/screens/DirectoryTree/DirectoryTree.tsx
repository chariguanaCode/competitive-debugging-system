import React, { memo, useRef, useState, useEffect } from 'react';
import useStyles from './DirectoryTree.css';
import { DirectoryTreePropsModel, DirectoryTreeStateModel, DirectoryTreeNode } from './DirectoryTree.d';
import { ArrowDropDown as ArrowDropDownIcon, ArrowDropUp as ArrowDropUpIcon } from '@material-ui/icons';
import { loadFilesOnDirectory } from 'backend/filesHandlingFunctions';
import clsx from 'clsx';
export const DirectoryTree: React.FunctionComponent<DirectoryTreePropsModel> = memo(
    ({ currentPath, joinDirectory, currentRootDirectory }) => {
        const classes = useStyles();
        const [rerenderValue, rerenderForce] = useState(0);
        const foldersTree = useRef<DirectoryTreeNode>({});
        const treeVisibility = useRef(new Map());

        const rerenderComponent = () => rerenderForce((prevValue) => (prevValue < 32000 ? prevValue + 1 : 0));

        const loadDirectory = async (path: string) => {
            console.log(path);
            let [files, newPath] = await loadFilesOnDirectory({ directory: path, regex: null, filesExtensions: ['DIRECTORY'] });
            if (newPath) {
                Object.assign(foldersTree.current, { [newPath === '/' ? newPath : newPath.slice(0, -1)]: files });
                rerenderComponent();
            }
            console.log(files, newPath);
        };

        const showDirectory = (dir: string) => {
            console.log(dir);
            treeVisibility.current.set(dir, !treeVisibility.current.get(dir));
            if (!foldersTree.current.hasOwnProperty(dir)) loadDirectory(dir);
            else rerenderComponent();
        };

        const renderTree = (dir: string, indentation: string, name: string) => {
            let layer = (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {indentation}
                    <button
                        className={classes.ExpandButton}
                        onClick={() => {
                            showDirectory(dir);
                        }}
                    >
                        {treeVisibility.current.get(dir) ? (
                            <ArrowDropUpIcon className={classes.ArrowIcon} />
                        ) : (
                            <ArrowDropDownIcon className={classes.ArrowIcon} />
                        )}
                    </button>
                    <button
                        onClick={
                            dir !== currentPath.slice(0, -1)
                                ? () => {
                                      joinDirectory({ path: dir });
                                  }
                                : () => {}
                        }
                        className={classes.JoinDirectoryButton}
                    >
                        <span
                            className={clsx(classes.directoryNameContainer, {
                                [classes.currentDirectoryNameContainer]:
                                    dir === currentPath.slice(0, -1) || (dir === '/' && currentPath === '/'),
                            })}
                        >
                            {name}
                        </span>
                    </button>
                </span>
            );
            if (treeVisibility.current.get(dir) === true) {
                for (let i = 0; i < foldersTree.current[dir].length; ++i) {
                    layer = (
                        <>
                            {layer}
                            {renderTree(
                                foldersTree.current[dir][i].path,
                                indentation + '\u00A0\u00A0\u00A0\u00A0',
                                foldersTree.current[dir][i].name
                            )}
                        </>
                    );
                }
            }
            return <>{layer}</>;
        };
        return (
            <>
                <div className={classes.DirectoryTree}>{renderTree(currentRootDirectory, '', currentRootDirectory)}</div>
            </>
        );
    }
);

export default DirectoryTree;
