import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SearchModalCustomersSearchBox = props => {
    // hook that manages translations
    const { t } = useTranslation()

    // state that manages the inputs

    // manages the name input to search for
    const [nameInput, setNameInput] = useState('')

    // manages the observation input to search for
    const [observationsInput, setObservationsInput] = useState('')

    const handleInputChange = event => {
        const target = event.target
        const value = target.value
        const name = target.name

        if (name === 'name') {
            return setNameInput(value)
        }
        if (name === 'observations') {
            return setObservationsInput(value)
        }
    }

    const handleSearchClick = event => {
        event.preventDefault()
        props.requestSearch({
            searchName: nameInput,
            searchObservations: observationsInput
        })
    }

    const handleClearSearch = event => {
        event.preventDefault()
        setNameInput("")
        setObservationsInput("")
        return props.requestSearch({
            clear: true
        })
    }

    return (
        <div className="col-md-10 widget-search widget-container-col ui-sortable">
            <div className="widget-box ui-sortable-handle collapsed">
                <div className="widget-header widget-header-large">
                    <div className="col-gray-bg only-padding-top10">
                        <div>
                            <div className="col-md-4">
                                <input
                                    onChange={handleInputChange}
                                    value={nameInput || ''}
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
                                    value={observationsInput || ""}
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
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default SearchModalCustomersSearchBox 