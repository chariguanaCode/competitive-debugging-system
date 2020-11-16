import { Component, Ref } from 'react';

export interface AnchoredDialogPropsModel {
    anchorElRef?: Ref;
    anchorEl?: any;
    content?: any;
    contentProps?: {};
    open: boolean;
    closeOnClickOutside?: boolean;
    closeDialog?: () => void;
    position?: PositionModel;
    anchorPosition?: PositionModel;
}

export type PositionXModel = 'left' | 'middle' | 'right';
export type PositionYModel = 'top' | 'middle' | 'bottom';

type PositionModel =
    | 'left-top'
    | 'left-middle'
    | 'left-bottom'
    | 'middle-top'
    | 'middle-middle'
    | 'middle-bottom'
    | 'right-top'
    | 'right-middle'
    | 'right-bottom';

export interface AnchoredDialogStateModel {}
