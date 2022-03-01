import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'

const ConfirmActionMessage = ({ message, type, showMessage, closeMessage, children }) => {
    // hook that manages translations
    const { t } = useTranslation()

    const [msgType, setMsgType] = useState('success')
    useEffect(() => {
        if (type)
            setMsgType(type)
    }, [type])

    const collapseElementClass = "collapse"

    const handleCloseComponentClick = () => {
        closeMessage()
    }

    return (
        <div
            data-test-id='confirmActionMessage'
            onClick={handleCloseComponentClick}
            className={showMessage ? "global-alerts" : `${collapseElementClass}`}
        >
            <div data-test-id='confirmActionMessageChild' className={`alert alert-${msgType} global-alert pointer close-on-hover`}>
                <button type="button" className="close">
                    <i className="alert-icon fa-fw fa fa-times"></i>
                </button>
                <strong>
                    {msgType === 'success' && <i className="alert-icon fa-fw fa fa-check" ></i>}
                    {msgType === 'info' && <i className="alert-icon fa-fw fa fa-info-circle" ></i>}
                    {msgType === 'warning' && <i className="alert-icon fa-fw fas fa-exclamation-triangle" ></i>}
                    {msgType === 'danger' && <i className="alert-icon fa-fw fa fa-times" ></i>}
                </strong>
                {t(message)}

                {children}
                
                <br />
            </div>
        </div >
    )
}
export default ConfirmActionMessage