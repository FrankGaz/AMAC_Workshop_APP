import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

const ModalInputNumber = ({ input, name, columnSize, withLabel, inputChange, isRequired, greaterThanRequirement }) => {
    const { t } = useTranslation()

    const [field, setField] = useState("")
    const [hasLabel, setHasLabel] = useState(true)
    // CSS classes that are used to declare the class that hides error icons in the input
    const collapseElementClass = "collapse"
    const showElementClass = ""

    // state that controls required input error icon 
    const [showRequiredError, setShowRequiredError] = useState(collapseElementClass)
    // state that regulates that the number can't be zero
    const [showMaxLengthEror, setShowMaxLengthError] = useState(collapseElementClass)
    // state that regulates whether the input has already been used.
    const [showNotANumberError, setShowNotANumberError] = useState(collapseElementClass)
    // state that regulates whether the input has already been used.
    const [showSmallerThanRequirementError, setShowSmallerThanRequirementError] = useState(collapseElementClass)

    const [isValidInput, setIsValidInput] = useState(undefined)

    useEffect(() => {
        if (withLabel === false) {
            setHasLabel(withLabel)
        }
        if (input) {
            setField(input)
            validations(input)
            document.addEventListener('keydown', handleReturnPress)
        }
        return (() => {
            setField("")
            setIsValidInput(undefined)
            setShowRequiredError(collapseElementClass)
            setShowSmallerThanRequirementError(collapseElementClass)
            document.removeEventListener('keydown', handleReturnPress)
        })
    }, [input, withLabel])

    const handleReturnPress = e => {
        if (e.keyCode === 13) {
            e.target.blur()
        }
    }

    const validations = (value, event) => {
        let eventName
        if(event){
            const {
                target = {}
            } = event        
            const { name } = target
            eventName = name
        }
        if (isNaN(value)) {
            setIsValidInput(false)
            return setShowNotANumberError(showElementClass)
        } else {
            if (!_.isNull(value) && !_.isUndefined(value)) {
                if (!_.isNull(greaterThanRequirement) && !_.isUndefined(greaterThanRequirement)) {
                    if (+value <= +greaterThanRequirement) {
                        setShowSmallerThanRequirementError(showElementClass)
                        setIsValidInput(false)
                    }
                    if (+value > +greaterThanRequirement) {
                        setIsValidInput(true)
                        setShowSmallerThanRequirementError(collapseElementClass)
                    }
                }
                else {
                    setIsValidInput(true)
                }
            }
            setShowNotANumberError(collapseElementClass)
            setField(value)
            inputChange({
                name: eventName,
                input: value,
                isValidInput
            })
        }
    }

    const handleInputChange = event => {
        const target = event.target
        const value = target.value
        // Validations
        if (!value && isRequired) {
            setShowRequiredError("")
            setIsValidInput(false)
        } else {
            setShowRequiredError(collapseElementClass)
        }
        validations(value, event)
    }


    return (
        <div className={isValidInput === true ?
            `col-md-${columnSize || 3} form-group has-success has-feedback animate-input ` :
            isValidInput === false ? `col-md-${columnSize || 3} form-group has-error has-feedback animate-input ` :
                `col-md-${columnSize || 3} form-group has-feedback animate-input`}>

            {hasLabel ? <label className="control-label show-hide" htmlFor="name">{t(name)} *</label> : null}
            <span className="block input-icon input-icon-right">
                <input
                    onChange={handleInputChange}
                    type="text"
                    name={name}
                    id="name"
                    className="form-control"
                    value={field || ""}
                    placeholder={t(name)}
                    required maxLength="76" />
                {isValidInput === true ?
                    <i className="ace-icon has-success fa fa-check-circle" ></i> :
                    isValidInput === false ? <i className="ace-icon fa fa-times-circle"></i> :
                        null}
            </span>
            <p className={`help-block form-error ${showNotANumberError}`}><i className="fa fa-warning"></i>  {t('field_required_number')} </p>
            <p className={`help-block form-error ${showRequiredError}`} ><i className="fa fa-warning"></i> {t('field_required_message')}</p>
            <p className={`help-block form-error ${showMaxLengthEror}`} ><i className="fa fa-warning"></i>{t('field_chars_maxlength', { maxlength: 76 })}</p>
            <p className={`help-block form-error ${showSmallerThanRequirementError}`} ><i className="fa fa-warning"></i>{t('field_number_min', { min: greaterThanRequirement })}</p>
        </div>
    )
}
export default ModalInputNumber