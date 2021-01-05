import { stringFromUintArray } from 'utils/tools';

const fs = window.require('fs');

export const readFileStream = (
    filepath: string,
    sendSingleLines: boolean,
    pushData: (newData: string) => void,
    updateSize: (newSize: number) => void,
    cleanup: () => void,
    finish: () => void
) => {
    if (filepath !== '') {
        cleanup();
        let buffer = '';
        const stats = fs.statSync(filepath);
        const contentStream = fs.createReadStream(filepath);
        updateSize(stats.size);

        contentStream.on('error', (err: any) => {});
        contentStream.on('data', (data: Buffer) => {
            buffer += stringFromUintArray(data);

            if (sendSingleLines) {
                let index = -1,
                    prevIndex = -1;
                do {
                    prevIndex = index + 1;
                    index = buffer.indexOf('\n', prevIndex);
                    if (index !== -1) {
                        pushData(buffer.slice(prevIndex, index));
                    }
                } while (index !== -1);

                if (prevIndex > 0) buffer.slice(prevIndex);
            }
        });
        contentStream.on('close', () => {
            if (!sendSingleLines) {
                pushData(buffer);
            }
            finish();
        });

        return () => {
            contentStream.close();
        };
    }
};
