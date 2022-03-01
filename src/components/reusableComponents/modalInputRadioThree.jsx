import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ModalInputRadioThree = ({
  value1,
  value2,
  value3,
  isRequired,
  isDisabled,
  doChange,
  withLabel,
  columnSize,
  previousSelection,
}) => {
  const { t } = useTranslation();

  const [selectedCheck, setSelectedCheck] = useState("");
  // const [hasLabel, setHasLabel] = useState(true);

  useEffect(() => {
    previousSelection && setSelectedCheck(previousSelection);
  }, [previousSelection]);

  const handleInputChange = (event) => {
    setSelectedCheck(event.target.value);
    doChange({
      target: {
        value: event.target.value,
      },
    });
  };

  return (
    <div className="p-3 is-flex">
      <div className="p-3">
        <label className="radio">
          <input
            type="radio"
            value={value1}
            checked={selectedCheck === value1}
            onChange={(e) => handleInputChange(e)}
            className="mr-2"
          />
          {t(value1)}
        </label>
      </div>
      <div className="p-3">
        <label className="radio">
          <input
            type="radio"
            value={value2}
            checked={selectedCheck === value2}
            onChange={(e) => handleInputChange(e)}
            className="mr-2"
          />
          {t(value2)}
        </label>
      </div>
      <div className="p-3">
        <label className="radio">
          <input
            type="radio"
            value={value3}
            checked={selectedCheck === value3}
            onChange={(e) => handleInputChange(e)}
            className="mr-2"
          />
          {t(value3)}
        </label>
      </div>
    </div>
  );
};

export default ModalInputRadioThree;
