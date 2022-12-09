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
  fireEvent,
  render,
  waitTick,
} from './util.ts';
import { ButtonClick } from '../src/ButtonClick.tsx';

Deno.test('button click changes state', async () => {
  const doc = domSetup();
  const el = doc.createElement('div');

  const { unmount, getByTestId, getByText } = render(
    <ButtonClick />,
    {
      // @ts-ignore el
      container: el,
    },
  );

  const button = getByTestId('app-button');
  const message1 = getByText('Button was not clicked');

  assert(message1 instanceof el.constructor);

  const buttonProps = findProps(button);

  assert(Object.prototype.hasOwnProperty.call(buttonProps, 'onClick'));
  // @ts-ignore onClick
  buttonProps.onClick();
  // wait for rerender
  await waitTick();

  const message2 = getByText('Button was clicked');

  assert(message1 instanceof el.constructor);
  assertThrows(() => getByText('Button was not clicked'));

  unmount();
  domTeardown();
});
