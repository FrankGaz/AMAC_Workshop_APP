import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SearchModalUnitiesSearchBox = props => {
    // hook that manages translations
    const { t } = useTranslation()

    // state that manages the inputs

    const [items, setItems] = useState({})

    const handleInputChange = event => {
        const target = event.target
        const value = target.value
        const name = target.name


        setItems(prevState => ({
            ...prevState,
            [name]: value
        }))
    }


    const handleSearchClick = event => {
        event.preventDefault()
        props.requestSearch({
            searchName: items && items.name,
            searchObservations: items && items.observations
        })
    }

    const handleClearSearch = event => {
        event.preventDefault()
        setItems({})
        props.requestSearch({
            clear: true
        })
    }




    return <div className="col-md-10 widget-search widget-container-col ui-sortable">
        <div className="widget-box ui-sortable-handle collapsed">
            <div className="widget-header widget-header-large">
                <div className="col-gray-bg only-padding-top10">
                    <form noValidate>
                        <div className="col-md-4">
                            <input
                                onChange={handleInputChange}
                                value={(items && items.name) || ''}
                                type="text"
                                className="form-control"
                                name="name"
                                id="search_fleets_name_cont"
                                placeholder={t('customer')}
                                maxLength="76" />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="text"
                                onChange={handleInputChange}
                                value={(items && items.observations) || ''}
                                className="form-control"
                                name="observations"
                                id="search_fleets_observations_cont"
                                placeholder={t('observations')}
                                maxLength="76" />
                        </div>

                        <div className="col-md-2">
                            <button type="button" onClick={handleSearchClick} className="btn btn-purple btn-sm block full" ><i className="fa fa-search"></i> {t('search')}</button>
                        </div>
                        <div className="col-md-2">
                            <button
                            type="button"
                                onClick={(e) => handleClearSearch(e)}
                                className="btn btn-default btn-sm block full"
                                alt={t('clear_search')}
                                title={t('clear_search')}>
                                <i className="fa fa-eraser"></i>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
}

export default SearchModalUnitiesSearchBox