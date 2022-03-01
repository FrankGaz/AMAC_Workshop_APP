import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SearchModalIncidencesKindsSearchBox = props => {

  // translation API from reactI18next 
  const { t } = useTranslation()

  // state that manages the inputs

  // manages the name input to search for
  const [nameInput, setNameInput] = useState('')

  // manages the name input to search for
  const [preventiveInput, setPreventiveInput] = useState(null)

  const handleInputChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    if(name === "name"){
      setNameInput(value)
    }
    
    if(name === "preventive") {
      setPreventiveInput(value) 
    }
  }

  const handleSearchClick = event => {
    event.preventDefault()
    props.requestSearch({
      searchName: nameInput,
      searchPreventive: preventiveInput
    })
  }

  const handleClearSearch = event => {
    event.preventDefault()
    setNameInput("")
    setPreventiveInput(null)
    return props.requestSearch({
      clear: true
    })
  }

  return <div className="col-md-10 widget-search widget-container-col ui-sortable">
    <div className="widget-box ui-sortable-handle collapsed">
      <div className="widget-header widget-header-large">
        <div className="col-gray-bg">
          <form name="forms.searchFleetsModalForm" noValidate>
            <div className="col-md-4">
              <input
                type="text"
                onChange={handleInputChange}
                value={nameInput || ""}
                className="form-control"
                name="name"
                id="search_fleets_observations_cont"
                placeholder={t('incidence')}
                maxLength="76" />
            </div>
            <div className="col-md-2 padding-top5">
              <label>
                <input
                  name="preventive"
                  type="checkbox"
                  className="ace input-lg"
                  checked={preventiveInput ? 'checked' : ""}
                  onChange={handleInputChange} />
                <span className="lbl ng-binding black">{t('preventive_n')}</span>
              </label>
            </div>
            <div className="col-md-3">
              <button
              type="button"
                onClick={handleSearchClick}
                className="btn btn-purple btn-sm block full" >
                <i className="fa fa-search"></i>
                {t('search')}
              </button>
            </div>
            <div className="col-md-3">
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

export default SearchModalIncidencesKindsSearchBox
