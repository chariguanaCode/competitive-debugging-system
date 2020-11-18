import { useRef, useEffect } from 'react';
import { Watchblock, Watch, WatchActionsHistoryModel } from 'reduxState/models';
import { useConfig } from 'reduxState/selectors';
import { useWatchActionsHistoryActions } from 'reduxState/actions';

const string_start = 's';
const bitset_start = 'b';
const number_start = 'n';
const pointer_start = '*';

const array_start = 'a';
const array_end = 'A';

const pair_start = 'p';

const struct_start = 'o';
const struct_end = 'O';

const watchblock_start = String.fromCharCode(242);
const watchblock_end = String.fromCharCode(243);

const divisor = String.fromCharCode(244);

const cupl_start = String.fromCharCode(245);
const cupl_end = String.fromCharCode(246);

const watch_start = String.fromCharCode(247);
const watch_end = String.fromCharCode(248);

const variable_start = String.fromCharCode(249);
//const variable_end = String.fromCharCode(250);

const cds_id_start = String.fromCharCode(251);

export type ConvertResult = (
    | {
          type: 'array' | 'struct' | 'pair';
          children: Array<ConvertResult>;
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
    call_id: string;
    name?: string;
    pointer?: true;
};

const convertContents = (
    contents: string[],
    start: number,
    call_id: string
): { result: ConvertResult; end: number; valueString: string } => {
    let val_end = start,
        valueString = '',
        result,
        idCounter = 0;

    switch (contents[start]) {
        case array_start:
            result = {
                call_id,
                type: 'array' as 'array',
                children: [] as Array<ConvertResult>,
            };
            while (contents[val_end + 1] !== array_end) {
                let val = convertContents(contents, val_end + 1, call_id);
                val.result.name = `${idCounter++}`;
                result.children.push(val.result);
                val_end = val.end;
                valueString += `${val.valueString},`;
            }

            return {
                result,
                end: val_end + 1,
                valueString: `[${valueString.slice(0, -1)}]`,
            };

        case struct_start:
            result = {
                call_id,
                type: 'struct' as 'struct',
                children: [] as Array<ConvertResult>,
            };

            while (contents[val_end + 1] !== struct_end) {
                const name = convertContents(contents, val_end + 1, call_id) as {
                    result: { type: 'string'; value: string };
                    end: number;
                };
                val_end = name.end;

                const val = convertContents(contents, val_end + 1, call_id);
                val.result.name = name.result.value as string;

                result.children.push(val.result);
                val_end = val.end;
            }

            return {
                result,
                end: val_end + 1,
                valueString: '"0"', // TODO: support for structs
            };

        case pair_start:
            let first = convertContents(contents, start + 1, call_id);
            first.result.name = 'first';
            val_end = first.end;
            valueString += `"first": ${first.valueString},`;
            let second = convertContents(contents, val_end + 1, call_id);
            second.result.name = 'second';
            val_end = second.end;
            valueString += `"second": ${first.valueString}`;
            return {
                result: {
                    call_id,
                    type: 'pair' as 'pair',
                    children: [first.result, second.result],
                },
                end: val_end,
                valueString: `{${valueString}}`,
            };

        case pointer_start:
            const val = convertContents(contents, start + 1, call_id);
            return {
                result: {
                    ...val.result,
                    pointer: true,
                },
                end: val.end,
                valueString: val.valueString,
            };

        default:
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
                    call_id,
                    type,
                    value: contents[start + 1],
                },
                end: start + 1,
                valueString: `"${contents[start + 1]}"`,
            };
    }
};

export const useParseWatchblocks = () => {
    const watchblockStack = useRef<Array<Watchblock>>([]);
    const tempWatchActionsHistory = useRef<WatchActionsHistoryModel['history']>({});
    const watchActionsHistoryPreviousKey = useRef<string>('-1');
    const projectConfig = useConfig();
    const { addToWatchActionsHistory, setWatchActionsHistory } = useWatchActionsHistoryActions();
    const readWatchblocks = () => {
        return watchblockStack.current[0];
    };

    const clearWatchblocks = () => {
        watchblockStack.current = [
            {
                call_id: '-1',
                children: [],
                type: 'watchblock',
                line: '-1',
                name: '',
            },
        ];
        tempWatchActionsHistory.current = {};
        watchActionsHistoryPreviousKey.current = '-1';
    };

    const parseWatchblocks = (dataString: string) => {
        const cupl_start_index = dataString.indexOf(cupl_start);
        if (cupl_start_index === -1) return;
        const cupl_end_index = dataString.indexOf(cupl_end, cupl_start_index);
        const data = dataString.slice(cupl_start_index, cupl_end_index + 1).split(divisor);

        let loc = 1;
        let name: string, line: string, config: any, call_id, cds_id;
        let topOfStack: Watchblock;

        switch (data[loc]) {
            case watch_start:
                [call_id, line, config] = data.slice(loc + 1, loc + 4);
                loc += 4;

                let variables: Array<Watch> = [];
                let variablesValuesStrings: Array<string> = [];
                while (data[loc] !== watch_end) {
                    switch (data[loc]) {
                        case variable_start:
                            const { result, end, valueString } = convertContents(data, loc + 3, call_id);
                            variables.push({
                                name: data[loc + 1],
                                data_type: data[loc + 2],
                                variable_id: variables.length,
                                ...result,
                            } as Watch);
                            variablesValuesStrings.push(valueString);
                            loc = end + 1;
                            break;
                        case cds_id_start:
                            cds_id = data[loc + 1];
                            loc += 2;
                            break;
                    }
                }
                if (cds_id) {
                    const actions = projectConfig.watchesIdsActions[cds_id];
                    if (actions) {
                        const historyEntryActions = actions.map((action) => ({
                            action: action.action,
                            targetObject: action.target,
                            payload: variablesValuesStrings.map((valueString) => JSON.parse(valueString)),
                        }));

                        tempWatchActionsHistory.current[call_id] = {
                            previousKey: watchActionsHistoryPreviousKey.current,
                            nextKey: '-1',
                            actions: historyEntryActions,
                        };
                        if (watchActionsHistoryPreviousKey.current !== '-1')
                            tempWatchActionsHistory.current[watchActionsHistoryPreviousKey.current].nextKey = call_id;
                        watchActionsHistoryPreviousKey.current = call_id;

                        setWatchActionsHistory(tempWatchActionsHistory.current); //potentially terrible efficiency
                    }
                }

                variables.forEach((variable) => {
                    watchblockStack.current[watchblockStack.current.length - 1].children.push({
                        ...variable,
                        line,
                        config,
                    });
                });
                break;
            case watchblock_start:
                [call_id, name, line] = data.slice(loc + 1, loc + 4);
                topOfStack = watchblockStack.current[watchblockStack.current.length - 1];
                topOfStack.children.push({
                    call_id,
                    name,
                    line,
                    type: 'watchblock',
                    children: [] as Array<Watchblock | Watch>,
                });

                watchblockStack.current.push(topOfStack.children[topOfStack.children.length - 1] as Watchblock);

                break;
            case watchblock_end:
                watchblockStack.current.pop();

                break;
        }
    };

    return { parseWatchblocks, readWatchblocks, clearWatchblocks };
};
