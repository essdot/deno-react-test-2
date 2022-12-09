// Component that uses `useState` to track whether
// its button was clicked.

import React from 'react';

const { useState, useEffect } = React;

type Props = {
  // Get a ref to the handleButtonClick function if you need it
  handleButtonClickRef?: React.MutableRefObject<() => void>;
};

export function ButtonClick({ handleButtonClickRef }: Props) {
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (handleButtonClickRef) {
      handleButtonClickRef.current = handleButtonClick;
    }
  }, [handleButtonClickRef]);

  const handleButtonClick = () => setClicked(true);

  return (
    <div>
      <h1>Button click component</h1>
      <div>
        <button
          data-testid='app-button'
          onClick={handleButtonClick}
        />
      </div>
      <div>{clicked ? 'Button was clicked' : 'Button was not clicked'}</div>
    </div>
  );
}
