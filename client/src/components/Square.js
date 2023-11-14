import React from "react";

function Square({ chooseSquare, val, row, column }) {
  let ariaLabel;

  if (val === "X") {
    ariaLabel = `Row ${row}, Column ${column}: This square contains a cross`;
  } else if (val === "O") {
    ariaLabel = `Row ${row}, Column ${column}: This square contains a circle`;
  } else {
    ariaLabel = `Row ${row}, Column ${column}: This square is currently empty. Press enter to choose this square`;
  }

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" || event.type === "click") {
      chooseSquare();
    }
  };

  return (
    <div
      className="square"
      onKeyPress={handleKeyPress}
      onClick={handleKeyPress}
      aria-label={ariaLabel}
      tabIndex="0"
    >
      <span role="presentation" aria-hidden="true">
        {val}{" "}
      </span>
    </div>
  );
}

export default Square;
