import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ModalInputRadioTrueFalse = ({ name, initialInput, isRequired, isDisabled, doChange, withLabel, columnSize }) => {
  const { t } = useTranslation()

  const [field, setField] = useState("")

  // CSS classes that are used to declare the class that hides error icons in the input
  const columnWidth = columnSize ? `col-md-${columnSize}` : "col-md-12"

  // state that controls required input error icon 
  const [hasLabel, setHasLabel] = useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line no-unused-vars
  const [isValidInput, setIsValidInput] = useState(undefined)

  useEffect(() => {
    if (withLabel === false) {
      setHasLabel(withLabel)
    }
    const val = initialInput === true ? 'true' : 'false' || 'false'
    setField(val)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialInput])

  const handleInputChange = event => {
    setField(event.target.value)
    doChange({
      target: {
        name,
        value: event.target.value === 'true' ? true : false
      }
    })
  }

  return (
    <div style={{ marginTop: hasLabel ? "-14px" : "0px" }} >

      <div className={hasLabel ? "no-margin" : ""}>
        <div className={isValidInput === true ?
          `${columnWidth} form-group has-success has-feedback ` :
          isValidInput === false ?
            `${columnWidth} form-group has-error has-feedback ` :
            `${columnWidth} form-group has-feedback `}
        >
          {hasLabel ?
            <label className="control-label show-hide" htmlFor={name}>
              {t(name)}{isRequired ? ' *' : ''}
            </label> :
            ''
          }
          <div className="row">
            <div className="col-md-6 radio radio-margin-top">
              <label>
                <input
                  type="radio"
                  className="ace"
                  name={name}
                  value={'true'}
                  checked={field === 'true'}
                  disabled={isDisabled || false}
                  onChange={(e) => handleInputChange(e)} />
                <span className="lbl">{t('yes')}</span>
              </label>
            </div>
            <div className="col-md-6 radio radio-margin-top">
              <label>
                <input
                  type="radio"
                  className="ace"
                  name={name}
                  value={'false'}
                  checked={field === 'false'}
                  disabled={isDisabled || false}
                  onChange={(e) => handleInputChange(e)} />
                <span className="lbl">{t('no')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalInputRadioTrueFalse