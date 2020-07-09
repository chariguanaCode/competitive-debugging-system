import { MutableRefObject } from 'react';
import { Watchblock, Watch } from '../utils/GlobalStateContext';

const cupl_start = 240;
//const cupl_end = 246
const divisor = 244;
const variable_end = 245;

const string_start = 's'.charCodeAt(0);
const bitset_start = 'b'.charCodeAt(0);
const number_start = 'n'.charCodeAt(0);
const pointer_start = '*'.charCodeAt(0);

const array_start = 'a'.charCodeAt(0);
const array_end = 'A'.charCodeAt(0);

const pair_start = 'p'.charCodeAt(0);

const struct_start = 'o'.charCodeAt(0);
const struct_end = 'O'.charCodeAt(0);

const watchblock_open_start = 241;

const watch_start = 242;

const watchblock_close_start = 243;

//const watchblock_open_start  = Buffer.from([ cupl_start, 241 ])

export type ConvertResult = (
    | {
          type: 'array' | 'struct' | 'pair';
          children: Array<ConvertResult>;
          state: {
              expanded: boolean;
          };
      }
    | {
          type: 'number' | 'string' | 'bitset' | 'invalid';
          value: number | string;
      }
    | {
          type: 'closing';
          closingType: 'array' | 'struct' | 'pair' | 'watchblock';
      }
) & {
    id: string;
    name?: string;
    pointer?: true;
};

const convertContents = (contents: Uint8Array, start: number, id: string): { result: ConvertResult; end: number } => {
    let val_end = start,
        result,
        idCounter = 0;

    switch (contents[start]) {
        case array_start:
            result = {
                id,
                type: 'array' as 'array',
                children: [] as Array<ConvertResult>,
                state: { expanded: true },
            };

            while (contents[val_end + 1] !== array_end) {
                let val = convertContents(contents, val_end + 1, id + `.${idCounter}`);
                val.result.name = `${idCounter++}`;
                result.children.push(val.result);
                val_end = val.end;
            }
            result.children.push({
                id: `${id}.end`,
                type: 'closing',
                closingType: 'array',
            });

            return {
                result,
                end: val_end + 1,
            };

        case struct_start:
            result = {
                id,
                type: 'struct' as 'struct',
                children: [] as Array<ConvertResult>,
                state: { expanded: true },
            };

            while (contents[val_end + 1] !== struct_end) {
                const name = convertContents(contents, val_end + 1, id + `.${idCounter}`) as {
                    result: { type: 'string'; value: string };
                    end: number;
                };
                val_end = name.end;

                const val = convertContents(contents, val_end + 1, id + `.${idCounter++}`);
                val.result.name = name.result.value as string;

                result.children.push(val.result);
                val_end = val.end;
            }
            result.children.push({
                id: `${id}.end`,
                type: 'closing',
                closingType: 'struct',
            });

            return {
                result,
                end: val_end + 1,
            };

        case pair_start:
            let first = convertContents(contents, val_end + 1, id + '.first');
            first.result.name = 'first';
            val_end = first.end;

            let second = convertContents(contents, val_end + 1, id + '.second');
            second.result.name = 'second';
            val_end = second.end;

            return {
                result: {
                    id,
                    type: 'pair' as 'pair',
                    children: [
                        first.result,
                        second.result,
                        {
                            id: `${id}.end`,
                            type: 'closing',
                            closingType: 'pair',
                        },
                    ],
                    state: { expanded: true },
                },
                end: val_end,
            };

        case pointer_start:
            const val = convertContents(contents, start + 1, id);
            return {
                result: {
                    ...val.result,
                    pointer: true,
                },
                end: val.end,
            };

        default:
            val_end = contents.indexOf(variable_end, start);
            let type = 'invalid' as 'invalid' | 'number' | 'string' | 'bitset';
            switch (contents[start]) {
                case number_start:
                    type = 'number';
                    break;
                case string_start:
                    type = 'string';
                    break;
                case bitset_start:
                    type = 'bitset';
                    break;
            }

            return {
                result: {
                    id,
                    type,
                    value: new TextDecoder('utf-8').decode(contents.slice(start + 1, val_end)),
                },
                end: val_end,
            };
    }
};

let watchblockStack: Array<Watchblock> = [];

export const clearWatchblocks = (watchblocks: MutableRefObject<Watchblock>) => {
    watchblocks.current = {
        id: '-1',
        children: [],
        type: 'watchblock',
        line: -1,
        name: '',
        state: { expanded: true },
    };
    watchblockStack = [watchblocks.current];
};

export const watchParse = (newData: Uint8Array) => {
    let loc = newData.indexOf(cupl_start);
    if (loc === -1) return;

    const curr = newData;
    let begin, end;
    let id, name, line, data_type, config, result, contents;
    let topOfStack: Watchblock;
    switch (curr[loc + 1]) {
        case watch_start:
            begin = loc + 2;
            end = curr.indexOf(divisor, begin);
            id = new TextDecoder('utf-8').decode(curr.slice(begin, end));

            begin = end + 1;
            end = curr.indexOf(divisor, begin);
            name = new TextDecoder('utf-8').decode(curr.slice(begin, end));

            begin = end + 1;
            end = curr.indexOf(divisor, begin);
            line = parseInt(new TextDecoder('utf-8').decode(curr.slice(begin, end)));

            begin = end + 1;
            end = curr.indexOf(divisor, begin);
            data_type = new TextDecoder('utf-8').decode(curr.slice(begin, end));

            begin = end + 1;
            end = curr.indexOf(divisor, begin);
            config = new TextDecoder('utf-8').decode(curr.slice(begin, end));

            begin = end + 1;
            end = curr.indexOf(divisor, begin);
            contents = curr.slice(begin, end);

            result = convertContents(contents, 0, id).result;

            watchblockStack[watchblockStack.length - 1].children.push({
                name,
                line,
                data_type,
                config,
                ...result,
            });
            break;

        case watchblock_open_start:
            begin = loc + 2;
            end = curr.indexOf(divisor, begin);
            id = new TextDecoder('utf-8').decode(curr.slice(begin, end));

            begin = end + 1;
            end = curr.indexOf(divisor, begin);
            name = new TextDecoder('utf-8').decode(curr.slice(begin, end));

            begin = end + 1;
            end = curr.indexOf(divisor, begin);
            line = parseInt(new TextDecoder('utf-8').decode(curr.slice(begin, end)));

            topOfStack = watchblockStack[watchblockStack.length - 1];
            topOfStack.children.push({
                id,
                name,
                line,
                type: 'watchblock',
                children: [] as Array<Watchblock | Watch>,
                state: { expanded: true },
            });

            watchblockStack.push(topOfStack.children[topOfStack.children.length - 1] as Watchblock);

            break;
        case watchblock_close_start:
            topOfStack = watchblockStack[watchblockStack.length - 1];
            topOfStack.children.push({
                id: topOfStack.id + '.end',
                name: '',
                line: -1,
                type: 'closing',
                config: '',
                data_type: '',
                closingType: 'watchblock',
            });
            watchblockStack.pop();

            break;
    }
};
