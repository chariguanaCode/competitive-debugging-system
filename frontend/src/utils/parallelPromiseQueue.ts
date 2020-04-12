export default class PromiseQueue {
    constructor(promisesLimit: number) {
        this.promisesLimit = promisesLimit
    }

    promisesLimit = 0
    queue: {
        promise: () => Promise<unknown> & { childProcess: any }
        resolve: (value: any) => void
        reject: (err: any) => void
        dequeueNotify: (childProcess: any) => void
    }[] = []
    pendingPromises = 0

    enqueue = (
        promise: () => Promise<unknown> & { childProcess: any },
        dequeueNotify: (childProcess: any) => void
    ) => {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
                dequeueNotify,
            })
            this.dequeue()
        })
    }

    dequeue = () => {
        if (this.pendingPromises >= this.promisesLimit) {
            return false
        }

        const item = this.queue.shift()
        if (!item) {
            return false
        }

        try {
            this.pendingPromises++
            this.dequeue()

            const itemPromise = item.promise()

            item.dequeueNotify(itemPromise.childProcess)

            itemPromise
                .then((value) => {
                    this.pendingPromises--
                    item.resolve(value)
                    this.dequeue()
                })
                .catch((err) => {
                    this.pendingPromises--
                    item.reject(err)
                    this.dequeue()
                })
        } catch (err) {
            this.pendingPromises--
            item.reject(err)
            this.dequeue()
        }

        return true
    }
}
