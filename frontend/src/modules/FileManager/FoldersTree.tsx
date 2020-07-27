import React, { memo, useEffect, useState, useRef } from 'react';
import { ArrowDropDown as ArrowDropDownIcon, ArrowDropUp as ArrowDropUpIcon } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import { loadFilesOnDirectory } from '../../backend/filesHandlingFunctions';
import { FileType, FoldersTreeProps, FoldersTreeObjectTypes } from './Types';

export const FoldersTree: React.FunctionComponent<FoldersTreeProps> = memo(
    ({ showLoadingCircular, currentPath, joinDirectory, currentRootDirectory }) => {
        const [rerenderValue, rerenderForce] = useState(1);
        let foldersTree = useRef<FoldersTreeObjectTypes>({});
        let treeVisibility = useRef(new Map());

        const loadDirectory = async (path: string) => {
            console.log(path)
            let [files, newPath] = await loadFilesOnDirectory({ directory: path, regex: null, filetypes: ['DIRECTORY'] });
            console.log(files, newPath);
            if (newPath) {
                Object.assign(foldersTree.current, { [newPath === '/' ? newPath : newPath.slice(0, -1)]: files });
                rerenderForce((prevValue) => prevValue + 1);
            }
        };

        const showDirectory = (dir: string) => {
            console.log(dir);
            treeVisibility.current.set(dir, !treeVisibility.current.get(dir));
            console.log(foldersTree.current.hasOwnProperty(dir));
            if (!foldersTree.current.hasOwnProperty(dir)) loadDirectory(dir);
            else rerenderForce((prevValue) => prevValue + 1);
        };

        const renderTree = (dir: string, indentation: string, name: string) => {
            let layer = (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {indentation}
                    <button
                        style={{ padding: '0px', margin: '0px' }}
                        onClick={() => {
                            showDirectory(dir);
                        }}
                    >
                        {treeVisibility.current.get(dir) ? (
                            <ArrowDropUpIcon style={{ color: theme.palette.fileManager.fontColor }} />
                        ) : (
                            <ArrowDropDownIcon style={{ color: theme.palette.fileManager.fontColor }} />
                        )}
                    </button>
                    <button
                        onClick={
                            dir !== currentPath.slice(0, -1)
                                ? () => {
                                      joinDirectory(dir);
                                  }
                                : () => {}
                        }
                        style={{ padding: '0px', margin: '0px', textAlign: 'left', paddingBottom: '3px' }}
                    >
                        <span
                            style={
                                dir === currentPath.slice(0, -1) || (dir === '/' && currentPath === '/')
                                    ? {
                                          backgroundColor: theme.palette.fileManager.selectionColor,
                                          padding: '4px',
                                          color: theme.palette.fileManager.fontColor,
                                      }
                                    : { color: theme.palette.fileManager.fontColor }
                            }
                        >
                            {name}
                        </span>
                    </button>
                </span>
            );
            if (treeVisibility.current.get(dir) === true) {
                console.log(foldersTree.current);
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
        const theme = useTheme();
        return (
            <>
                <div
                    style={{
                        color: theme.palette.fileManager.fontColor,
                        alignContent: 'left',
                        alignItems: 'left',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '20%',
                    }}
                >
                    {renderTree(currentRootDirectory, '', currentRootDirectory)}
                </div>
            </>
        );
    }
);

export default FoldersTree;
