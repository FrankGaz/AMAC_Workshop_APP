import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FieldInput from "../../reusableComponents/fieldInput";
import useIsValid from "../../../hooks/useIsValid.hook";
import _ from "lodash";
import CloseButton from "../../../components/reusableComponents/CloseButton";
import ConfirmActionMessage from "../../reusableComponents/confirmActionMessage";
import ServiceRequestSearchBox from "../../home/services_request/services_request_searchbox";
import LoadingIcon from "../../reusableComponents/loadingIcon";
import vehicleApiService from "../../home/vehicles/vehicle.service";
import servicesApiService from "../../home/service/services.service";
import logic from "../../../logic/logic";
import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";
//import Label from "../../reusableComponents/label"; Not used
import ModalInputTextArea from "../../reusableComponents/modalInputTextArea";

const ServiceRequestModal = ({ closeModal, showModal }) => {
  const { t } = useTranslation();
  const action = useConfirmActionMessage();
  const { handleIsValid, activateActionButton } = useIsValid();
  const [loading, setLoading] = useState(false);
  const [registrationResponse, setRegistrationResponse] = useState(null);
  const [incidenceDescription, setIncidenceDescription] = useState("");
  const [currentVehicleKilometer, setCurrentVehicleKilometer] = useState(null);
  const [incidenceResponse, setIncidenceResponse] = useState(null);
  const [showRegistrationInput, setShowRegistrationInput] = useState(true);
  const [companyIdForRequest, setCompanyIdForRequest] = useState(0);
  const [vehicleManager, setVehicleManager] = useState({});
  const [kilometersFieldValid, setKilometersFieldValid] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);

  const showHideClassName = showModal
    ? "rc-modal modal-open modal in"
    : "modal fade in display-none";
  // Constant that is used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";

  useEffect(() => {
    const companyParsed = JSON.parse(logic._userId);
    const parsedId = companyParsed.company.id;

    if (parsedId !== 0) {
      setCompanyIdForRequest(parsedId);
    }
  }, []);

  const handleSearchClick = (search) => {
    setLoading(true);
    search &&
      search !== undefined &&
      search !== null &&
      search.length > 2 &&
      vehicleApiService
        .searchVehicleByRegistration(search)

        .then((res) => {
          setLoading(false);
          const resArray = res.json.vehicles;
          // Show only vehicles that are not canceled
          const activeVehicle = resArray.find(
            (vehicle) =>
              vehicle.vehicle_state.id != 4 && vehicle.vehicle_state.id != 5
          );

          if (activeVehicle) {
            if (resArray && resArray.length >= 1) {
              activeVehicle.fleet && getManager(activeVehicle.fleet.id);
              setRegistrationResponse(activeVehicle);
            }
            if (activeVehicle.fleet.id) {
              getManager(activeVehicle.fleet.id);
            }
          } else {
            action.sayMessage("danger", t("vehicle_not_found"));
            setShowRegistrationInput(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          err && err.message && action.sayMessage("danger", err.message);
          setShowRegistrationInput(true);
        });
  };

  useEffect(() => {
    registrationResponse &&
      registrationResponse.registration &&
      registrationResponse.registration !== null &&
      registrationResponse.registration.length > 0 &&
      setShowRegistrationInput(false);
  }, [registrationResponse]);

  const lastKilometersRegistred =
    registrationResponse && registrationResponse.current_tire_kilometer;


  /* const ableSaveButton = (incidenceResponse, currentVehicleKilometer, lastKilometersRegistred) => {
    if (
      currentVehicleKilometer < lastKilometersRegistred &&
      incidenceResponse == null
    ) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }; */

  const handleInputKilometersChange = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    let kilometersValue = parseFloat(value);
    if (!Number(value)) {
      //action.sayMessage("danger", t("incidence_notification_error"));
      setLoading(false);
    } else if (kilometersValue < lastKilometersRegistred) {
      setLoading(false);
      setKilometersFieldValid(false);
      //setIsEmpty(true);
    } else {
      setCurrentVehicleKilometer(value);
      setKilometersFieldValid(true);
    }
    //ableSaveButton();
  };

  const handleInputDescription = (event, e) => {
    let value = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      value = event.target.value;
      setLoading(false);
    } else {
      value = e.target.value;
      if (value && kilometersFieldValid == true) {
        setIsEmpty(false);
      } else if (kilometersFieldValid == false){
        setIsEmpty(true);
      } else if (!value) {
        setIsEmpty(true);
      } 
    }

    setIncidenceDescription(value);
    //ableSaveButton();
  };

  // Dynamically loads all the item types to search
  const getManager = (fleet, zone) => {
    // manager from fleet + zone
    const query = {
      method: "GET",
      searchFleetId: fleet,
      searchZoneId: zone,
    };
    logic.configureQueryParameters({
      ...query,
    });

    return servicesApiService.assignManager().then((data) => {
      const managers = data.json.managers;

      managers && setVehicleManager(managers[0].user);

      return (managers[0] && managers[0].user) || null;
    });
  };

  // Function to update kilometers in vehicle_kilometers API
  const updateVehicleKilometers = () => {
    const method = "POST";
    const date = new Date();
    const today =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const vehicleId = registrationResponse && registrationResponse.id;
    const body = {
      vehicle_kilometer: {
        input_date: today,
        kilometer_input_method_id: null,
        kilometers: currentVehicleKilometer,
      },
    };
    return logic._call(
      `vehicles/${vehicleId}/vehicle_kilometers`,
      method,
      body
    );
  };

  const handleSaveIncidence = () => {
    const date = new Date();
    const today =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const full_expedient = {
      company_id: companyIdForRequest,
      full_expedient_state_id: 3,
      manager_id: vehicleManager.id,
      expedient_attributes: {
        start_date: today || null,
        vehicle_id: (registrationResponse && registrationResponse.id) || null,
      },
      workshop_description: incidenceDescription || null,
    };

    setLoading(true);

    if (currentVehicleKilometer != null) {
      updateVehicleKilometers();
    }

    servicesApiService
      .saveIncidence(full_expedient)
      .then((res) => {
        setIncidenceResponse(res.json.full_expedient);
        setRegistrationResponse(null);
        setLoading(false);
        //action.sayMessage("success", t("incidence_success_message"));
      })
      .catch((err) => {
        action.sayMessage("danger", t("incidence_notification_error"));
        setLoading(false);
      });

    //Reload page to show new services added
    const reloadPage = () => {
      window.location.reload();
    };
    setTimeout(reloadPage, 3000);
  };

  /* If we want to open a new sevice without close the modal we can use this function.

  const resetComponent = () => {
    setRegistrationResponse(null);
    setIncidenceDescription("");
    setIncidenceResponse(null);
    setShowRegistrationInput(true);
  };

*/
  return (
    <div
      id="searchFleetsModal"
      className={showHideClassName}
      tabIndex="-1"
      draggable-modal="true"
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        paddingTop: "10%",
      }}
    >
      <div
        className="modal-dialog"
        style={{
          width: "90%",
        }}
      >
        <div className="modal-content">
          {/* Header of the modal, title changes on either Add or Update depending on of recieved prop has database id or not. */}
          <div className="modal-header">
            <CloseButton closeModal={() => closeModal()} />
            <h3 className="smaller lighter blue no-margin">
              {t("add")} {t("new", { text: t("service") })}
            </h3>
          </div>

          <div className="modal-body">
            <div className="page-content">
              <div>
                <ConfirmActionMessage {...action} />
                <div className="row">
                  {showRegistrationInput && showRegistrationInput === true && (
                    <ServiceRequestSearchBox
                      doRequestSearch={handleSearchClick}
                    />
                  )}
                </div>
                {registrationResponse &&
                  registrationResponse !== null &&
                  registrationResponse.registration &&
                  registrationResponse.registration !== null && (
                    <div>
                      <div className="flex-containerCenter">
                        <div
                          className="flex-content"
                          style={{
                            width: "100%",
                            maxWidth: "60%",
                          }}
                        >
                          <div className="flex-content-block">
                            <div className="col-md-4 flex-content-element">
                              <FieldInput
                                input={
                                  (registrationResponse &&
                                    registrationResponse.registration) ||
                                  "n/a"
                                }
                                name="name"
                                label="registration"
                                maxLength={76}
                                isRequired={false}
                                isValid={handleIsValid}
                                columnSize={6}
                                hasActivator={false}
                                activator={null}
                                isDisabled
                              />
                            </div>
                            <div className="col-md-4 flex-content-element">
                              <FieldInput
                                input={
                                  (registrationResponse &&
                                    registrationResponse.brand &&
                                    registrationResponse.brand.name) ||
                                  "n/a"
                                }
                                name="brand"
                                label="brand"
                                maxLength={76}
                                isRequired={false}
                                isValid={handleIsValid}
                                columnSize={6}
                                hasActivator={false}
                                activator={null}
                                isDisabled
                              />
                            </div>
                            <div className="col-md-4 flex-content-element">
                              <FieldInput
                                input={
                                  (registrationResponse &&
                                    registrationResponse.model &&
                                    registrationResponse.model.name) ||
                                  "n/a"
                                }
                                name="model"
                                label="model"
                                maxLength={76}
                                isRequired={false}
                                isValid={handleIsValid}
                                columnSize={6}
                                hasActivator={false}
                                activator={null}
                                isDisabled
                              />
                            </div>
                          </div>
                          <div className="flex-content-block">
                            <div className="col-md-4 flex-content-element">
                              <FieldInput
                                input={
                                  (registrationResponse &&
                                    registrationResponse.chassis) ||
                                  "n/a"
                                }
                                name="chassis"
                                label={t("chassis")}
                                maxLength={76}
                                isRequired={false}
                                isValid={handleIsValid}
                                columnSize={6}
                                hasActivator={false}
                                activator={null}
                                isDisabled
                              />
                            </div>
                            <div className="col-md-4 flex-content-element">
                              <FieldInput
                                input={
                                  (registrationResponse &&
                                    registrationResponse.fleet &&
                                    registrationResponse.fleet.name) ||
                                  "n/a"
                                }
                                name="fleet"
                                label="fleet"
                                maxLength={76}
                                isRequired={false}
                                isValid={handleIsValid}
                                columnSize={6}
                                hasActivator={false}
                                activator={null}
                                isDisabled
                              />
                            </div>
                            <div
                              className="col-md-4 flex-content-element"
                              style={{ maxHeight: 75.25 }}
                            >
                              <FieldInput
                                input={
                                  (registrationResponse &&
                                    registrationResponse.current_tire_kilometer.toString()) ||
                                  "n/a"
                                }
                                name="km_abr_total"
                                label="km_abr_total"
                                maxLength={76}
                                isRequired={false}
                                isNumber={true}
                                isValid={handleIsValid}
                                columnSize={6}
                                hasActivator={false}
                                activator={null}
                                doInputCheck={handleInputKilometersChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="flex-content"
                          style={{
                            width: "100%",
                            maxWidth: "40%",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="flex-content-block">
                            <div className="flex-content-element">
                              <ModalInputTextArea
                                input={incidenceDescription || ""}
                                name={"description"}
                                maxLength={512}
                                isRequired={true}
                                isValid={handleIsValid}
                                columnSize={12}
                                hasActivator={false}
                                activator={null}
                                doModalClick={null}
                                doInputCheck={handleInputDescription}
                              />
                            </div>
                          </div>
                          <div className="flex-content-block">
                            <div className="flex-content-element">
                              <div className="" style={{ paddingTop: "1em" }}>
                                <div
                                  data-test-id="button"
                                  style={{
                                    paddingLeft: "5em",
                                    paddingRight: "5em",
                                    paddingBottom: "1.3rem",
                                  }}
                                >
                                  <button
                                    onClick={handleSaveIncidence}
                                    className="btn btn-primary block btn-sm full"
                                    disabled={
                                      !activateActionButton() || isEmpty
                                    }
                                  >
                                    <i></i> {t("save")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                <div>
                  <LoadingIcon loading={loading} />
                </div>
                {incidenceResponse &&
                  incidenceResponse !== null &&
                  incidenceResponse.id &&
                  incidenceResponse.id !== null && (
                    <div>
                      <div className="row">
                        <div className="col-md-4"></div>
                        <div
                          className="col-md-4"
                          style={{
                            paddingBottom: "85px",
                          }}
                        >
                          <h3 className="widget-title center smaller lighter blue big-title-margins">
                            {t("incidence_success_message")}
                          </h3>
                        </div>
                        <div className="col-md-4"></div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={() => closeModal()}
              type="button"
              className="btn btn-sm btn-default"
              data-dismiss="modal"
            >
              <i className="ace-icon fa fa-times"></i> {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestModal;
