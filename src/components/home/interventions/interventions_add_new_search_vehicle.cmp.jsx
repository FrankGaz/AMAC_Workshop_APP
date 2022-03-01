import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FieldInput from "../../reusableComponents/fieldInput";
import useIsValid from "../../../hooks/useIsValid.hook";
import _ from "lodash";

const InterventionSearchVehicle = ({ doRequestSearch }) => {
  const { t } = useTranslation();
  const [registrationToSearch, setRegistrationToSearch] = useState(null);
  const [isCompleted, setIsCompleted] = useState(true);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const { handleIsValid, activateActionButton } = useIsValid();

  const handleSearchInputRegistration = (event, e) => {
    let value = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      value = event.target.value;
      setIsCompleted(true);
    } else {
      value = e.target.value;
      setIsCompleted(false);
    }
    setRegistrationToSearch(value);
  };

  const handleAbleToSearch = () => {
    if (registrationToSearch == "" || registrationToSearch.length < 7) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const handleSearchClick = () => {
    doRequestSearch(registrationToSearch);
    setRegistrationToSearch(null);
  };

  return (
    <div className="is-flex">
      <div className="mr-2 fullWidth">
        <FieldInput
          input={(registrationToSearch && registrationToSearch) || ""}
          name="registration"
          columnSize={12}
          doInputCheck={handleSearchInputRegistration}
          onKeyUp={handleAbleToSearch}
          // minLength={7}
          // maxLength={9}
          isValid={handleIsValid}
          withLabel={false}
          isSmall={
            windowSize && windowSize <= 640
              ? true
              : false
          }
        />
      </div>
      <div className="">
        <button
          onClick={(event) => handleSearchClick(event)}
          className={
            windowSize && windowSize <= 640
              ? "button is-info is-small"
              : "button is-info"
          }
          disabled={isCompleted || !activateActionButton}
        >
          <i></i> {t("continue")}
        </button>
      </div>
    </div>
  );
};

export default InterventionSearchVehicle;
