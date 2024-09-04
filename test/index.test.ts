/* eslint-disable sonarjs/no-nested-functions */
import { describe, it } from 'node:test';
import assert, { deepEqual, equal } from 'node:assert/strict';
import promiseChunk from '../lib';

function timeToMs(time: [number, number]): number {
    return (time[0] * 1e9 + time[1]) / 1e6;
}

void describe('promiseChunk', async () => {
    await it('should behave properly with chunkSize=1', async () => {
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
        const actual = await promiseChunk(generator(), 1);
        const end = timeToMs(process.hrtime());

        deepEqual(actual, expected);
        assert(end - start >= 590);
        assert(end - start < 610);
    });

    await it('should behave properly with chunkSize=2', async () => {
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
        const actual = await promiseChunk(generator(), 2);
        const end = timeToMs(process.hrtime());

        deepEqual(actual, expected);
        equal(s, `2\n3\n1\n`);
        assert(end - start >= 290);
        assert(end - start <= 310);
    });

    await it('should not abort on rejected promises', async () => {
        const generator = function* (): Generator<Promise<number>> {
            yield Promise.reject(new Error('FAIL'));
            yield Promise.resolve(3.14);
        };

        const actual = await promiseChunk(generator(), 2);
        equal(actual.length, 2);
        assert(actual[0] instanceof Error);
        equal(actual[1], 3.14);
    });
});
