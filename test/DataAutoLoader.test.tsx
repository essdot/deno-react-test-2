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
  mockFetch,
  render,
  waitFor,
  waitTick,
} from './util.ts';
import { DataAutoLoader } from '../src/DataAutoLoader.tsx';

const DICTIONARY = ['BLAME'];

Deno.test('fetch loads data', async () => {
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

  const { unmount, debug, getByTestId, container } = render(
    <DataAutoLoader url='/dictionary' />,
    // @ts-ignore el
    { container: el },
  );

  const loading = getByTestId('initial-message');
  assertEquals(loading.textContent, 'Data has not loaded');

  assertThrows(() => getByTestId('loading-message'));
  assertThrows(() => getByTestId('loaded-message'));
  assertThrows(() => getByTestId('error-message'));

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

Deno.test('fetch returns error', async () => {
  const doc = domSetup();
  const el = doc.createElement('div');

  mockFetch.install();

  mockFetch.mock('GET@/dictionary', () => {
    return new Response('', {
      status: 500,
    });
  });

  const { unmount, debug, getByTestId, container } = render(
    <DataAutoLoader url='/dictionary' />,
    // @ts-ignore el
    { container: el },
  );

  const loading = getByTestId('initial-message');
  assertEquals(loading.textContent, 'Data has not loaded');

  assertThrows(() => getByTestId('loading-message'));
  assertThrows(() => getByTestId('loaded-message'));
  assertThrows(() => getByTestId('error-message'));

  // wait for fetch complete
  await waitTick();

  // wait for rerender
  await waitTick();

  assertThrows(() => getByTestId('initial-message'));
  assertThrows(() => getByTestId('loading-message'));
  assertThrows(() => getByTestId('loaded-message'));

  const err = getByTestId('error-message');
  assertStringIncludes(err.textContent || '', 'Error:');

  mockFetch.reset();
  mockFetch.uninstall();
  unmount();

  domTeardown();
});
