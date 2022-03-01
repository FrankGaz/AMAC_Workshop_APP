import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ModalInput = ({ input, name, maxLength, isRequired, doInputChange, isAlreadyUsedError, columnSize }) => {
    const { t } = useTranslation()
    const [field, setField] = useState("")
    // CSS classes that are used to declare the class that hides error icons in the input
    const collapseElementClass = "collapse"
    const showElementClass = ""
    const columnWidth = columnSize ? `col-md-${columnSize}` : "col-md-3"

    // state that controls required input error icon 
    const [showRequiredError, setShowRequiredError] = useState(collapseElementClass)
    const [showMaxLengthError, setShowMaxLengthError] = useState(collapseElementClass)
    const [showAlreadyUsedError, setShowAlreadyUsedError] = useState(collapseElementClass)

    const [isValidInput, setIsValidInput] = useState(undefined)

    useEffect(() => {
        if(input){
            setField(input)
            validations(input)
        }
        setShowAlreadyUsedError(isAlreadyUsedError)

        return (()=> {
            setField("")
            setShowAlreadyUsedError(collapseElementClass)
            setIsValidInput(undefined)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [isAlreadyUsedError, input])

    const validations = value => {
        // Validations
        if (value.length && +value.length < maxLength) {
            setShowRequiredError(collapseElementClass)
            setShowMaxLengthError(collapseElementClass)
            setIsValidInput(true)
        }
        if (+value.length >= maxLength) {
            setShowMaxLengthError(showElementClass)
            setIsValidInput(false)
        }
    }
    const handleInputChange = event => {
        const target = event.target
        const value = target.value
        if (!value.length && isRequired) {
            setShowRequiredError(showElementClass)
            setIsValidInput(false)
        }
        validations(value)
        setField(value)
        doInputChange({
            name,
            input: value,
            isValidInput
        })
    }

    return (
        <div className={isValidInput === true ?
            `${columnWidth} form-group has-success has-feedback animate-input` :
            isValidInput === false ? `${columnWidth} form-group has-error has-feedback animate-input` :
                `${columnWidth} form-group has-feedback animate-input`}>
            <label className="control-label show-hide" htmlFor={name}>{t(name)}{isRequired ? ' *' : ''}</label>
            <span className="block input-icon input-icon-right">
                <input
                    onChange={e => handleInputChange(e)}
                    type="text"
                    id={name}
                    name={name}
                    value={field || ''}
                    className="form-control"
                    placeholder={t(name)}
                    required
                    maxLength={maxLength} />
                {isValidInput === true ?
                    <i className="ace-icon has-success fa fa-check-circle" ></i> :
                    isValidInput === false ? <i className="ace-icon fa fa-times-circle"></i> :
                        null}
            </span>
            <p className={`help-block form-error ${showRequiredError}`} ><i className="fas fa-exclamation-triangle"></i> {t('field_required_message')}</p>
            <p className={`help-block form-error ${showMaxLengthError}`} ><i className="fas fa-exclamation-triangle"></i>{t('field_chars_maxlength', { maxlength: 76 })}</p>
            <p className={`help-block form-error ${showAlreadyUsedError}`} ><i className="fas fa-exclamation-triangle"></i> {t('already_used')}</p>
        </div>
    )
}
export default ModalInput