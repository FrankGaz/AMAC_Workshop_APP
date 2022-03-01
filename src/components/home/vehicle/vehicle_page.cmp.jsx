import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VehicleSearchBox from "./vehicle_searchbox";
import { templateQueryParameters } from "../../../logic/queryParams";
import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";
import appServices from "../../appServices.service";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import { useSpring, animated } from "react-spring";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import useModal from "../../reusableComponents/modals/useModal";
import _ from "lodash";

const VehicleComponent = (props) => {
  // translation hook from the ReactI18next library
  const { t } = useTranslation();
  const { isShowing, toggle } = useModal();
  const [modalMessage, setModalMessage] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const lastSearch = sessionStorage.getItem("currentVehicleRegistration")

  useEffect(() => {
    sessionStorage.removeItem("currentVehicleSection");
    if (lastSearch && lastSearch.length > 5) {
      getData(lastSearch)
    }
  }, [lastSearch])

  // sessionStorage.setItem("currentVehicleRegistration", units.registration);

  const getData = registration => {
    registration && handleUpdate(
      {},
      {
        registration_cont: registration,
      }
    );
  }
  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 500,
  });
  const springPropsContent = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });
  const springPropsTable = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1500,
  });

  const action = useConfirmActionMessage();

  // All Units loaded in ComponentDidMount
  const [units, setUnits] = useState([]);

  // flag to control whether an api call is being made or not
  const [isLoading, setIsLoading] = useState(true);
  //state that controls the queryParameters

  const [showDetail, setShowDetail] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useState({});

  //Go Home
  const GoHome = () => {
    props.history.push({
      pathname: `/home`,
    });
  };

  //Go Back
  const history = useHistory();

  // Function that sends a call to the API to get Units
  const handleUpdate = (queryParameters, qSearchQueryParams) => {
    setIsLoading(true);
    setSearchParams(qSearchQueryParams);

    appServices
      .getVehicles({
        ...queryParameters,
        q: {
          ...qSearchQueryParams,
        },
      })
      .then((data) => {
        const vehiclesArray = data && data.json && data.json.vehicles;
        // Show only vehicles that are not canceled
        const activeVehicles = vehiclesArray.find(
          (vehicle) =>
            vehicle.vehicle_state.id != 4 && vehicle.vehicle_state.id != 5
        );
        if (activeVehicles) {
          setUnits(activeVehicles);
          setIsLoading(false);
          setShowDetail(true);
        } else {
          setIsLoading(false);
          setShowDetail(false);
          // action.sayMessage("danger", t("vehicle_not_found"));
          setModalKind("Warning");
          toggle(setModalMessage(t("vehicle_not_found")));
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setModalKind("Error");
        err &&
          err.message &&
          toggle(setModalMessage(_.capitalize(err.message)));
        err && !err.message && toggle(setModalMessage("error_data_fetch"));
      });
  };

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

  const goToVehicleItvRevisions = () => {
    sessionStorage.setItem("currentVehicleId", units.id);
    sessionStorage.setItem("currentVehicleData", JSON.stringify(units));
    sessionStorage.setItem("currentVehicleRegistration", units.registration);
    sessionStorage.setItem("currentVehicleSection", "itv");
   
    props.history.push({
      pathname: `/home/itv`,
    });
  };

  const goToVehicleMaintenances = () => {
    sessionStorage.setItem("currentVehicleData", JSON.stringify(units));
    sessionStorage.setItem("currentVehicleId", units.id);
    // sessionStorage.setItem("currentVehicleRegistration", units.registration);
    sessionStorage.setItem("currentVehicleRegistration", units.registration);
    sessionStorage.setItem("currentVehicleSection", "maintenances");
    props.history.push({
      pathname: `/home/maintenances`,
    });
  };

  const goHome = () => {
    window.location.href = "/home";
  };

  // End search box functions
  return (
    <animated.div style={springProps}>
      <ModalNotification
        isShowingModalNotification={isShowing}
        hide={toggle}
        modalTitle={modalMessage || "Error"}
        modalKind={modalKind || "Error"}
      />
      <div className="page-content">
        <div>
          <VehicleSearchBox
            doRequestSearch={handleSearchClick}
            clearSearch={handleClearSearch}
          ></VehicleSearchBox>
          {showDetail ? (
            <animated.div style={springPropsContent}>
              <div className="">
                {units && (
                  <div>
                    {windowSize && windowSize <= 640 && (
                      <div className="card">
                        <div className="card-image">
                          <figure className="image is-4by3">
                            <img
                              src={
                                units.photo_url_medium ||
                                "https://amac-renting.s3.amazonaws.com/vehicles/photos/medium.missing.png"
                              }
                              alt="Vehicle Image"
                            ></img>
                          </figure>
                        </div>
                        <div className="card-content">
                          <div className="media">
                            <div className="media-content">
                              <p className="title is-4 textGrey">
                                {units && units.registration}
                              </p>
                              <p className="subtitle is-6 textGrey">
                                {(units && units.brand && units.brand.name) ||
                                  "n/a"}{" "}
                                {(units && units.model && units.model.name) ||
                                  "n/a"}
                              </p>
                            </div>
                          </div>
                          <div className="divider is-right mt-2 mb-5"></div>

                          <div className="content">
                            <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap">
                              <div className="width45">
                                <p className="label isSearchBox textGrey">
                                  {t("chassis")}
                                </p>
                                <input
                                  className="input is-small textGrey"
                                  disabled
                                  type="text"
                                  value={(units && units.chassis) || "n/a"}
                                  readOnly
                                ></input>
                              </div>
                              <div className="width45">
                                <p className="label isSearchBox textGrey">
                                  {t("vehicle_version")}
                                </p>
                                <input
                                  className="input is-small textGrey"
                                  disabled
                                  type="text"
                                  value={
                                    (units && units.vehicle_version) || "n/a"
                                  }
                                  readOnly
                                ></input>
                              </div>
                              <div className="width45">
                                <p className="label isSearchBox textGrey">
                                  {t("engine_number")}
                                </p>
                                <input
                                  className="input is-small textGrey"
                                  disabled
                                  type="text"
                                  value={
                                    (units && units.engine_number) || "n/a"
                                  }
                                  readOnly
                                ></input>
                              </div>
                              <div className="width45">
                                <p className="label isSearchBox textGrey">
                                  {t("km_abr_total")}
                                </p>
                                <input
                                  className="input is-small textGrey"
                                  disabled
                                  type="text"
                                  value={
                                    (units && units.current_tire_kilometer) ||
                                    "n/a"
                                  }
                                  readOnly
                                ></input>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {windowSize && windowSize > 640 && (
                      <div className="is-flex">
                        <div className="card isHorizontal">
                          <div className="card-image">
                            <figure className="image is-4by3">
                              <img
                                src={
                                  units.photo_url_medium ||
                                  "https://amac-renting.s3.amazonaws.com/vehicles/photos/medium.missing.png"
                                }
                                alt="Vehicle Image"
                              ></img>
                            </figure>
                          </div>
                          <div className="card-content">
                            <div className="media">
                              <div className="media-content">
                                <p className="title is-4 textGrey">
                                  {units && units.registration}
                                </p>
                                <p className="subtitle is-6 textGrey">
                                  {(units && units.brand && units.brand.name) ||
                                    "n/a"}{" "}
                                  {(units && units.model && units.model.name) ||
                                    "n/a"}
                                </p>
                              </div>
                            </div>
                            <div className="divider is-right mt-2 mb-5"></div>

                            <div className="content">
                              <div className="columns is-desktop is-flex-wrap-wrap">
                                <div className="column minW250">
                                  <h5 className="title mb-1 textGrey">
                                    {t("chassis")}
                                  </h5>
                                  <input
                                    className="input textGrey"
                                    type="text"
                                    value={(units && units.chassis) || "n/a"}
                                    readOnly
                                  ></input>
                                </div>
                                <div className="column minW250">
                                  <h5 className="title mb-1 textGrey">
                                    {t("vehicle_version")}
                                  </h5>
                                  <input
                                    className="input textGrey"
                                    type="text"
                                    value={
                                      (units && units.vehicle_version) || "n/a"
                                    }
                                    readOnly
                                  ></input>
                                </div>
                                <div className="column minW250">
                                  <h5 className="title mb-1 textGrey">
                                    {t("engine_number")}
                                  </h5>
                                  <input
                                    className="input textGrey"
                                    type="text"
                                    value={
                                      (units && units.engine_number) || "n/a"
                                    }
                                    readOnly
                                  ></input>
                                </div>
                                <div className="column minW250">
                                  <h5 className="title mb-1 textGrey">
                                    {t("km_abr_total")}
                                  </h5>
                                  <input
                                    className="input textGrey"
                                    type="text"
                                    value={
                                      (units && units.current_tire_kilometer) ||
                                      "n/a"
                                    }
                                    readOnly
                                  ></input>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <animated.div style={springPropsTable}>
                  <div className="navbar is-fixed-bottom">
                    <button
                      className="button buttonFooter hasBorderRight width17 is-radiusless fullFooterHeight"
                      onClick={() => history.goBack()}
                    >
                      <i className="fas fa-chevron-left mr-2"></i>
                    </button>
                    <button
                      className="button buttonFooterWhite hasBorderRight width33 is-radiusless fullFooterHeight"
                      onClick={goToVehicleItvRevisions}
                    >
                      <i className="fas fa-wrench mr-2"></i>ITV
                    </button>
                    <button
                      className="button buttonFooterWhite width33 is-radiusless fullFooterHeight"
                      onClick={goToVehicleMaintenances}
                    >
                      <i className="far fa-calendar-alt mr-2"></i>Mant.
                    </button>

                    <button
                      onClick={goHome}
                      className="button buttonFooter width17 is-radiusless fullFooterHeight"
                    >
                      <i className="fas fa-home mr-2"></i>
                    </button>
                  </div>
                </animated.div>
              </div>
            </animated.div>
          ) : (
            <FooterNavBar />
          )}
        </div>
      </div>
    </animated.div>
  );
};
VehicleComponent.displayName = VehicleComponent;
export default VehicleComponent;
