interface SubmitEventInit extends EventInit {
  submitter?: HTMLElement | null;
}

globalThis.SubmitEvent = class SubmitEvent extends Event {
  get submitter() { return null };
  constructor(type: string, eventInitDict?: SubmitEventInit | undefined) {
    super(type, eventInitDict);
  }
}

const submitterGetter = Object.getOwnPropertyDescriptors(SubmitEvent.prototype).submitter.get;

import { expect, it } from '@jest/globals';
import "../"

// https://github.com/idea2app/event-submitter-polyfill/issues/8
it.failing("doesn't polyfill submitter if SubmitEvent is already available", () => {
  const form = document.createElement('form');
  document.body.appendChild(form);
  form.addEventListener("submit", (e) => e.preventDefault())
  form.dispatchEvent(new SubmitEvent("submit"))
  expect(Object.getOwnPropertyDescriptors(SubmitEvent.prototype).submitter.get).toBe(submitterGetter);
});
