import { useEffect } from 'react'

const chokidar = window.require('chokidar')
const fs = window.require('fs')

export const useGrowingFileTrack = (
    filepath: string,
    shouldBuffer: boolean,
    finished: boolean,
    pushNewData: (newData: Uint8Array) => void,
    pushNewSize: (newSize: number) => void,
    cleanup: () => void
) => {
    useEffect(() => {
        if (filepath !== '') {
            cleanup()

            const watcher = chokidar.watch(filepath, { alwaysStat: true })
            let currSize = 0
            let buffer = new Uint8Array([])

            const handleEvent = (path: string, stats: any) => {
                if (currSize < stats.size) {
                    const contentStream = fs.createReadStream(filepath, {
                        start: currSize,
                        end: stats.size - 1,
                    })
                    currSize = stats.size
                    pushNewSize(currSize)

                    contentStream.on('data', (data: Buffer) => {
                        if (!shouldBuffer) {
                            pushNewData(data)
                        } else {
                            buffer = Uint8Array.from([
                                ...Array.from(buffer),
                                ...Array.from(data),
                            ])

                            let index = -1,
                                prevIndex = -1
                            do {
                                prevIndex = index + 1
                                index = buffer.indexOf(10, prevIndex)
                                if (index !== -1) {
                                    pushNewData(buffer.slice(prevIndex, index))
                                }
                            } while (index !== -1)

                            buffer = buffer.subarray(prevIndex)
                        }
                    })

                    watcher.on('close', () => {
                        contentStream.destroy()
                    })
                }
            }

            watcher.on('add', handleEvent)
            watcher.on('change', handleEvent)

            return () => {
                watcher.emit('close')
                watcher.close()
                cleanup()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filepath, finished])
}
