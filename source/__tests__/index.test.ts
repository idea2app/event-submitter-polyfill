import { beforeEach, describe, expect, it } from '@jest/globals';

import '..';

const form = document.createElement('form');
let submitEvent: SubmitEvent | null = null;
let submitter: HTMLElement | null = null;

form.addEventListener('submit', event => {
  event.preventDefault();
  submitEvent = event;
  submitter = event.submitter;
});
document.body.append(form);

function setFormContents(contents: string) {
  form.innerHTML = contents;
  const firstChild = form.firstChild;
  if (!firstChild) throw new Error("Couldn't find node for " + contents);
  return firstChild as HTMLInputElement;
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
        // https://github.com/jsdom/jsdom/pull/3480
        if (button.type == 'image') button.form!.requestSubmit();

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
  it('preserves the submitter outside of submit handlers', () => {
    const button = setFormContents('<button></button>');
    button.click();
    expect(submitEvent?.submitter).toBe(button);
  });

  // edge case, but would be good to fix
  // https://github.com/idea2app/event-submitter-polyfill/issues/6
  it("doesn't set the activeElement as the submitter when using requestSubmit", () => {
    const button = setFormContents('<button></button>');
    button.focus();
    form.requestSubmit();
    expect(submitter).toBe(null);
  });
});
