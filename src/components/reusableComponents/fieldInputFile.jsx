import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FieldInputFile = ({ input, name, maxLength, withLabel, isRequired, isValid, columnSize, hasActivator, activator, doModalClick, doInputCheck }) => {
  const { t } = useTranslation()
  const [field, setField] = useState('')
  const [isValidInput, setIsValidInput] = useState(false)
  const [hasLabel, setHasLabel] = useState(true)

  // CSS classes that are used to declare the class that hides error icons in the input
  const collapseElementClass = 'collapse'
  const showElementClass = ''
  const columnWidth = columnSize ? `col-md-${columnSize}` : "col-md-3"


  // state that controls required input error icon 
  // eslint-disable-next-line no-unused-vars
  const [showRequiredError, setShowRequiredError] = useState(collapseElementClass)


  useEffect(() => {
    if (withLabel === false) {
      setHasLabel(withLabel)
    }
    validations(input)
    setField(input)
    document.addEventListener('keydown', handleReturnPress)
    return (() => {
      setField('')
      setIsValidInput(undefined)
      document.removeEventListener('keydown', handleReturnPress)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  const handleReturnPress = e => {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }

  const validations = value => {
    // Validations
    if (value === '' && isRequired) {
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

  const handleInputChange = event => {
    const e = event.target
    setIsValidInput(true)
    validations(e.value)
    setField(prev => (prev = e.files[0]))
    doInputCheck(field, event)
  }

  useEffect(() => {
    isValid(name, isValidInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidInput])

  return (
    <div className={`${columnWidth} form-group has-feedback`}>
      {hasLabel ? <label className="control-label show-hide" htmlFor="file">{t('attached_file')} *</label> : null}

      <label className="ace-file-input">

        <input
          type="file"
          name={name}
          className="form-control"
          onChange={(e) => handleInputChange(e)}
          required={isRequired}
        />

        <span className="ace-file-container" data-title={t('choose')}>
          {field ?
            (<span className="ace-file-name" data-title={(field && field.name) || ''}>
              <i className="ace-icon fa fa-upload"></i>
            </span>) :
            (<span ng-show="!isUndNull(attachedFiles.file)" className="ace-file-name" data-title={field && field.name}>
              <i className="ace-icon fa fa-upload"></i>
            </span>)
          }
        </span>

        <a className="remove" href="#/"><i className="ace-icon fa fa-times"></i></a>
      </label>
    </div>
  )
}

export default FieldInputFile
