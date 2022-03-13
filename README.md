# Event Submitter polyfill

A polyfill for [`submitter` property of `<form />` Submit Event][1], which is written in [TypeScript][2].

[![CI & CD](https://github.com/idea2app/event-submitter-polyfill/actions/workflows/main.yml/badge.svg)][3]
[![](https://data.jsdelivr.com/v1/package/npm/event-submitter-polyfill/badge?style=rounded)][4]

[![NPM](https://nodei.co/npm/event-submitter-polyfill.png?downloads=true&downloadRank=true&stars=true)][5]

## Installation

### Bundled

```javascript
import 'event-submitter-polyfill';
```

### CDN

```html
<head>
    <script src="https://cdn.jsdelivr.net/npm/event-submitter-polyfill"></script>
</head>
```

## Usage

### HTML 5

```html
<body>
    <form>
        <input name="data" />

        <button type="submit" data-name="first">Fisrt</button>
        <button type="submit" data-name="second">Second</button>
    </form>
    <script>
        document.querySelector('form')?.addEventListener('submit', event => {
            event.preventDefault();

            const { name } = event.submitter.dataset,
                { data } = event.target.elements;

            fetch(`/api/${name}`, { data: data.value });
        });
    </script>
</body>
```

### React

```tsx
import React, { FormEvent } from 'react';
import { render } from 'react-dom';

function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { name } = event.nativeEvent.submitter.dataset,
        { data } = event.currentTarget.elements;

    fetch(`/api/${name}`, { data: data.value });
}

render(
    <form onSubmit={handleSubmit}>
        <input name="data" />

        <button type="submit" data-name="first">
            Fisrt
        </button>
        <button type="submit" data-name="second">
            Second
        </button>
    </form>,
    document.body
);
```

## Roadmap

-   [x] [`SubmitEvent` class in TypeScript][6]

## Acknowledge

We rewrite the source code based on [Tobias Buschor's answer in StackOverflow][7].

[1]: https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent/submitter
[2]: https://www.typescriptlang.org/
[3]: https://github.com/idea2app/event-submitter-polyfill/actions/workflows/main.yml
[4]: https://www.jsdelivr.com/package/npm/event-submitter-polyfill
[5]: https://nodei.co/npm/event-submitter-polyfill/
[6]: https://github.com/microsoft/TypeScript/issues/40811
[7]: https://stackoverflow.com/a/61110260
