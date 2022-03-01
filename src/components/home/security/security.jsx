//OLD COMPONENT, NOT USED

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmActionMessage from "../../reusableComponents/confirmActionMessage";
import SecurityForm from "../security/security_form";
import LoadingIcon from "../../reusableComponents/loadingIcon";
import vehicleApiService from "../vehicles/vehicle.service";
import { templateQueryParameters } from "../../../logic/queryParams";
import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";
// import Label from "../../reusableComponents/label";
// import VehicleTyres from "./vehicle-tyres";

const SecurityComponent = (props) => {
  // translation hook from the ReactI18next library
  const { t } = useTranslation();

  const action = useConfirmActionMessage();

  // All Units loaded in ComponentDidMount
  const [Units, setUnits] = useState([]);

  // flag to control whether an api call is being made or not
  const [isLoading, setIsLoading] = useState(true);
  //state that controls the queryParameters

  const [showDetail, setShowDetail] = useState(true);

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useState({});

  // Function that sends a call to the API to get Units
  const handleUpdate = (queryParameters, qSearchQueryParams) => {
    setIsLoading(true);
    setSearchParams(qSearchQueryParams);
    setShowDetail(true);
    vehicleApiService
      .getVehicles({
        ...queryParameters,
        q: {
          ...qSearchQueryParams,
        },
      })
      .then((data) => {
        setUnits(data && data.json && data.json.vehicles);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        action.sayMessage("danger", err.message);
      });
  };

  // ComponentDidMount
  useEffect(() => {
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearSearch = () => {
    setShowDetail(false);
  };

  // Function that handles the search box
  const handleSearchClick = (searchParams) => {
    if (!searchParams || searchParams.registration === null) {
      setUnits(null);
    } else {
      const { registration } = searchParams;
      const { searchVehiclesRegistration } = templateQueryParameters;

      handleUpdate(
        {},
        {
          [searchVehiclesRegistration]: registration,
        }
      );
    }
  };

  // End search box functions
  return (
    <div className="page-content">
      <div>
        <ConfirmActionMessage {...action} />
        <div className="row">
          <SecurityForm
            doRequestSearch={handleSearchClick}
            clearSearch={handleClearSearch}
          />
        </div>
      </div>
    </div>
  );
};
export default SecurityComponent;
