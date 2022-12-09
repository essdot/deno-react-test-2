import React from 'react';
import {
  assert,
  assertEquals,
  assertStringIncludes,
  assertThrows,
} from 'std/testing/asserts.ts';

import { domSetup, domTeardown, render } from './util.ts';
import { SimpleText } from '../src/SimpleText.tsx';

Deno.test('renders simple text component', () => {
  const doc = domSetup();
  const el = doc.createElement('div');

  // @ts-ignore el
  const { unmount, getByText } = render(<SimpleText />, { container: el });
  const text = getByText('Simple text component');

  assertEquals(text.textContent, 'Simple text component');

  unmount();
  domTeardown();
});
