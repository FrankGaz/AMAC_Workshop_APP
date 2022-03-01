import React from 'react'
import {useTranslation} from 'react-i18next'

const ExportButton = ({ doExport }) => {
    const { t } = useTranslation()
    
    return (
    <div className='col-gray-bg side-paddings'>
        <button type="button" onClick={() => doExport({})} className="btn btn-primary block btn-sm full ng-scope">
            <span><i className="ace-icon fa fa-upload"></i> {t('export')}</span>
        </button>
    </div>
)}
export default ExportButton