import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

/**
 * Use `FieldInput` to highlight key info with a predefined status.
 */
const FieldInput = ({
  input,
  name,
  label,
  minLength,
  maxLength,
  withLabel,
  isRequired,
  isDisabled,
  isValid,
  isNumber,
  isPercent,
  isPhone,
  columnSize,
  hasActivator,
  isNotAlone,
  activator,
  doModalClick,
  doInputCheck,
  onKeyUp,
  doInputBlurCheck,
  isAngular,
  isSmall,
  module,
  currency,
}) => {
  const { t } = useTranslation();
  const [field, setField] = useState(null);
  const [isTouched, setIsTouched] = useState(false);
  const [isValidInput, setIsValidInput] = useState(null);
  const [hasLabel, setHasLabel] = useState(false);
  const [displayedLabel, setDisplayedLabel] = useState(" ");
  const inputEl = useRef();

  // CSS classes that are used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";
  const showElementClass = "";
  // const columnWidth = columnSize ? `col-md-${columnSize}` : "col-md-12"
  const columnWidth = columnSize ? `col-md-12` : "col-md-12";

  // state that controls required input error icon
  const [showRequiredError, setShowRequiredError] =
    useState(collapseElementClass);
  const [showIsNumber, setShowIsNumber] = useState(collapseElementClass);
  const [showIsPercent, setShowIsPercent] = useState(collapseElementClass);
  const [showIsPhone, setShowIsPhone] = useState(collapseElementClass);
  const [showMaxLengthError, setShowMaxLengthError] =
    useState(collapseElementClass);
  const [showMinLengthError, setShowMinLengthError] =
    useState(collapseElementClass);

  useEffect(() => {
    if (isRequired && !isTouched) {
      setIsValidInput(false);
    }
    if (input) {
      setIsValidInput(true);
      setIsTouched(true);
    }
    setField(input);
  }, [input, label]);

  useEffect(() => {
    setHasLabel(withLabel);
  }, [withLabel]);

  useEffect(() => {
    if (withLabel === false) {
      setHasLabel(false);
    } else {
      setHasLabel(true);
      if (label) {
        setDisplayedLabel(label);
      } else {
        setDisplayedLabel(name);
      }
    }
  }, [withLabel, name, label]);

  const validations = (value) => {
    setIsValidInput(true);
    // Validations
    //
    if (maxLength && value && +value.length < maxLength) {
      setShowRequiredError(collapseElementClass);
      setShowMaxLengthError(collapseElementClass);
      setIsValidInput(true);
    }
    if (minLength && value && +value.length >= minLength) {
      setShowRequiredError(collapseElementClass);
      setShowMinLengthError(collapseElementClass);
      setIsValidInput(true);
    }

    if (maxLength && value && +value.length >= maxLength) {
      setShowMaxLengthError(showElementClass);
      setIsValidInput(false);
    }
    if (minLength && value && +value.length < minLength) {
      setShowMinLengthError(showElementClass);
      setIsValidInput(false);
    }
    if (isRequired && !value && value === "") {
      setShowRequiredError(showElementClass);
      setIsValidInput(false);
    }
    if (!isRequired) {
      setShowRequiredError(collapseElementClass);
      setIsValidInput(true);
    }
    if (!value) {
      if (isRequired) {
        setIsValidInput(false);
      } else {
        setShowRequiredError(collapseElementClass);
        setIsValidInput(null);
      }
    }

    // regex
    const regex = RegExp("^[0-9]*([.\\,]*[0-9]+)?$");
    const regexPhone = RegExp("^[\\d\\s]+$");
    // only numbers
    if (isNumber && value && !regex.test(value)) {
      setIsValidInput(false);
      setShowIsNumber(showElementClass);
    } else {
      setShowIsNumber(collapseElementClass);
    }
    // only percentages
    if (isPercent && value && (!regex.test(value) || +value >= 101)) {
      setIsValidInput(false);
      setShowIsPercent(showElementClass);
    } else {
      setShowIsPercent(collapseElementClass);
    }
    // only phones
    if (isPhone && value && !regexPhone.test(value)) {
      setIsValidInput(false);
      setShowIsPhone(showElementClass);
    } else {
      setShowIsPhone(collapseElementClass);
    }
  };

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event;
    setIsTouched(true);
    setField((prev) => (prev = value));
    doInputCheck(field, event);
  };

  const handleInputBlur = (event) => {
    // if (event && event.target) {
    if (doInputBlurCheck) {
      setIsTouched(true);
      validations(field);
      doInputBlurCheck(field, event);
    }
  };

  const handleModalClick = (e) => {
    e.preventDefault();
    doModalClick();
  };

  useEffect(() => {
    isValid(name, isValidInput);
  }, [isValidInput]);

  useEffect(() => {
    if (isTouched) {
      validations(field);
    }
  }, [field, isTouched]);

  return (
    <div
      className={
        isValidInput === true
          ? `${columnWidth} form-group has-feedback `
          : isValidInput === false
          ? `${columnWidth} form-group has-error has-feedback `
          : `${columnWidth} form-group has-feedback `
      }
      style={{ marginTop: hasLabel ? "-14px" : "0px" }}
    >
          {hasLabel ? (
            <label className="label show-hide" htmlFor={displayedLabel}>
              {t(displayedLabel)}
              {isRequired ? " " : ""} {currency}
            </label>
          ) : (
            ""
          )}
      <div className={isNotAlone ? "py-2" : ""}>
        <div className={hasActivator && activator ? "" : ""}>
          <div className="input-icon input-icon-right">
            <input
              ref={inputEl}
              onChange={(e) => handleInputChange(e)}
              onKeyUp={onKeyUp}
              onBlur={(e) => handleInputBlur(e)}
              type="text"
              name={name}
              value={field || ""}
              className={isSmall ? "input is-small" : "input"}
              placeholder={t(name)}
              required={isRequired}
              // disabled={isDisabled || hasActivator}
              disabled={isDisabled}
              maxLength={maxLength}
              minLength={minLength}
              autoComplete="off"
            />
          </div>
        </div>
        {hasActivator && activator && (
          // <Check module={module || name} action="list">
          <div
            className="col-md-2 btn-widget-input-sh"
            style={{
              paddingLeft: "0px",
              marginLeft: "-8px",
              textAlign: "right",
            }}
          >
            <button
              onClick={handleModalClick}
              className="btn btn-primary btn-block btn-sm"
            >
              <i className="fa fa-search" />
            </button>
          </div>
          // </Check>
        )}
      </div>
      <div className="row">
        <div className="col-md-12">
          {showRequiredError !== "collapse" && (
            <p className={`help- block form-error ${showRequiredError}`}>
              <i className="fa fa-warning"></i> {t("field_required_message")}
            </p>
          )}
          {showIsNumber !== "collapse" && (
            <p className={`help- block form-error ${showIsNumber}`}>
              <i className="fa fa-warning"></i> {t("field_required_number")}
            </p>
          )}
          {showIsPercent !== "collapse" && (
            <p className={`help- block form-error ${showIsNumber}`}>
              <i className="fa fa-warning"></i> {t("field_required_percent")}
            </p>
          )}
          {showIsPhone !== "collapse" && (
            <p className={`help- block form-error ${showIsPhone}`}>
              <i className="fa fa-warning"></i> {t("field_required_phone")}
            </p>
          )}
          {showMaxLengthError !== "collapse" && (
            <p className={`help-block form-error ${showMaxLengthError}`}>
              <i className="fa fa-warning"></i>
              {t("field_chars_maxlength", {
                maxlength: maxLength,
              })}
            </p>
          )}
          {showMinLengthError !== "collapse" && (
            <p className={`help-block form-error ${showMinLengthError}`}>
              <i className="fa fa-warning"></i>
              {t("field_chars_minlength", {
                minlength: minLength,
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

FieldInput.propTypes = {
  input: PropTypes.string,
  label: PropTypes.string,
};
FieldInput.displayName = "FieldInput";
export default FieldInput;
