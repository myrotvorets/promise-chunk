# promise-chunk

Runs a list of native promises in chunks.

# Example

```typescript
import promiseChunk from '@myrotvorets/promise-chunk'

function* requestGenerator(): Generator<Promise<Record<string, unknown>>> {
    const ids = ['81e', 'a46', 'SQIzfUkYJ', 'JFPROfGtQ', 'g-gQiPV-_']
    for (let id of ids) {
        const url = `https://api.thecatapi.com/v1/images/${id}`;
        yield fetch(url).then((response) => response.json() as Promise<Record<string, unknown>>);
    }
}

async function getCats(): Promise<void> {
    const jsons = await promiseChunk(requestGenerator, 2);
    jsons
        .filter((item): item is Record<string, unknown> => !(item instanceof Error))
        .forEach((cat) => console.log(cat.url));
}

getCats().catch((e) => console.error(e));
```
