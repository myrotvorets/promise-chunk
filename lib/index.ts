/* eslint-disable no-await-in-loop */

export default async function promiseChunk<T>(
    iterable: Iterable<Promise<T>>,
    chunkSize: number,
): Promise<(T | Error)[]> {
    const queue: Promise<T | Error>[] = [];
    const result: (Promise<T | Error> | T | Error)[] = [];

    for (const item of iterable) {
        const promise = item.then(
            (r: T): T => {
                void queue.splice(queue.indexOf(promise), 1);
                return r;
            },
            // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
            (e: Error): Error => {
                void queue.splice(queue.indexOf(promise), 1);
                return e;
            },
        );

        queue.push(promise);
        result.push(promise);

        if (queue.length >= chunkSize) {
            await Promise.race(queue);
        }
    }

    while (queue.length) {
        await Promise.race(queue);
    }

    return Promise.all(result);
}
