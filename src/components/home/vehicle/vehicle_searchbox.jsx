import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FieldInput from "../../reusableComponents/fieldInput";
import logic from "../../../logic/logic";
import useIsValid from "../../../hooks/useIsValid.hook";
import _ from "lodash";

const VehicleSearchBox = ({ doRequestSearch, clearSearch }) => {
  // translation API from reactI18next
  const { t } = useTranslation();
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const initialState = {
    registration: null,
  };

  // state values
  const [newServiceData, setNewServiceData] = useState(initialState);

  const handleSearchInputChange = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    setNewServiceData({
      ...newServiceData,
      [name]: value,
    });
  };

  // Function that handles the search box
  const handleSearchClick = () => {
    doRequestSearch(newServiceData);
  };

  const handleClearSearch = (event) => {
    logic.configureQueryParameters({});
    setNewServiceData(initialState);
    doRequestSearch(null);
    clearSearch(false);
  };

  const { handleIsValid } = useIsValid();

  return (
    <div>
      <div className="box mb-5">
        <div className="field">
          <div className="label is-size-7">{t("search_vehicle")}</div>
        </div>
        <div className="field is-flex is-flex-direction-row is-flex-wrap-nowrap">
          <div className="mr-2 fullWidth">
            <FieldInput
              input={(newServiceData && newServiceData.registration) || ""}
              name="registration"
              maxLength={76}
              isRequired={false}
              isValid={handleIsValid}
              columnSize={6}
              doInputCheck={handleSearchInputChange}
              withLabel={false}
              hasActivator={false}
              activator={false}
              isSmall={windowSize && windowSize <= 640 ? true : false}
            />
          </div>
          <div className="mx-2">
            <button
              data-test-id="searchClick"
              type="button"
              onClick={(e) => handleSearchClick(e)}
              className={
                windowSize && windowSize <= 640
                  ? "button is-search is-small"
                  : "button is-search"
              }
              alt={t("search")}
              title={t("search")}
            >
              <i className="fa fa-search"></i>
            </button>
          </div>

          <div className="mx-2">
            <button
              data-test-id="clearSearch"
              type="button"
              onClick={(e) => handleClearSearch(e)}
              className={
                windowSize && windowSize <= 640
                  ? "button is-light is-small"
                  : "button is-light"
              }
              alt={t("clear_search")}
              title={t("clear_search")}
            >
              <i className="fa fa-eraser"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSearchBox;
