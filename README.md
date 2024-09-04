# promise-chunk

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=myrotvorets_promise-chunk&metric=alert_status)](https://sonarcloud.io/dashboard?id=myrotvorets_promise-chunk)
[![Build and Test](https://github.com/myrotvorets/promise-chunk/actions/workflows/build.yml/badge.svg)](https://github.com/myrotvorets/promise-chunk/actions/workflows/build.yml)

Runs a list of native promises in chunks.

# Example

```typescript
import promiseChunk from '@myrotvorets/promise-chunk'

function* requestGenerator(): Generator<Promise<Record<string, unknown>>> {
    const ids = ['81e', 'a46', 'SQIzfUkYJ', 'JFPROfGtQ', 'g-gQiPV-_'];
    for (const id of ids) {
        const url = `https://api.thecatapi.com/v1/images/${id}`;
        yield fetch(url).then((response) => response.json() as Promise<Record<string, unknown>>);
    }
}

async function getCats(): Promise<void> {
    const jsons = await promiseChunk(requestGenerator(), 2);
    jsons
        .filter((item): item is Record<string, unknown> => !(item instanceof Error))
        .forEach((cat) => console.log(cat.url));
}

getCats().catch((e: unknown) => console.error(e));
```
