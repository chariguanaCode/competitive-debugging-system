import React, { useRef, useEffect } from 'react';
import useStyles from './TwoDimensionArray.css';
import { TrackedArray2d } from 'reduxState/models';
import { AutoSizer, MultiGrid } from 'react-virtualized';

interface Props {
    value: TrackedArray2d;
}

export const TwoDimensionArray = ({ value: { value, color } }: Props) => {
    const classes = useStyles();

    let columnCount = 0;
    for (let i = 0; i < value.length; i++) {
        columnCount = Math.max(columnCount, (value[i] || []).length);
    }

    const columnWidth = ({ index }: { index: number }) => {
        let res = 0;
        if (index === 0) {
            res = ((value.length || 1) - 1).toString().length;
        } else {
            res = (index - 1).toString().length;
            for (let i in value) {
                res = Math.max(res, (value[i][index - 1] || '').length);
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
                    columnCount={columnCount + 1}
                    cellRenderer={({ rowIndex, columnIndex, style, key }) => (
                        <div key={key} style={style} className={classes.cell}>
                            {(() => {
                                if (rowIndex === 0 && columnIndex === 0) return '';

                                if (rowIndex === 0) return columnIndex - 1;

                                if (columnIndex === 0) return rowIndex - 1;

                                return (
                                    <span style={{ color: color[rowIndex - 1]?.[columnIndex - 1] }}>
                                        {value[rowIndex - 1]?.[columnIndex - 1]}
                                    </span>
                                );
                            })()}
                        </div>
                    )}
                />
            )}
        </AutoSizer>
    );
};

export default TwoDimensionArray;
