module.exports = class PromiseQueue {
    constructor(promisesLimit) {
        this.promisesLimit = promisesLimit
    }

    queue = []
    pendingPromises = 0

    enqueue = (promise, dequeueNotify) => {
        //console.log(this.pendingPromises)
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
            
            item.dequeueNotify(itemPromise.child)

            itemPromise
                .then((value) => {
                    this.pendingPromises--
                    item.resolve(value)
                    this.dequeue()
                })
                .catch(err => {
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