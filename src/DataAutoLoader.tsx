// Component that loads data with `fetch`.
// Uses `useEffect` to begin loading the data
// automatically on mount/first render.

import React from 'react';

import { useDataLoad } from './useDataLoad.ts';

type Props = {
  url: string;
};

const { useEffect } = React;

export function DataAutoLoader({ url }: Props) {
  const dataLoadState = useDataLoad(url);
  let message = 'Hmmm...';
  let testId = 'unknown';

  useEffect(() => {
    if (dataLoadState.isInitial) {
      setTimeout(() => dataLoadState.startLoad(), 0);
    }
  });

  if (dataLoadState.isInitial) {
    testId = 'initial-message';
    message = 'Data has not loaded';
  } else if (dataLoadState.isLoading) {
    testId = 'loading-message';
    message = 'Data is loading';
  } else if (dataLoadState.data !== null) {
    testId = 'loaded-message';
    const { data } = dataLoadState;

    message = Array.isArray(data) ? data.join(', ') : String(data);
  } else if (dataLoadState.isError) {
    testId = 'error-message';
    const { error } = dataLoadState;

    message = 'Error: ' + error;
  }

  return <div data-testid={testId}>{message}</div>;
}
