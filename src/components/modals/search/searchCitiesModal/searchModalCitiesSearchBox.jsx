import React , { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SearchModalCitiesSearchBox = props => {
    // hook that manages translations
    const { t } = useTranslation()

    // state that manages the inputs

    // manages the name input to search for
    const [nameInput, setNameInput] = useState('')


    const handleInputChange = event => {
        const target = event.target
        const value = target.value
        //const name = target.name

        setNameInput(value)
    }


    const handleSearchClick = event => {
        event.preventDefault()
        props.requestSearch({
            searchName: nameInput
        })
    }

    const handleClearSearch = event => {
        event.preventDefault()
        setNameInput("")
        return  props.requestSearch({
            clear: true
        })
    }




    return (<div className="col-md-10 widget-search widget-container-col ui-sortable">
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
                                placeholder={t('city')}
                                maxLength="76" />
                        </div>

                        <div className="col-md-2">
                            <button onClick={handleSearchClick} type="button" className="btn btn-purple btn-sm block full" ><i className="fa fa-search"></i> {t('search')}</button>
                        </div>
                        <div className="col-md-2">
                            <button
                                onClick={(e) => handleClearSearch(e)}
                                type="button"
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

export default SearchModalCitiesSearchBox