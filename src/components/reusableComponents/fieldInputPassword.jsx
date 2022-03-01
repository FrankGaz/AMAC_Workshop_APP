import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FieldInputPassword = ({ input, name, maxLength, withLabel, isRequired, isValid, columnSize, hasActivator, activator, doModalClick, doInputCheck, keyPress,  autoComplete, onPaste }) => {
    const { t } = useTranslation()
    const [field, setField] = useState('')
    const [isValidInput, setIsValidInput] = useState(false)
    const [hasLabel, setHasLabel] = useState(true)
  
    // CSS classes that are used to declare the class that hides error icons in the input
    const collapseElementClass = 'collapse'
    const showElementClass = ''
    const columnWidth = columnSize ? `col-md-${columnSize}` : "col-md-3"
  
    // state that controls required input error icon 
    const [showRequiredError, setShowRequiredError] = useState(collapseElementClass)
    const [showMaxLengthError, setShowMaxLengthError] = useState(collapseElementClass)
  
    useEffect(() => {
  
      if (withLabel === false) {
        setHasLabel(withLabel)
      }
      setField(input)
  
      //document.addEventListener('keydown', handleReturnPress)
      return (() => {
        //document.removeEventListener('keydown', handleReturnPress)
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input])
  

  
    const validations = value => {
      // Validations
      if (maxLength && value && +value.length < maxLength) {
        setShowRequiredError(collapseElementClass)
        setShowMaxLengthError(collapseElementClass)
        setIsValidInput(true)
      }
      if (maxLength && value && +value.length >= maxLength) {
        setShowMaxLengthError(showElementClass)
        setIsValidInput(false)
      }
      if (isRequired && !value && value === '') {
        setShowRequiredError(showElementClass)
        setIsValidInput(false)
      }
      if (!isRequired) {
        setIsValidInput(true)
      }
      
      if (!value) {
        if (isRequired) {
          setIsValidInput(false)
        } else {
          setIsValidInput(null)
        }
      }
    }
    
    //Prevent paste in pasword fields
    const handleInputPaste = (e) => {
      e.preventDefault();
    };
  
    const handleInputChange = event => {
      const { target: { value } } = event
      setField(value)
      validations(value)
      doInputCheck(value,event)
    }
  
    const handleInputBlur = event => {
      const { target: { value } } = event
      validations(value)
      doInputCheck(value, event)
    }
  
    useEffect(() => {
      isValid(name, isValidInput)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValidInput])
  
    useEffect(() => {
      validations(field)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field])
  
    return (
      <div>
        <div className={isValidInput === true ?
          `${columnWidth} form-group has-success has-feedback animate-input` :
          isValidInput === false ? `${columnWidth} form-group has-error has-feedback animate-input` :
            `${columnWidth} form-group has-feedback animate-input`}>
          {hasLabel ? <label className="label show-hide" htmlFor={name}>{t(name)}{isRequired ? ' ' : ''}</label> : ''}
          <div className="block input-icon input-icon-right">
            <input
              onChange={e => handleInputChange(e)}
              onBlur={e => handleInputBlur(e)}
              type="password"
              id={name}
              name={name}
              value={field || ''}
              className="input"
              placeholder={t(name)}
              required={isRequired}
              disabled={hasActivator && !activator}
              maxLength={maxLength} 
              onKeyUp={keyPress}
              onKeyDown={keyPress}
              onMouseDown={keyPress}
              autoComplete={autoComplete}
              onPaste={handleInputPaste}
              />
          </div>
          <p className={`help-block form-error ${showRequiredError}`} ><i className="fas fa-exclamation-triangle"></i> {t('field_required_message')}</p>
          <p className={`help-block form-error ${showMaxLengthError}`} ><i className="fas fa-exclamation-triangle"></i>{t('field_chars_maxlength', { maxlength: 76 })}</p>
        </div>
        {
          hasActivator && activator && <div className="col-md-1 btn-widget-input-sh">
            <a
              href='#/'
              onClick={doModalClick}
              className="btn btn-primary btn-sm block auto lbl-input-replace-search no-mgn-sm-modal">
              <i className="fa fa-search" />
            </a>
          </div>
        }
      </div >
    )
  }

  export default FieldInputPassword