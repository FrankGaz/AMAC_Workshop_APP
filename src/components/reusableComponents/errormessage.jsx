import React from 'react'
import { useTranslation } from 'react-i18next'

const ErrorMessage = ({ message }) => {
    // Constant that is used to declare the class that hides error icons in the input
    const {t} = useTranslation()
    return (
        <p data-test-id='error' className={`help-block form-error`}><i className={message === ''? null : 'fas fa-exclamation-triangle'}></i>{message === '' ? null : t(message)}</p>
    )
}

export default ErrorMessage