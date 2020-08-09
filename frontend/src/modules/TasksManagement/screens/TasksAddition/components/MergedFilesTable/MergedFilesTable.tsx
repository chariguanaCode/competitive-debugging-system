import React from 'react';
import useStyles from './MergedFilesTable.css';
import { MergedFilesTablePropsModel, MergedFilesTableStateModel } from './MergedFilesTable.d';
import { AutoSizer, Table, Column } from 'react-virtualized';

export const MergedFilesTable: React.FunctionComponent<MergedFilesTablePropsModel> = ({ mergedFiles }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.MergedFilesTable}>
                <AutoSizer>
                    {({ width, height }) => (
                        <Table
                            gridClassName={classes.FilesTable}
                            rowClassName={classes.FilesTableRow}
                            ref="Table"
                            disableHeader={true}
                            headerHeight={30}
                            height={height}
                            overscanRowCount={20}
                            rowHeight={20}
                            rowCount={mergedFiles.length}
                            width={width}
                            rowGetter={({ index }) => mergedFiles[index]}
                        >
                            <Column
                                cellDataGetter={({ dataKey, rowData }) => rowData[dataKey].name}
                                dataKey="inputPath"
                                disableSort
                                width={width / 2}
                            />
                            <Column
                                cellDataGetter={({ dataKey, rowData }) => (rowData[dataKey] ? rowData[dataKey].name : '')}
                                dataKey="outputPath"
                                disableSort
                                width={width / 2}
                            />
                        </Table>
                    )}
                </AutoSizer>
            </div>
        </>
    );
};

export default MergedFilesTable;
