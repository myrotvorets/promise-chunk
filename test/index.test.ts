import promiseChunk from '../lib';

function timeToMs(time: [number, number]): number {
    return (time[0] * 1e9 + time[1]) / 1e6;
}

describe('promiseChunk', () => {
    it('should behave properly with chunkSize=1', async () => {
        const input = [
            [1, 300],
            [2, 200],
            [3, 100],
        ];

        const generator = function* (): Generator<Promise<number>> {
            for (const [value, ms] of input) {
                yield new Promise((resolve) => {
                    setTimeout(() => resolve(value), ms);
                });
            }
        };

        const expected = input.map((item) => item[0]);

        const start = timeToMs(process.hrtime());
        const actual = await promiseChunk(generator, 1);
        const end = timeToMs(process.hrtime());

        expect(actual).toStrictEqual(expected);
        expect(end - start).toBeGreaterThanOrEqual(590);
        expect(end - start).toBeLessThanOrEqual(610);
    });

    it('should behave properly with chunkSize=2', async () => {
        const input = [
            [1, 300],
            [2, 100],
            [3, 100],
        ];

        let s = '';

        const generator = function* (): Generator<Promise<number>> {
            for (const [value, ms] of input) {
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                yield new Promise((resolve) => {
                    setTimeout(() => {
                        s += `${value}\n`;
                        resolve(value);
                    }, ms);
                });
            }
        };

        const expected = input.map((item) => item[0]);

        const start = timeToMs(process.hrtime());
        const actual = await promiseChunk(generator, 2);
        const end = timeToMs(process.hrtime());

        expect(actual).toStrictEqual(expected);
        expect(s).toBe(`2\n3\n1\n`);
        expect(end - start).toBeGreaterThanOrEqual(290);
        expect(end - start).toBeLessThanOrEqual(310);
    });

    it('should not abort on rejected promises', async () => {
        const generator = function* (): Generator<Promise<number>> {
            yield Promise.reject(new Error('FAIL'));
            yield Promise.resolve(3.14);
        };

        const actual = await promiseChunk(generator, 2);
        expect(actual).toHaveLength(2);
        expect(actual[0]).toBeInstanceOf(Error);
        expect(actual[1]).toBe(3.14);
    });
});
