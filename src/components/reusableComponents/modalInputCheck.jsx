import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ModalInputCheck = ({ name, initialInput, isRequired, doChange, columnWidth, additionalClasses }) => {
  const { t } = useTranslation()

  const [field, setField] = useState("")

  // CSS classes that are used to declare the class that hides error icons in the input
  const columnSize = columnWidth ? `col-md-${columnWidth}` : "col-md-3"


  useEffect(() => {
    const val = initialInput === true ? 'true' : 'false'
    setField(val)
  }, [initialInput])

  const handleInputChange = event => {
    setField(event.target.value === 'true' ? 'false' : 'true')
    doChange({
      target: {
        name,
        value: event.target.value === 'true' ? false : true
      }
    })
  }

  return (
    <div className={`${columnSize} radio checkbox-margin-top mgn-bttm20 ${additionalClasses ? 'input-group form-group has-feedback  date-input' : ''}`}>
      <label>
        <input
          data-test-id='input'
          type="checkbox"
          className="ace"
          name={name}
          value={field}
          checked={field === 'true'}
          onChange={handleInputChange} />
        <span className="lbl">{t(name)}</span>
      </label>
    </div>
  )
}

export default ModalInputCheck