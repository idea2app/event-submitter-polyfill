/**
 * @jest-environment node
 */

import { it } from '@jest/globals';

// https://github.com/idea2app/event-submitter-polyfill/issues/7
it.failing("doesn't crash in non-browser environments", async () => {
  await import("../index");
});
