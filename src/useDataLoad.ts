import React from 'react';

type DataLoadStateBase = {
  startLoad: () => void;
};

type DataLoadStateInitial = DataLoadStateBase & {
  isInitial: true;
  isLoading: false;
  isError: false;
  data: null;
  error: null;
};

type DataLoadStateLoading = DataLoadStateBase & {
  isInitial: false;
  isLoading: true;
  isError: false;
  data: null;
  error: null;
};

type DataLoadStateLoaded = DataLoadStateBase & {
  isInitial: false;
  isLoading: false;
  isError: false;
  data: { [s in string]: unknown } | Array<unknown>;
  error: null;
};

type DataLoadStateError = DataLoadStateBase & {
  isInitial: false;
  isLoading: false;
  isError: true;
  data: null;
  error: string;
};

export type DataLoadState =
  | DataLoadStateInitial
  | DataLoadStateLoading
  | DataLoadStateLoaded
  | DataLoadStateError;

const { useState } = React;

export function useDataLoad(url: string): DataLoadState {
  const initialState: DataLoadState = {
    isInitial: true,
    isLoading: false,
    isError: false,
    data: null,
    error: null,
    startLoad,
  };

  const [dataLoadState, setDataLoadState] = useState<DataLoadState>(
    initialState,
  );

  function startLoad() {
    if (dataLoadState.isInitial) {
      fetchData(url, onDataLoaded, onDataLoadError);
      setDataLoadState({
        isInitial: false,
        isLoading: true,
        isError: false,
        data: null,
        error: null,
        startLoad,
      });
    } else {
      throw new Error('dataLoadState is not initial');
    }
  }

  function onDataLoaded(data: unknown) {
    if (Array.isArray(data)) {
      const newDataLoadState: DataLoadState = {
        isInitial: false,
        isLoading: false,
        isError: false,
        data: data.slice(),
        startLoad,
        error: null,
      };

      setDataLoadState(newDataLoadState);
    } else {
      console.log('dictionary data', data);

      onDataLoadError('Didn\'t get array for dictionary');
    }
  }

  function onDataLoadError(error: string) {
    const newDataLoadState: DataLoadState = {
      isInitial: false,
      isLoading: false,
      isError: true,
      data: null,
      startLoad,
      error,
    };

    setDataLoadState(newDataLoadState);
  }

  return dataLoadState;
}

function fetchData(
  url: string,
  onLoad: (data: unknown) => void,
  onError: (error: string) => void,
) {
  try {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // const json = await response.json();
        onLoad(data);
      })
      .catch((error) =>
        onError(typeof error === 'string' ? error : error.toString())
      );
  } catch (e) {
    onError(e.toString());
  }
}
