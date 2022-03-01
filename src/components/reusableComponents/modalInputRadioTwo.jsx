import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ModalInputRadioTwo = ({
  value1,
  value2,
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
    <div className="control is-flex">
      <div className="">
        <label className="radio">
          <input
            type="radio"
            className="ace"
            value={value1}
            checked={selectedCheck === value1}
            onChange={(e) => handleInputChange(e)}
            disabled={isDisabled}
          />
          <span className="lbl ml-2">{t(value1)}</span>
        </label>
      </div>
      <div className="ml-5">
        <label className="radio">
          <input
            type="radio"
            className="ace"
            value={value2}
            checked={selectedCheck === value2}
            onChange={(e) => handleInputChange(e)}
            disabled={isDisabled}
          />
          <span className="lbl ml-2">{t(value2)}</span>
        </label>
      </div>
    </div>
  );
};

export default ModalInputRadioTwo;
