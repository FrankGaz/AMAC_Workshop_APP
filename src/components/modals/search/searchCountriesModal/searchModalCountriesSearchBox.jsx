import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const SearchModalCountriesSearchBox = props => {
  // hook that manages translations
  const { t } = useTranslation();

  // state that manages the inputs

  // state that manages the inputs
  const [inputValues, setInputValues] = useState({})

  const handleInputChange = event => {
      const target = event.target
      const value = target.value
      const name = target.name

      setInputValues(prevState => ({
         ...prevState,
         [name]:value
      }))
  }

  const handleSearchClick = event => {
      event.preventDefault()
      const { name, observations } = inputValues
      props.requestSearch({
          searchName: name,
          searchObservations: observations
      })
  }

  const handleClearSearch = event => {
      event.preventDefault()
      setInputValues({})
      return  props.requestSearch({
          clear: true
      })
  }

  return (
    <div className="col-md-10 widget-search widget-container-col ui-sortable">
      <div className="widget-box ui-sortable-handle collapsed">
        <div className="widget-header widget-header-large">
          <div className="col-gray-bg only-padding-top10">
            <form noValidate>
              <div className="col-md-4">
                <input
                  onChange={handleInputChange}
                  value={(inputValues && inputValues.name) || ''}
                  type="text"
                  className="form-control"
                  name="name"
                  id="search_fleets_name_cont"
                  placeholder={t("customer")}
                  maxLength="76"
                />
              </div>

              <div className="col-md-2">
                <button
                  onClick={handleSearchClick}
                  className="btn btn-purple btn-sm block full"
                >
                  <i className="fa fa-search"></i> {t("search")}
                </button>
              </div>
              <div className="col-md-2">
                <button
                  onClick={e => handleClearSearch(e)}
                  className="btn btn-default btn-sm block full"
                  alt={t("clear_search")}
                  title={t("clear_search")}
                >
                  <i className="fa fa-eraser"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModalCountriesSearchBox;
