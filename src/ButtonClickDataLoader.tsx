// Component that loads data with `fetch`.
// Begins loading data after its button is clicked.

import React from 'react';

import { useDataLoad } from './useDataLoad.ts';

const { useState, useEffect } = React;

type Props = {
  url: string;

  // Get a ref to the handleButtonClick function if you need it
  handleButtonClickRef?: React.MutableRefObject<() => void>;
};

export function ButtonClickDataLoader({ url, handleButtonClickRef }: Props) {
  const [clicked, setClicked] = useState<boolean>(false);
  const dataLoadState = useDataLoad(url);
  let message = 'Hmmm...';
  let testId = 'unknown';

  useEffect(() => {
    if (handleButtonClickRef) {
      handleButtonClickRef.current = handleButtonClick;
    }
  }, [handleButtonClickRef]);

  function handleButtonClick() {
    if (clicked) {
      return;
    }

    setClicked(true);
    dataLoadState.startLoad();
  }

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

  return (
    <div>
      <button data-testid='app-button' onClick={handleButtonClick} />
      <div data-testid={testId}>{message}</div>
    </div>
  );
}
