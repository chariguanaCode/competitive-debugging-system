const fs = window.require('fs');

export const readFileStream = (
    filepath: string,
    sendSingleLines: boolean,
    pushData: (newData: Uint8Array) => void,
    updateSize: (newSize: number) => void,
    cleanup: () => void,
    finish: () => void
) => {
    if (filepath !== '') {
        cleanup();

        let buffer = new Uint8Array([]);

        const stats = fs.statSync(filepath);
        const contentStream = fs.createReadStream(filepath);
        updateSize(stats.size);

        contentStream.on('data', (data: Buffer) => {
            const oldBuffer = buffer;
            buffer = new Uint8Array(buffer.length + data.length);
            buffer.set(oldBuffer);
            buffer.set(data, oldBuffer.length);

            if (sendSingleLines) {
                let index = -1,
                    prevIndex = -1;
                do {
                    prevIndex = index + 1;
                    index = buffer.indexOf(10, prevIndex);
                    if (index !== -1) {
                        pushData(buffer.slice(prevIndex, index));
                    }
                } while (index !== -1);

                if (prevIndex > 0) buffer = buffer.subarray(prevIndex);
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
