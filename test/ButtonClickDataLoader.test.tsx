import React from 'react';
import {
  assert,
  assertEquals,
  assertStringIncludes,
  assertThrows,
} from 'std/testing/asserts.ts';

import {
  domSetup,
  domTeardown,
  findProps,
  mockFetch,
  render,
  waitFor,
  waitTick,
} from './util.ts';
import { ButtonClickDataLoader } from '../src/ButtonClickDataLoader.tsx';

const DICTIONARY = ['BLAME'];

Deno.test('button click loads data', async () => {
  const doc = domSetup();
  const el = doc.createElement('div');

  mockFetch.install();

  mockFetch.mock('GET@/dictionary', () => {
    return new Response(JSON.stringify(DICTIONARY), {
      status: 200,
      headers: new Headers([
        ['content-type', 'application/json'],
      ]),
    });
  });

  const { unmount, getByTestId, getByText } = render(
    <ButtonClickDataLoader url='/dictionary' />,
    {
      // @ts-ignore el
      container: el,
    },
  );

  const initial = getByTestId('initial-message');
  const button = getByTestId('app-button');
  assertEquals(initial.textContent, 'Data has not loaded');

  assertThrows(() => getByTestId('loading-message'));
  assertThrows(() => getByTestId('loaded-message'));
  assertThrows(() => getByTestId('error-message'));

  const buttonProps = findProps(button);

  assert(Object.prototype.hasOwnProperty.call(buttonProps, 'onClick'));
  // @ts-ignore onClick
  buttonProps.onClick();

  // wait for fetch complete
  await waitTick();

  // wait for rerender
  await waitTick();

  assertThrows(() => getByTestId('initial-message'));
  assertThrows(() => getByTestId('loading-message'));
  assertThrows(() => getByTestId('error-message'));

  const loaded = getByTestId('loaded-message');
  assertEquals(loaded.textContent, DICTIONARY.join(', '));

  mockFetch.reset();
  mockFetch.uninstall();
  unmount();

  domTeardown();
});
