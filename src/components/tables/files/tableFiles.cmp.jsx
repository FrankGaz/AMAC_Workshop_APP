import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useConfirmActionMessage from '../../../hooks/useConfirmActionMessage'
import TableFilesModal from './tableFiles.modal';
import TableFilesSearchFields from './tableFiles.search'
import ConfirmActionMessage from '../../reusableComponents/confirmActionMessage'



const TableFilesComponent = ({ title, filesList, fieldsList, doAddFile, doDeleteFile, doRequestSearch }) => {
    const { t } = useTranslation()
    const collapseElementClass = 'widget-body collapse'
    const showElementClass = 'widget-body'
  
    const [files, setFiles] = useState([])
    const [file, setFile] = useState(null)
    // eslint-disable-next-line no-unused-vars
    const [totalItems, setTotalItems] = useState(0)
    // eslint-disable-next-line no-unused-vars
    const [showElement, setShowElement] = useState(true)

  
    // state modals
    const [showModal, setShowModal] = useState(false)
  
    useEffect(() => {
      if (filesList) {
        setFiles(filesList)
        setTotalItems(filesList.length)
      }
    }, [filesList])
  
    //modals
    // Files
    const handleShowModal = (item) => {
      setFile(item)
      setShowModal(true)
    }
  
    const handleCloseModal = () => {
      setShowModal(false)
    }
  
    const handleSelectionModal = item => {
      doAddFile(item)
      setFile({})
    }
  
    // Shows the modal onclick on the delete icon
    const handleShowDeleteModal = item => {
      setFile(item)
      doDeleteFile(item)
      setFile({})
    }
  
    const handleRequestSearch = item => {
      doRequestSearch(item)
    }


  
    const action = useConfirmActionMessage()
  
    return (
      <div>
        <ConfirmActionMessage {...action} />
  
        {showModal &&
          <TableFilesModal
            showModal={showModal}
            fieldsList={fieldsList}
            closeModal={() => handleCloseModal()}
            selectionModal={item => handleSelectionModal(item)}
            item={file}
          />
        }
  
        <div className="row">
          <div className="col-md-12 no-padding-left-right">
            <div className="col-md-12 widget-fillform with-paddings widget-container-col ui-sortable">
              <div className="widget-box ui-sortable-handle">
                
  
                <div className={showElement ? showElementClass : collapseElementClass}>
                  <div className="widget-main col-gray-bg">
  
                    {/* table here */}
                    <div className="row no-margin-left-right">
                      <TableFilesSearchFields doRequestSearch={handleRequestSearch} />
                      {/* add */}
                      <div className="col-md-2 sec-add-btn-wrapper sec-add-btn-vehicles pull-right">
                        <button className="btn btn-success block btn-sm full btn-top" onClick={(e) => handleShowModal(null)}>
                          <i className="ace-icon fa fa-plus"></i> {t('add')}
                        </button>
                      </div>
                    </div>
  
                    <div className="col-md-12 table-responsive sec-table-responsive gray-bg">
  
                      <table className="table table-hover-search table-striped">
                        <thead className="ng-scope">
                          <tr className="ng-table-sort-header">
                            {
                              fieldsList.map(col => (
                                <th title="" className="header sortable sort-asc" key={col}>
                                  <div className="ng-table-header ng-scope" >
                                    <span className="ng-binding sort-indicator">{t(col)}</span>
                                  </div>
                                </th>
                              ))
                            }
                            <th>{t('view_file')}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            files && files.map(item => {
                              return (
                                <tr key={item.id}>
                                  {
                                    fieldsList.map(col => {
                                      return (
                                        <td key={`${item.id}-${item[col]}`} data-title="tablesTranslations.File">
                                          {item && item[col]}
                                        </td>
                                      )
                                    })}
                                  < td className="col-md-1 options-column center">
                                    <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                                      <i className="green ace-icon fa fa-arrow-right bigger-150 hover-select-icon" alt="{{'view_file' | translate}}" title={t('view_file')}></i>
                                    </a>
                                  </td>
                                  <td className="col-md-1 options-column center">
                                    <div className="ng-isolate-scope">
                                      <i onClick={() => handleShowDeleteModal(item)} className="red ace-icon fa fa-trash-o bigger-130 faa-pulse animated-hover hover-select-icon" alt={t('delete')} title={t('delete')}></i>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
  
                    </div>
  
                    {/* table here */}
  
                  </div>
                </div>
  
              </div>
            </div>
          </div>
        </div>
      </div>
  
    )
  }
export default TableFilesComponent;


  