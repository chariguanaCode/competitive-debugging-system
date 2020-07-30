import { FileType } from './Types'
import { sortStringCompare } from '../../utils/tools'

export const comparatorForFilesSort = (sortMethodNumber: number, obj1: FileType, obj2: FileType) => {
    switch (sortMethodNumber) {
        case 0:
            return obj1.typeGroup < obj2.typeGroup
                ? -1
                : obj1.typeGroup === obj2.typeGroup
                ? obj1.type < obj2.type
                    ? -1
                    : obj1.type === obj2.type
                    ? sortStringCompare(obj1.name, obj2.name)
                        ? -1
                        : 1
                    : 1
                : 1;
        case 1:
            return obj1.typeGroup > obj2.typeGroup
                ? -1
                : obj1.typeGroup === obj2.typeGroup
                ? obj1.type < obj2.type
                    ? -1
                    : obj1.type === obj2.type
                    ? sortStringCompare(obj1.name, obj2.name)
                        ? -1
                        : 1
                    : 1
                : 1;
        case 2:
            return sortStringCompare(obj2.name, obj1.name) ? -1 : 1;
        case 3:
            return sortStringCompare(obj1.name, obj2.name) ? -1 : 1;
        default:
            return -1;
    }
};