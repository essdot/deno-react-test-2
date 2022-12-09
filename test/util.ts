import { DOMParser, Element } from 'deno-dom';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent, waitFor } from '@testing-library/dom';

import * as mockFetch from 'mock_fetch';

import type { HTMLDocument } from 'deno-dom';

export function domSetup(): HTMLDocument {
  const doc = new DOMParser().parseFromString('', 'text/html');
  // @ts-ignore bad touch
  doc.defaultView = globalThis.window;

  // @ts-ignore bad touch
  globalThis.document = doc;
  // @ts-ignore bad touch
  globalThis.HTMLIFrameElement = Element;

  return (doc as HTMLDocument);
}

export function domTeardown() {
  // @ts-ignore bad touch
  globalThis.document = null;
  // @ts-ignore bad touch
  globalThis.HTMLIFrameElement = null;
}

// wait one tick.
// usage: await waitTick()
export function waitTick() {
  return new Promise((resolve) => setTimeout(resolve, 1));
}

type UnknownObject = { [s in string]: unknown };

// Gross hack to find the React props of an element.
// This hack exists to find event handlers (like "onClick")
// so they can be called under test.
// This would not be necessary if I knew of a way to fire
// events that works with React. testing-library `fireEvent` etc
// do not work.
// Finds a key like `___reactProps1039423` on the object.
export function findProps(_el: unknown): UnknownObject {
  if (!_el || typeof _el !== 'object') {
    return {};
  }

  const el = (_el as UnknownObject);

  const foundKey = Object.keys(el).find((k) =>
    k.toLowerCase().indexOf('reactprops') !== -1
  );

  if (foundKey && typeof el[foundKey] === 'object') {
    return (el[foundKey] as UnknownObject);
  } else {
    return {};
  }
}

export { fireEvent, mockFetch, render, userEvent, waitFor };
