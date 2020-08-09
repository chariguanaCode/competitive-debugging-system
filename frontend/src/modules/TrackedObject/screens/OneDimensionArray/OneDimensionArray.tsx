import React, { useRef, useEffect } from 'react';
import useStyles from './OneDimensionArray.css';
import { TrackedArray1d } from 'reduxState/models';
import { AutoSizer, MultiGrid } from 'react-virtualized';

interface Props {
    value: TrackedArray1d;
}

export const OneDimensionArray = ({ value: { value, color } }: Props) => {
    const classes = useStyles();

    const columnWidth = ({ index }: { index: number }) => {
        let res = 0;
        if (index === 0) {
            res = ((value.length || 1) - 1).toString().length;
        } else {
            res = 1;
            for (let i = 0; i < value.length; i++) {
                res = Math.max(res, (value[i] || '').length);
            }
        }
        return Math.max(19, 8.555 * res) + 16 + (index === 0 ? 2 : 0);
    };

    const gridRef = useRef<MultiGrid | null>(null);

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.recomputeGridSize();
        }
    }, [value, color]);

    return (
        <AutoSizer>
            {({ height, width }) => (
                <MultiGrid
                    ref={gridRef}
                    fixedColumnCount={1}
                    fixedRowCount={1}
                    classNameTopRightGrid={classes.topRightGrid}
                    classNameTopLeftGrid={classes.topLeftGrid}
                    classNameBottomRightGrid={classes.bottomRightGrid}
                    classNameBottomLeftGrid={classes.bottomLeftGrid}
                    height={height}
                    width={width}
                    rowHeight={({ index }) => (index === 0 ? 2 : 0) + 16 + 19}
                    rowCount={value.length + 1}
                    estimatedColumnSize={16 + 32}
                    columnWidth={columnWidth}
                    columnCount={2}
                    cellRenderer={({ rowIndex, columnIndex, style, key }) => (
                        <div key={key} style={style} className={classes.cell}>
                            {(() => {
                                if (rowIndex === 0 && columnIndex === 0) return '';

                                if (rowIndex === 0) return columnIndex - 1;

                                if (columnIndex === 0) return rowIndex - 1;

                                return <span style={{ color: color[rowIndex - 1] }}>{value[rowIndex - 1]}</span>;
                            })()}
                        </div>
                    )}
                />
            )}
        </AutoSizer>
    );
};

export default OneDimensionArray;
