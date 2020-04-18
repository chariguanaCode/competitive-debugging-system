import { MutableRefObject } from 'react'
import { Watchblocks } from '../utils/GlobalStateContext'

const cupl_start = 240
//const cupl_end = 246
const divisor = 244
const variable_end = 245

const string_start = 's'.charCodeAt(0)
const bitset_start = 'b'.charCodeAt(0)
const number_start = 'n'.charCodeAt(0)
const pointer_start = '*'.charCodeAt(0)

const array_start = 'a'.charCodeAt(0)
const array_end = 'A'.charCodeAt(0)

const pair_start = 'p'.charCodeAt(0)

const struct_start = 'o'.charCodeAt(0)
const struct_end = 'O'.charCodeAt(0)

const watchblock_open_start = 241

const watch_start = 242

const watchblock_close_start = 243

//const watchblock_open_start  = Buffer.from([ cupl_start, 241 ])

interface ConvertResult {
    type:
        | 'array'
        | 'struct'
        | 'pair'
        | 'number'
        | 'string'
        | 'bitset'
        | 'invalid'
    name?: string
    pointer?: boolean
    value:
        | Array<ConvertResult>
        | { first: ConvertResult; second: ConvertResult }
        | number
        | string
}

const convertContents: (
    contents: Uint8Array,
    start: number
) => { result: ConvertResult; end: number } = (
    contents: Uint8Array,
    start: number
) => {
    let val_end = start,
        result
    switch (contents[start]) {
        case array_start:
            result = {
                type: 'array' as 'array',
                value: [] as Array<ConvertResult>,
            }

            while (contents[val_end + 1] !== array_end) {
                let val = convertContents(contents, val_end + 1)
                result.value.push(val.result)
                val_end = val.end
            }

            return {
                result,
                end: val_end + 1,
            }

        case struct_start:
            result = {
                type: 'struct' as 'struct',
                value: [] as Array<ConvertResult>,
            }

            while (contents[val_end + 1] !== struct_end) {
                const name = convertContents(contents, val_end + 1)
                val_end = name.end

                const val = convertContents(contents, val_end + 1)
                val.result.name = name.result.value as string

                result.value.push(val.result)
                val_end = val.end
            }

            return {
                result,
                end: val_end + 1,
            }

        case pair_start:
            let first = convertContents(contents, val_end + 1)
            first.result.name = 'first'
            val_end = first.end

            let second = convertContents(contents, val_end + 1)
            second.result.name = 'second'
            val_end = second.end

            return {
                result: {
                    type: 'pair' as 'pair',
                    value: {
                        first: first.result,
                        second: second.result,
                    },
                },
                end: val_end,
            }

        case pointer_start:
            const val = convertContents(contents, start + 1)
            return {
                result: {
                    ...val.result,
                    pointer: true,
                },
                end: val.end,
            }

        default:
            val_end = contents.indexOf(variable_end, start)
            let type = 'invalid' as 'invalid' | 'number' | 'string' | 'bitset'
            switch (contents[start]) {
                case number_start:
                    type = 'number'
                    break
                case string_start:
                    type = 'string'
                    break
                case bitset_start:
                    type = 'bitset'
                    break
            }

            return {
                result: {
                    type,
                    value: new TextDecoder('utf-8').decode(
                        contents.slice(start + 1, val_end)
                    ),
                },
                end: val_end,
            }
    }
}

let watchblockStack: Array<Watchblocks> = []

export const clearWatchblocks = (
    watchblocks: MutableRefObject<Watchblocks>
) => {
    watchblocks.current = { children: {} }
    watchblockStack = [watchblocks.current]
}

export const watchParse = (newData: Uint8Array) => {
    let loc = newData.indexOf(cupl_start)
    if (loc === -1) return

    const curr = newData
    let begin, end
    let id, name, line, data_type, config, result, contents
    switch (curr[loc + 1]) {
        case watch_start:
            begin = loc + 2
            end = curr.indexOf(divisor, begin)
            id = curr.slice(begin, end)

            begin = end + 1
            end = curr.indexOf(divisor, begin)
            name = new TextDecoder('utf-8').decode(curr.slice(begin, end))

            begin = end + 1
            end = curr.indexOf(divisor, begin)
            line = new TextDecoder('utf-8').decode(curr.slice(begin, end))

            begin = end + 1
            end = curr.indexOf(divisor, begin)
            data_type = new TextDecoder('utf-8').decode(curr.slice(begin, end))

            begin = end + 1
            end = curr.indexOf(divisor, begin)
            config = new TextDecoder('utf-8').decode(curr.slice(begin, end))

            begin = end + 1
            end = curr.indexOf(divisor, begin)
            contents = curr.slice(begin, end)

            result = convertContents(contents, 0).result

            watchblockStack[watchblockStack.length - 1].children[name + id] = {
                name,
                line,
                data_type,
                config,
                ...result,
            }
            break

        case watchblock_open_start:
            begin = loc + 2
            end = curr.indexOf(divisor, begin)
            id = curr.slice(begin, end)

            begin = end + 1
            end = curr.indexOf(divisor, begin)
            name = new TextDecoder('utf-8').decode(curr.slice(begin, end))

            begin = end + 1
            end = curr.indexOf(divisor, begin)
            line = new TextDecoder('utf-8').decode(curr.slice(begin, end))

            watchblockStack[watchblockStack.length - 1].children[name + id] = {
                name,
                line,
                type: 'watchblock',
                children: {},
            }
            watchblockStack.push(
                watchblockStack[watchblockStack.length - 1].children[name + id]
            )

            break
        case watchblock_close_start:
            watchblockStack.pop()

            break
    }
}