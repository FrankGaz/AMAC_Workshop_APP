import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * Use `FieldInputMask` to highlight key info with a predefined status.
 */
const FieldInputMask = ({
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
  activator,
  doModalClick,
  doInputCheck,
  doInputBlurCheck,
  isAngular,
  module,
  currency
}) => {
  const { t } = useTranslation();
  // const [field, setField] = useState({original: null, masked: ""});
  const [field, setField] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isValidInput, setIsValidInput] = useState(null);
  const [hasLabel, setHasLabel] = useState(false);
  const [displayedLabel, setDisplayedLabel] = useState(' ');
  const inputEl = useRef();

  const [show, setShow] = useState(null);
  // const [masked, setMasked] = useState("");

  // CSS classes that are used to declare the class that hides error icons in the input
  const collapseElementClass = 'collapse';
  const showElementClass = '';
  // const columnWidth = columnSize ? `col-md-${columnSize}` : "col-md-12"
  const columnWidth = columnSize ? `col-md-12` : 'col-md-12';

  // state that controls required input error icon
  const [showRequiredError, setShowRequiredError] = useState(
    collapseElementClass
  );
  const [showIsNumber, setShowIsNumber] = useState(collapseElementClass);
  const [showIsPercent, setShowIsPercent] = useState(collapseElementClass);
  const [showIsPhone, setShowIsPhone] = useState(collapseElementClass);
  const [showMaxLengthError, setShowMaxLengthError] = useState(
    collapseElementClass
  );

  useEffect(() => {
    if (isRequired && !isTouched) {
      setIsValidInput(false);
    }
    if (input) {
      setIsValidInput(true);
      setIsTouched(true);
    }
    // setField({...field, original: input, masked: maskField(input) });
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

  const validations = value => {
    setIsValidInput(true);
    // Validations
    //
    if (maxLength && value && +value.length < maxLength) {
      setShowRequiredError(collapseElementClass);
      setShowMaxLengthError(collapseElementClass);
      setIsValidInput(true);
    }
    if (minLength && value && +value.length < minLength) {
      setShowRequiredError(collapseElementClass);
      setShowMaxLengthError(showElementClass);
      setIsValidInput(false);
    }

    if (maxLength && value && +value.length >= maxLength) {
      setShowMaxLengthError(showElementClass);
      setIsValidInput(false);
    }
    if (isRequired && !value && value === '') {
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
  }

  const handleInputChange = event => {
    const {
      target: { value }
    } = event;
    setIsTouched(true);

    // if (show) {
    //   setField(prev => ({
    //     ...field,
    //     original: value,
    //     masked: maskField(value)
    //   }));
    // } else {
    //   let nuevoValor
    //   if ( field.original.length < value.length) {
    //     const lastDigit = value.substring(value.length - 1, value.length)
    //     nuevoValor = field.original + lastDigit
    //   } else {
    //     nuevoValor = field.original.substring(0, value.length)
    //   }
    //   setField(prev => ({
    //     ...field,
    //     original: nuevoValor,
    //     masked: maskField(nuevoValor)
    //   }));
    // }
    setField(value);
    doInputCheck(value, event);
  };

  const maskField = text => (
    text && "・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・・".substring(0, text.length) || ""
  )

  const handleInputBlur = event => {
    if (doInputBlurCheck) {
      setIsTouched(true);
      validations(field);
      doInputBlurCheck(field, event);
    }
  };

  const handleModalClick = e => {
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
      style={
        isAngular
          ? { marginTop: hasLabel ? '-14px' : '0px', paddingLeft: '0px' }
          : { marginTop: hasLabel ? '-14px' : '0px' }
      }
    >
      <div className="row">
        <div className="col-md-12">
          {hasLabel ? (
            <label className="control-label show-hide" htmlFor={displayedLabel}>
              {t(displayedLabel)}
              {isRequired ? ' *' : ''} {currency}
            </label>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="row">
        <div className={hasActivator && activator ? 'col-md-10' : 'col-md-12'}>
          <div className=" input-icon input-icon-right">
            {!show && <div style={{position: "absolute", left: "8px", top: "6px", backgroundColor: "white"}}>{maskField(field)}</div>}
            <input
              ref={inputEl}
              onChange={e => handleInputChange(e)}
              onBlur={e => handleInputBlur(e)}
              type="text"
              name={name}
              // value={show ? field.original : field.masked}
              value={field}
              className={'form-control'}
              placeholder={t(name)}
              required={isRequired}
              disabled={isDisabled}
              maxLength={maxLength}
              autoComplete="off"
            />
            {/* show password */}
            {show ? 
              <i
                className="ace-icon fa fa-eye-slash bigger-110"
                onClick={() => setShow(!show)}
              ></i>
            :
              <i
                className="ace-icon fa fa-eye bigger-110"
                onClick={() => setShow(!show)}
              ></i>
            }

          </div>
        </div>

      </div>
      <div className="row">
        <div className="col-md-12">
          {showRequiredError !== 'collapse' && (
            <p className={`help- block form-error ${showRequiredError}`}>
              <i className="fa fa-warning"></i> {t('field_required_message')}
            </p>
          )}
          {showMaxLengthError !== 'collapse' && (
            <p className={`help-block form-error ${showMaxLengthError}`}>
              <i className="fa fa-warning"></i>
              {t('field_chars_maxlength', {
                maxlength: maxLength,
                minLength
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

FieldInputMask.propTypes = {
  input: PropTypes.string,
  label: PropTypes.string
};
FieldInputMask.displayName = 'FieldInputMask';
export default FieldInputMask;