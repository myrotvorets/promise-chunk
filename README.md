# promise-chunk

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=myrotvorets_promise-chunk&metric=alert_status)](https://sonarcloud.io/dashboard?id=myrotvorets_promise-chunk)
![Build and Test CI](https://github.com/myrotvorets/promise-chunk/workflows/Build%20and%20Test%20CI/badge.svg)
[![codebeat badge](https://codebeat.co/badges/65aa8710-9d42-4160-8164-eb2b43255820)](https://codebeat.co/projects/github-com-myrotvorets-promise-chunk-master)

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
