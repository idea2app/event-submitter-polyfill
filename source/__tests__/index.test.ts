import { beforeEach, describe, expect, it } from '@jest/globals';

import '..';

const form = document.createElement('form');
let submitEvent: SubmitEvent | null = null;
let submitter: HTMLElement | null = null;
form.addEventListener('submit', e => {
    e.preventDefault();
    submitEvent = e;
    submitter = e.submitter;
});
document.body.appendChild(form);

function setFormContents(contents: string): HTMLElement {
    form.innerHTML = contents;
    const firstChild = form.firstChild as HTMLElement;
    if (!firstChild) throw new Error("Couldn't find node for " + contents);
    return firstChild;
}

describe('SubmitEvent', () => {
    beforeEach(() => {
        submitEvent;
        submitter = null;
    });

    const buttons = {
        '<button></button>': true,
        '<button type="submit"></button>': true,
        '<input type="submit" />': true,
        '<input type="image" />': true,
        '<button type="button"></button>': false,
        '<input type="button"></button>': false
    };
    for (let [buttonHTML, canBeASubmitter] of Object.entries(buttons)) {
        if (canBeASubmitter) {
            it(`sets the submitter when clicking on a ${buttonHTML}`, () => {
                const button = setFormContents(buttonHTML);
                button.click();
                expect(submitter).toBe(button);
            });
        } else {
            it(`does not submit when clicking on a ${buttonHTML}`, () => {
                const button = setFormContents(buttonHTML);
                button.click();
                expect(submitter).toBe(null);
            });
        }
    }

    // this currently doesn't work, since the bubbling submit handler does `last_button = undefined`
    // https://github.com/idea2app/event-submitter-polyfill/issues/5
    it.failing("preserves the submitter outside of submit handlers", () => {
        const button = setFormContents("<button></button>");
        button.click();
        expect(submitEvent?.submitter).toBe(button);
    });

    // edge case, but would be good to fix
    // https://github.com/idea2app/event-submitter-polyfill/issues/6
    it.failing("doesn't set the activeElement as the submitter when using requestSubmit", () => {
        const button = setFormContents("<button></button>");
        button.focus();
        form.requestSubmit();
        expect(submitter).toBe(null);
    });
});
