export enum TwoDimensionArrayActionType {
    set_whole = 'array_2d_set_whole',
    set_whole_color = 'array_2d_set_whole_color',
    set_row = 'array_2d_set_row',
    set_row_color = 'array_2d_set_row_color',
    set_cell = 'array_2d_set_cell',
    set_cell_color = 'array_2d_set_cell_color',
}

type TwoDimensionArraySetWhole = {
    type: TwoDimensionArrayActionType.set_whole;
    value: Array<Array<string>>;
};
type TwoDimensionArraySetWholeColor = {
    type: TwoDimensionArrayActionType.set_whole_color;
    value: Array<Array<string>>;
};
type TwoDimensionArraySetRow = {
    type: TwoDimensionArrayActionType.set_row;
    index: number;
    value: Array<string>;
};
type TwoDimensionArraySetRowColor = {
    type: TwoDimensionArrayActionType.set_row_color;
    index: number;
    value: Array<string>;
};
type TwoDimensionArraySetCell = {
    type: TwoDimensionArrayActionType.set_cell;
    firstIndex: number;
    secondIndex: number;
    value: string;
};
type TwoDimensionArraySetCellColor = {
    type: TwoDimensionArrayActionType.set_cell_color;
    firstIndex: number;
    secondIndex: number;
    value: string;
};

export type TwoDimensionArrayAction =
    | TwoDimensionArraySetWhole
    | TwoDimensionArraySetWholeColor
    | TwoDimensionArraySetRow
    | TwoDimensionArraySetRowColor
    | TwoDimensionArraySetCell
    | TwoDimensionArraySetCellColor;
