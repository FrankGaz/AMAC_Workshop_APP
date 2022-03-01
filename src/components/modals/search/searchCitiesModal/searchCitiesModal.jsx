import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Pagination from '../../../reusableComponents/pagination'
import SeachModalCitiesSearchBox from './searchModalCitiesSearchBox'
import CloseButton from '../../../reusableComponents/CloseButton'
import logic from '../../../../logic/logic'
import citiesApiService from './citiesService'
import LoadingIcon from '../../../reusableComponents/loadingIcon'
import ReloadItems from '../../../reusableComponents/reloadItems'

const SearchCitiesModal = ({closeModal, showModal, searchSelection, country, province }) => {
        const { t } = useTranslation()

        // Search Items
        const [isLoading, setIsLoading] = useState(true)
        const [items, setItems] = useState([])
    
        // Flag that controls whether the modal is shown.
        // The className "aside" assigns a z-index of 1040, and without it assigns a z-index of 1050. This modal will open on top of an already opened modal.
        const showHideClassName = showModal ? "overflowYAuto rc-modal z1060 display-block modal-open modal in " : "modal fade in display-none"
    
        // Controls the total number of calls given
        const [totalItems, setTotalItems] = useState(0)
    
        // Dynamically loads all the item types to search
        const loadSearches = queryParameters => {
            setIsLoading(true)
            if(!queryParameters){
                queryParameters = {
                    method: "GET"
                }
            }
            logic.configureQueryParameters({
                ...queryParameters,
                searchProvinceCountryId: country && country.id,
                searchProvinceId: province && province.id
            })
            showModal && citiesApiService.getCities()
                .then(data => {
                    setIsLoading(false)
                    setTotalItems(data.total)
                    return setItems(data.json.cities)
                })
                .catch(err => {
                    console.error(err.message)
                    setIsLoading(false)
                })
        }
    
    
        // ComponentShouldUpdate
        useEffect(() => {
            setItems([])
            loadSearches()
            document.addEventListener('keydown', handleEscapePress)
            return () => {
                setItems([])
                document.removeEventListener('keydown', handleEscapePress)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [showModal])
    
        const handleEscapePress = e => {
            if (e.keyCode === 27) {
                return closeModal()
    
            }
        }
    
        const handleSelectItemClick = (e, item) => {
            e.preventDefault()
            searchSelection(item)
            return closeModal()
        }
    
        const handleRequestPagination = params => {
            loadSearches(params)
        }
    
        const handleRequestSearch = params => {
            loadSearches(params)
        }
    
        const handleRefreshClick = () => {
            loadSearches({
                refresh: true
            })
        }
        return <div id="searchFleetsModal" className={showHideClassName} tabIndex="-1" draggable-modal="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* Header of the modal, title changes on either Add or Update depending on of recieved prop has database id or not. */}
                    <div className="modal-header">
                        <CloseButton closeModal={() => closeModal()} />
                        <h3 className="smaller lighter blue no-margin">
                        {t('search')} {t('lowercase',{text:t('cities')})}
                                            </h3>
                    </div>
    
                    <div className="modal-body">
                        <div className="row">
                            <ReloadItems doReload={handleRefreshClick} />
                                <SeachModalCitiesSearchBox requestSearch={handleRequestSearch}></SeachModalCitiesSearchBox> 
                        </div>
                        <LoadingIcon loading={isLoading}/>
                        <div className="row table-responsive-row">
                            <div className="col-md-12 table-responsive table-search">
                                <table className="table table-hover-search table-striped">
                                    <thead className="ng-scope">
                                        <tr className="ng-table-sort-header">
                                            <th title="" className="header  sortable sort-asc">
                                                <div className=" ng-scope" >
                                                    <span className="ng-binding sort-indicator">{t('cities')}</span>
                                                </div>
                                            </th>
                                            <th title="" className="header  sortable">
                                                <div className=" ng-scope" >
                                                    <span className="ng-binding sort-indicator">{t('management_company')}</span>
                                                </div> </th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                   
                                    <tbody data-test-id='cityDetailsHeader'>
                                        {items && items.map(((item, index) => {
                                            return <tr data-test-id='cityDetails' onClick={e => handleSelectItemClick(e, item)} key={index} ng-repeat="fleet in $data track by $index" className="pointer">
                                                <td data-test-id='cityDetails.name' data-sortable="'name'">
                                                    {item && item.name}
                                                </td>
    
                                                <td data-title="tablesTranslations.management_company" data-sortable="'company_name'">
                                                    {item && item.company && item.company.name}
                                                </td>
    
                                                <td className="col-md-1 options-column center">
                                                    <i className="green ace-icon fa fa-arrow-right bigger-150 hover-search-icon" alt={t('select')} title={t('select')}></i>
                                                </td>
                                            </tr>
    
                                        }))}
                                    </tbody>
                                </table>
                                <Pagination total={totalItems} requestPagination={handleRequestPagination}></Pagination>
                            </div>
                        </div>
    
                    </div>
    
                    <div className="modal-footer">
                        <button onClick={() => closeModal()} type="button" className="btn btn-sm btn-default" data-dismiss="modal"><i className="ace-icon fa fa-times"></i> {t('close')}</button>
                    </div>
    
                </div>
            </div>
        </div>
    
}

export default SearchCitiesModal