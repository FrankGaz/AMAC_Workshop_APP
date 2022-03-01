import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const ModalInputTextArea = ({
  input,
  name,
  label,
  maxLength,
  withLabel,
  isRequired,
  isValid,
  doInputChange,
  doInputCheck,
  isAlreadyUsedError,
  columnSize,
}) => {
  const { t } = useTranslation();
  const [field, setField] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);
  const [hasLabel, setHasLabel] = useState(true);
  const [displayedLabel, setDisplayedLabel] = useState(" ");
  const inputEl = useRef();

  // CSS classes that are used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";
  const showElementClass = "";
  const columnWidth = columnSize ? `col-md-${columnSize}` : "col-md-12";

  // state that controls required input error icon
  const [showRequiredError, setShowRequiredError] = useState(
    collapseElementClass
  );
  const [showMaxLengthError, setShowMaxLengthError] = useState(
    collapseElementClass
  );
  const [showAlreadyUsedError, setShowAlreadyUsedError] = useState(
    collapseElementClass
  );

  useEffect(() => {
    if (withLabel === false) {
      setHasLabel(withLabel);
    }
    if (label) {
      setDisplayedLabel(label);
    } else {
      setDisplayedLabel(name);
    }
    setField(input);

    return () => {
      setShowRequiredError(collapseElementClass);
      setShowMaxLengthError(collapseElementClass);
      setShowAlreadyUsedError(collapseElementClass);
      setIsValidInput(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const validations = (value) => {
    setIsValidInput(true);
    // Validations
    if (value && value.length && +value.length < maxLength) {
      setShowRequiredError(collapseElementClass);
      setShowMaxLengthError(collapseElementClass);
      setIsValidInput(true);
    }
    if (maxLength && value && +value.length >= maxLength) {
      setShowMaxLengthError(showElementClass);
      setIsValidInput(false);
    }
    if (isRequired && !value && value === "") {
      setShowRequiredError(showElementClass);
      setIsValidInput(false);
    }
    if (!isRequired) {
      setIsValidInput(true);
    }
    if (!value) {
      if (isRequired) {
        setIsValidInput(false);
      } else {
        setIsValidInput(null);
      }
    }
  };

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event;
    setField((prev) => (prev = value));
  };

  const handleInputBlur = (event) => {
    const {
      target: { value },
    } = event;
    validations(value);
    doInputCheck(value, event);
  };

  useEffect(() => {
    //isValid(name, isValidInput)
  }, [isValidInput]);

  useEffect(() => {
    validations(field);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  return (
    // <div className="title-margin-top">
    <div style={{ marginTop: hasLabel ? "-14px" : "0px" }}>
      <div className={hasLabel ? "no-margin" : ""}>
        <div
          className={
            isValidInput === true
              ? `${columnWidth} form-group has-success has-feedback `
              : isValidInput === false
              ? `${columnWidth} form-group has-error has-feedback `
              : `${columnWidth} form-group has-feedback `
          }
        >
          {hasLabel ? (
            <label className="control-label show-hide" htmlFor={displayedLabel}>
              {t(displayedLabel)}
              {isRequired ? " *" : ""}
            </label>
          ) : (
            ""
          )}

          <span className="block input-icon input-icon-right">
            <textarea
              ref={inputEl}
              onChange={(e) => handleInputChange(e)}
              onBlur={(e) => handleInputBlur(e)}
              type="text"
              id={name}
              name={name}
              value={field || ""}
              className="textarea is-size-7 form-control"
              placeholder={t(name)}
              required={isRequired}
              maxLength={maxLength}
            />

            {isValidInput === true ? (
              <i className="ace-icon has-success fa fa-check-circle"></i>
            ) : isValidInput === false ? (
              <i className="ace-icon fa fa-times-circle"></i>
            ) : null}
          </span>
          <p className={`help-block form-error ${showRequiredError}`}>
            <i className="fa fa-warning"></i> {t("field_required_message")}
          </p>
          <p className={`help-block form-error ${showMaxLengthError}`}>
            <i className="fa fa-warning"></i>
            {t("field_chars_maxlength", { maxlength: 76 })}
          </p>
          <p className={`help-block form-error ${showAlreadyUsedError}`}>
            <i className="fa fa-warning"></i> {t("already_used")}
          </p>
        </div>
      </div>
    </div>
  );
};
export default ModalInputTextArea;
