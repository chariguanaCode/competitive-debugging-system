import React, { useRef, useEffect } from 'react';
import useStyles from './Outputs.css';
import { AutoSizer, Grid } from 'react-virtualized';
import { useCurrentTaskState } from 'reduxState/selectors';

export const Outputs = () => {
    const classes = useStyles();

    const { stdout } = useCurrentTaskState();
    const stdoutArray = stdout.split('\n');
    let columnCount = 0;
    for (let i = 0; i < stdoutArray.length; i++) {
        columnCount = Math.max(columnCount, (stdoutArray[i] || []).length);
    }

    const gridRef = useRef<Grid | null>(null);
    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.recomputeGridSize();
        }
    }, [stdout]);

    return (
        <AutoSizer>
            {({ height, width }) => (
                <Grid
                    ref={gridRef}
                    height={height}
                    width={width}
                    rowHeight={19}
                    rowCount={stdoutArray.length}
                    columnWidth={855.5}
                    columnCount={Math.ceil(columnCount / 100)}
                    cellRenderer={({ rowIndex, columnIndex, style, key }) => (
                        <div key={key} style={style} className={classes.cell}>
                            {stdoutArray[rowIndex].substr(columnIndex * 100, 100)}
                        </div>
                    )}
                />
            )}
        </AutoSizer>
    );
};

export default Outputs;
