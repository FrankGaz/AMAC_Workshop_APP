import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";

/*
  This component has been superseded by FieldSelect.
  Main change is return type for the selct
*/

const FieldInputSelect = ({
  name,
  items,
  columnWidth,
  withLabel,
  initialInput,
  initialOption,
  isRequired,
  doChange,
  isDisabled,
}) => {
  const { t } = useTranslation();

  const [field, setField] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [hasLabel, setHasLabel] = useState(false);
  // CSS classes that are used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";
  const showElementClass = "";

  // state that controls required input error icon
  const [showRequiredError, setShowRequiredError] = useState(
    collapseElementClass
  );
  const [isValidInput, setIsValidInput] = useState(undefined);

  useEffect(() => {
    if (withLabel === false) {
      setHasLabel(withLabel);
    } else {
      setHasLabel(true);
    }
    if (!_.isNull(initialInput)) {
      setField(initialInput !== "" ? initialInput : "");
    }
    setFieldName(initialOption);
  }, [initialInput, initialOption]);

  const validations = (value) => {
    setIsValidInput(true);

    // Validations
    if (isRequired && value === "") {
      setShowRequiredError(showElementClass);
      setIsValidInput(false);
    }
    if (!isRequired) {
      setIsValidInput(true);
    }
    if (+value !== 0) {
      setIsValidInput(true);
    }
    if (value === "") {
      setIsValidInput(null);
    }
  };

  const handleInputChange = (event) => {
    const {
      target: { value, name },
    } = event;
    setField(value);
    setFieldName(name);
  };

  useEffect(() => {
    if (field !== "") {
      validations(field);
      doChange({
        target: {
          name: fieldName,
          value: isNaN(+field) ? field : +field,
        },
      });
    }
  }, [field]);

  return (
    <div style={{ marginTop: hasLabel ? "-14px" : "0px" }}>
      <div
        className={
          isValidInput === true
            ? `col-md-${columnWidth || 12} form-group has-feedback `
            : isValidInput === false
            ? `col-md-${columnWidth || 12} form-group has-error has-feedback `
            : `col-md-${columnWidth || 12} form-group has-feedback `
        }
      >
        {hasLabel ? (
          <label className="control-label show-hide" htmlFor={name}>
            {hasLabel ? t(name) : ""}
            {isRequired ? " *" : ""}
          </label>
        ) : null}

        <span className="block input-icon input-icon-right">
          <select
            onChange={handleInputChange}
            name={name}
            id={hasLabel ? "" : "no-margins"}
            className="form-control"
            value={field}
            disabled={isDisabled || false}
          >
            <option value={0}>{t("choose") + " " + t(name)}</option>
            {items
              ? items.map((option, index) => {
                  return (
                    <option key={index} value={option.id}>
                      {" "}
                      {t(option && option.name)}{" "}
                    </option>
                  );
                })
              : null}
          </select>
        </span>
      </div>
    </div>
  );
};

export default FieldInputSelect;
