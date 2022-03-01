import React from 'react'
import { useTranslation } from 'react-i18next'

const Label = ({ label, text, columnSize }) => {

    const { t } = useTranslation()

    return (
        <div className={columnSize ? `col-md-${columnSize}` : "col-md-3"}>
            <label className="control-label lbl-input-replace-form-label">
                <strong>{t(label)}</strong>:</label>
            <label className="padding-left12 control-label lbl-input-replace-form"> {t(text)}</label>
        </div>
    )

}

export default Label