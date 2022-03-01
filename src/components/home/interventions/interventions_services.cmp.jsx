import React, { useEffect, useState } from "react";
import appServices from "../../appServices.service";
import defaults from "../../reusableComponents/defaults";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import { useTranslation } from "react-i18next";
import useModal from "../../reusableComponents/modals/useModal";
import ModalDelete from "../../reusableComponents/modals/modalDelete.cmp";
import useModalDelete from "../../reusableComponents/modals/useModalDelete";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import logic from "../../../logic/logic";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import ModalInputRadioTwo from "../../reusableComponents/modalInputRadioTwo";
import useModalNotification from "../../reusableComponents/modals/useModalNotification";

const InterventionsServicesComponent = (props) => {
  const { t } = useTranslation();
  const [currentInterventionDataII, setCurrentInterventionDataII] =
    useState(null);
  const [currentServiceData, setCurrentServiceData] = useState(null);
  const [currentServiceChargeCost, setCurrentServiceChargeCost] = useState("");
  const [incidenceKinds, setIncidenceKinds] = useState(null);
  const [serviceKinds, setServiceKinds] = useState(null);
  const [interventionData, setInterventionData] = useState(null);
  const [budgetLines, setBudgetLines] = useState(null);
  const [currentInterventionNumber, setCurrentInterventionNumber] =
    useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [itemForDeleteModal, setItemForDeleteModal] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const { isShowing, toggle } = useModal();
  const { isShowingModalDelete, toggleDelete } = useModalDelete();
  const { isShowingModalNotification, toggleNotification } =
    useModalNotification();
  const history = useHistory();
  const [warrantyState, setWarrantyState] = useState([
    { id: 1, name: "Garantía" },
    { id: 2, name: "Fuera Garantía" },
    { id: 3, name: "N.A." },
  ]);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [lockBudget, setLockBudget] = useState(null);
  const [lock, setLock] = useState(null);
  const LOCK_BUDGET = sessionStorage.getItem("currentLockBudget");
  const [previousChargeCost, setPreviousChargeCost] = useState("");
  const [interventionLock, setInterventionLock] = useState(null);
  const [completeDescription, setCompleteDescription] = useState(null);
  const [finalDescription, setFinalDescription] = useState(null);

  const [shortFlow, setShortFlow] = useState(
    sessionStorage.getItem("workshopLock")
  );

  useEffect(() => {
    // sessionStorage.removeItem("currentServiceId");
    sessionStorage.removeItem("incidenceKindNBL");
    getInitialData();
    const data = JSON.parse(sessionStorage.getItem("currentInterventionData"));

    setInterventionData({ ...data });
    // setLockBudget(sessionStorage.getItem("currentLockBudget"));
  }, []);

  useEffect(() => {
    if (currentServiceChargeCost && currentServiceChargeCost == true) {
      setPreviousChargeCost("yes");
    } else {
      setPreviousChargeCost("no");
    }
  }, [currentServiceChargeCost]);

  useEffect(() => {
    if (LOCK_BUDGET === true) setLock("0");
    if (LOCK_BUDGET === false) setLock("1");
  }, [LOCK_BUDGET]);

  useEffect(() => {
    let fleetId = sessionStorage.getItem("currentFleetData");
    if (interventionData && interventionData.vehicle_fleet_id) {
      getIncidenceKinds(interventionData.vehicle_fleet_id);
    }
    // if (interventionData && interventionData.vehicle_fleet_id) {
    //   getFleetIdForIncidenceKinds(interventionData.vehicle_fleet_id);
    // }
    fleetId &&
      fleetId !== null &&
      fleetId !== undefined &&
      getIncidenceKinds(fleetId);
  }, [interventionData]);

  useEffect(() => {
    const workshopData = JSON.parse(sessionStorage.getItem("workshopData"));
    const workshopName = workshopData && workshopData.name;

    if (
      currentServiceData &&
      currentServiceData.description &&
      currentServiceData.description.includes("Servicio creado por")
    ) {
      setCompleteDescription(true);
    } else {
      setCompleteDescription(false);
    }
  }, [currentServiceData]);

  const getFleetIdForIncidenceKinds = (vehicle_fleet_id) => {
    const query = {
      searchFleetId: vehicle_fleet_id || null,
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    appServices
      .getFleets()
      .then((res) => {
        res &&
          res.json &&
          res.json.fleets &&
          res.json.fleets[0] &&
          res.json.fleets[0].id &&
          getIncidenceKinds(res.json.fleets[0].id);
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("error_data_fetch"));
      });
  };

  const getIncidenceKinds = (fleetId) => {
    const query = {
      fleet_id_eq: fleetId || null,
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    appServices
      .getIncidenceKinds()
      .then((res) => {
        res &&
          res.json &&
          res.json.incidence_kinds &&
          res.json.incidence_kinds.length > 0 &&
          setIncidenceKinds(res.json.incidence_kinds);
        res &&
          res.json &&
          res.json.incidence_kinds &&
          res.json.incidence_kinds.length > 0 &&
          getInitialData();
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("error_data_fetch"));
      });
  };

  const getServiceKinds = (incidence_kind_id_eq) => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
      incidenceKindIdEq: incidence_kind_id_eq || null,
    };

    if (
      incidence_kind_id_eq &&
      incidence_kind_id_eq !== undefined &&
      incidence_kind_id_eq !== null
    ) {
      sessionStorage.setItem("incidenceKindNBL", incidence_kind_id_eq);
    }

    logic.configureQueryParameters({ ...query });

    appServices
      .getServiceKinds()
      .then((res) => {
        res &&
          res.json &&
          res.json.service_kinds &&
          res.json.service_kinds.length >= 0 &&
          setServiceKinds(res.json.service_kinds);
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("error_data_fetch"));
      });
  };

  // según documentación en swagger web taller no tiene acceso al param charge_cost
  const handleRadioButtons = (item) => {
    const value = item && item.target && item.target.value;

    setCurrentServiceData({
      ...currentServiceData,
      charge_cost: null,
    });

    if (value === "Yes" || value === "Sí" || value === "Si") {
      setCurrentServiceData({
        ...currentServiceData,
        charge_cost: true,
      });
    }

    if (value === "No") {
      setCurrentServiceData({
        ...currentServiceData,
        charge_cost: false,
      });
    }
  };

  const getInitialData = () => {
    const serviceId = sessionStorage.getItem("currentServiceId");
    const interventionId = sessionStorage.getItem("currentInterventionId");
    interventionId &&
      serviceId &&
      appServices
        .getService(interventionId, serviceId)
        .then((res) => {
          if (res && res.json && res.json.service) {
            setCurrentServiceData(res.json.service);
            setCurrentServiceChargeCost(res.json.service.charge_cost);
            setCurrentInterventionNumber(res.json.service.intervention_code);
            getServiceKinds(res.json.service.incidence_kind_id);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });

    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    interventionId &&
      serviceId &&
      appServices
        .getServiceBudgetLines(interventionId, serviceId)
        .then((res) => {
          if (res && res.json && res.json.budget_lines) {
            setBudgetLines(res.json.budget_lines);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };
  const getLockBeforeAddBudgetLines = () => {
    const interventionId = interventionData && interventionData.id;
    interventionId &&
      appServices
        .getIntervention(interventionId)
        .then((res) => {
          if (res && res.json && res.json.intervention) {
            setInterventionLock(res.json.intervention.lock_budget);
            const currentLockBudget = res.json.intervention.lock_budget;
            goToAddBudgetLine(currentLockBudget);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const goToAddBudgetLine = (currentLockBudget) => {
    if (currentLockBudget === true) {
      setModalKind("Error");
      toggle(setModalMessage("intervention_blocked"));
    }
    if (currentLockBudget != true) {
      props.history.push({
        pathname: `/home/interventions/newbudgetline`,
      });
    }
  };

  const handleReloadTableData = () => {
    getInitialData();
  };

  const handleInputs = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    if (name === "incidence_kind_id") {
      getServiceKinds(value);
    }

    setCurrentServiceData({
      ...currentServiceData,
      [name]: value,
    });
  };
  const getInitialInterventionData = () => {
    const interventionId = interventionData && interventionData.id;

    interventionId &&
      appServices
        .getIntervention(interventionId)
        .then((res) => {
          if (res && res.json && res.json.intervention) {
            setInterventionData(res.json.intervention);
            setInterventionLock(res.json.intervention.lock_budget);
            const interventionCurrentData = res.json.intervention;
            const currentLockBudget = res.json.intervention.lock_budget;
            getFinalDescription(currentLockBudget);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const getFinalDescription = (currentLockBudget) => {
    const workshopData = JSON.parse(sessionStorage.getItem("workshopData"));
    const workshopName = workshopData && workshopData.name;

    if (completeDescription == true) {
      beginSaveAction(currentLockBudget, currentServiceData.description);
    } else {
      beginSaveAction(
        currentLockBudget,
        "- Servicio creado por " +
          workshopName +
          "\n" +
          currentServiceData.description
      );
    }
  };

  const beginSaveAction = (currentLockBudget, data) => {
    handleSaveService(currentLockBudget, data);
  };

  const handleSaveService = (currentLockBudget, data) => {
    //getInitialInterventionData();
    const serviceId = sessionStorage.getItem("currentServiceId");

    const interventionId = interventionData && interventionData.id;
    //const interventionLock = interventionData && interventionData.lock_budget;
    const companyId = logic.companyId.id;

    const service = {
      charge_cost: currentServiceData && currentServiceData.charge_cost,
      company_id: companyId || null,
      description: data || null,
      expedient_warranty_id:
        (currentServiceData && currentServiceData.expedient_warranty_id) ||
        null,
      incidence_kind_id:
        (currentServiceData && currentServiceData.incidence_kind_id) || null,
      service_kind_id:
        (currentServiceData && currentServiceData.service_kind_id) || null,
    };

    handleEditServices(currentLockBudget, interventionId, serviceId, service);
    setFinalDescription(null);
  };

  const handleEditServices = (
    currentLockBudget,
    interventionId,
    serviceId,
    service
  ) => {
    if (currentLockBudget === true) {
      setModalKind("Error");
      toggle(setModalMessage("intervention_blocked"));
    }
    if (currentLockBudget != true) {
      interventionId &&
        appServices
          .updateService(interventionId, serviceId, service)
          .then((data) => {
            if (
              data &&
              data.json &&
              data.json.service &&
              data.json.service.id
            ) {
              setModalKind("Success");
              toggle(setModalMessage("update_service_success"));
              setTimeout(() => {
                //  history.goBack();
              }, 2000);
            }
          })
          .catch((err) => {
            setModalKind("Error");
            err && err.message && toggle(setModalMessage(err.message));
            err &&
              !err.message &&
              toggle(setModalMessage("update_service_error"));
          });
    }
  };

  const handleDeleteService = (event) => {
    event.preventDefault();
    setItemForDeleteModal({
      kind: "service",
      name: currentServiceData && currentServiceData.incidence_kind,
    });
    toggleDelete();
  };

  const springPropsContent = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });

  const deleteService = () => {
    toggleDelete();
    const serviceId = sessionStorage.getItem("currentServiceId");
    const interventionId = sessionStorage.getItem("currentInterventionId");

    appServices
      .deleteService(interventionId, serviceId)
      .then((res) => {
        if (
          res &&
          res.json &&
          res.json.service &&
          res.json.service.id &&
          res.json.service.id == serviceId
        ) {
          setModalKind("Success");
          toggle(setModalMessage("remove_service_success"));
          setTimeout(() => {
            props.history.push({
              pathname: `/home/interventions/data/${interventionId}`,
            });
          }, 2000);
        }
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("remove_service_error"));
      });
    setItemForDeleteModal(null);
  };

  const getLockBeforeDeleteBudgetLines = (event, item) => {
    const interventionId = interventionData && interventionData.id;
    interventionId &&
      appServices
        .getIntervention(interventionId)
        .then((res) => {
          if (res && res.json && res.json.intervention) {
            setInterventionLock(res.json.intervention.lock_budget);
            const currentLockBudget = res.json.intervention.lock_budget;
            handleDeleteBudgetLine(currentLockBudget, event, item);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const handleDeleteBudgetLine = (currentLockBudget, event, item) => {
    if (currentLockBudget === true) {
      setModalKind("Error");
      toggle(setModalMessage("intervention_blocked"));
    }
    if (currentLockBudget != true) {
      event.preventDefault();
      setItemForDeleteModal({ ...item, kind: "budget_line" });
      toggleDelete();
    }
  };

  const goToBudgetLine = (budgetLineId) => {
    sessionStorage.setItem("currentLineBudgetId", budgetLineId);

    // const interventionId = sessionStorage.getItem("currentInterventionId");
    // const serviceId = sessionStorage.getItem("currentServiceId");

    props.history.push({
      pathname: `/home/interventions/data/services/budget_line/${budgetLineId}`,
      // pathname: `/home/interventions/data/${interventionId}/services/${serviceId}/budget_line/${id}`,
    });
  };

  const getLockBeforeEditBudgetLines = (event, item) => {
    const interventionId = interventionData && interventionData.id;
    interventionId &&
      appServices
        .getIntervention(interventionId)
        .then((res) => {
          if (res && res.json && res.json.intervention) {
            setInterventionLock(res.json.intervention.lock_budget);
            const currentLockBudget = res.json.intervention.lock_budget;
            handleEditBudgetLine(currentLockBudget, event, item);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const handleEditBudgetLine = (currentLockBudget, event, item) => {
    if (currentLockBudget === true) {
      setModalKind("Error");
      toggle(setModalMessage("intervention_blocked"));
    }
    if (currentLockBudget != true) {
      event.preventDefault();
      sessionStorage.setItem("currentLineBudgetId", item && item.id);

      props.history.push({
        pathname: `/home/interventions/data/services/budgetline/edit/${
          item && item.id
        }`,
      });
    }
  };

  const deleteBudgetLine = () => {
    toggleDelete();
    const selectedBudgetLineId = itemForDeleteModal && itemForDeleteModal.id;
    const serviceId = sessionStorage.getItem("currentServiceId");
    const interventionId = sessionStorage.getItem("currentInterventionId");

    appServices
      .deleteBudgetLine(interventionId, serviceId, selectedBudgetLineId)
      .then((res) => {
        if (
          res &&
          res.json &&
          res.json.budget_line &&
          res.json.budget_line &&
          res.json.budget_line.id &&
          res.json.budget_line.id == selectedBudgetLineId
        ) {
          getInitialData();
          setModalKind("Success");
          toggle(setModalMessage("remove_budget_line_success"));
        }
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err &&
          !err.message &&
          toggle(setModalMessage("remove_budget_line_error"));
      });
    setItemForDeleteModal(null);
  };

  return (
    <>
      <ModalNotification
        isShowingModalNotification={isShowing}
        hide={toggle}
        modalTitle={modalMessage}
        modalKind={modalKind}
      />
      <ModalDelete
        isShowingModalDelete={isShowingModalDelete}
        hide={toggleDelete}
        isSaveData={true}
        itemToDelete={itemForDeleteModal}
        deleteBudgetLine={deleteBudgetLine}
        deleteService={deleteService}
      />
      <animated.div style={springPropsContent}>
        {/* <div className="is-flex is-justify-content-flex-end pb-2 pt-3">
              <button
                className={
                  windowSize && windowSize <= 640
                    ? "button is-danger is-small"
                    : "button is-danger"
                }
                onClick={handleShowDeleteModal}
              >
                {t("delete")}
              </button>
            </div> */}

        <div className="box navbar is-fixed-top NavBarSubTop is-flex is-align-items-center">
          <div className="is-flex is-align-items-center fullWidth">
            <div
              className={
                windowSize && windowSize <= 640
                  ? "icon mr-4 is-flex"
                  : "icon mr-4 is-flex"
              }
            >
              <i className="fas fa-2x fa-info textRedAmac"></i>
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "is-flex is-flex-direction-column  width90"
                  : "is-flex is-flex-wrap-nowrap is-align-items-center width90"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "is-size-7 textGrey"
                    : "textGrey"
                }
              >
                Número Intervención:
              </p>
              {windowSize && windowSize > 640 && <p>&nbsp;</p>}
              <p>
                <strong
                  className={
                    windowSize && windowSize <= 640
                      ? "is-size-7 textGrey"
                      : "textGrey"
                  }
                >
                  {currentInterventionNumber && currentInterventionNumber}
                </strong>
              </p>
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "is-flex is-flex-direction-column  width90"
                  : "is-flex is-flex-wrap-nowrap is-align-items-center width90"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "is-size-7 textGrey"
                    : "textGrey"
                }
              >
                Coste Total:
              </p>
              {windowSize && windowSize > 640 && <p>&nbsp;</p>}
              <p>
                <strong
                  className={
                    windowSize && windowSize <= 640
                      ? "is-size-7 textGrey"
                      : "textGrey"
                  }
                >
                  {currentServiceData &&
                    currentServiceData.total_workshop_cost &&
                    defaults.formatNumberDecimalsCommaMiles(
                      currentServiceData.total_workshop_cost
                    )}
                  €
                </strong>
              </p>
            </div>
            {/* {LOCK_BUDGET === true ? "true" : "false"}  */}
            {/* {console.log(`LOCK_BUDGET RETURN`, LOCK_BUDGET)}  */}
            {/* <div className="is-flex width10 is-justify-content-flex-end">
              {LOCK_BUDGET == "false" && shortFlow == "true" ? (
                <button
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-danger is-small"
                      : "button is-danger"
                  }
                  onClick={handleDeleteService}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              ) : (
                <button
                  disabled
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-danger is-small"
                      : "button is-danger"
                  }
                  onClick={handleDeleteService}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>*/}
          </div>
        </div>

        <div
          className={
            windowSize && windowSize <= 640
              ? "box budgetDataBox is-justify-content-space-between is-flex is-flex-wrap-wrap marginTop80"
              : "box budgetDataBox is-flex is-justify-content-space-between is-flex-wrap-wrap marginTop80"
          }
        >
          <div className="field fullWidth">
            <div className="label">{t("service_data")}</div>
          </div>
          <div className="divider fullWidth is-right mb-5 mt-2"></div>
          <div
            className={
              windowSize && windowSize <= 640
                ? "field width45 mb-2"
                : "field mb-2 width45"
            }
          >
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              Incidencia
            </p>
            {currentServiceData &&
            currentServiceData.incidence_kind_id &&
            incidenceKinds &&
            incidenceKinds !== null &&
            incidenceKinds.length > 0 ? (
              <div
                className={
                  windowSize && windowSize <= 640
                    ? "select fullWidth is-small"
                    : "select fullWidth"
                }
              >
                {LOCK_BUDGET == "false" && shortFlow == "true" ? (
                  <select
                    onChange={handleInputs}
                    name={"incidence_kind_id"}
                    className="form-control fullWidth"
                    value={
                      (currentServiceData &&
                        currentServiceData.incidence_kind_id &&
                        currentServiceData.incidence_kind_id) ||
                      ""
                    }
                  >
                    <option value={0}>
                      {"Seleccione" + " " + "Incidencia"}
                    </option>
                    {incidenceKinds
                      ? incidenceKinds.map((element, index) => {
                          return (
                            <option key={index} value={element.id}>
                              {" "}
                              {element && element.name}{" "}
                            </option>
                          );
                        })
                      : null}
                  </select>
                ) : (
                  <select
                    disabled
                    readOnly
                    // onChange={handleInputs}
                    name={"incidence_kind_id"}
                    className="form-control fullWidth"
                    value={
                      (currentServiceData &&
                        currentServiceData.incidence_kind_id &&
                        currentServiceData.incidence_kind_id) ||
                      ""
                    }
                  >
                    <option value={0}>
                      {"Seleccione" + " " + "Incidencia"}
                    </option>
                    {incidenceKinds
                      ? incidenceKinds.map((element, index) => {
                          return (
                            <option key={index} value={element.id}>
                              {" "}
                              {element && element.name}{" "}
                            </option>
                          );
                        })
                      : null}
                  </select>
                )}
              </div>
            ) : (
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
              ></input>
            )}
          </div>

          <div
            className={
              windowSize && windowSize <= 640
                ? "field width45 mb-2"
                : "field mb-2 width45"
            }
          >
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              Tipo de servicio
            </p>
            {currentServiceData &&
            currentServiceData.service_kind_id &&
            serviceKinds &&
            serviceKinds !== null &&
            serviceKinds.length > 0 ? (
              <div
                className={
                  windowSize && windowSize <= 640
                    ? "select fullWidth is-small"
                    : "select fullWidth"
                }
              >
                {LOCK_BUDGET == "false" && shortFlow == "true" ? (
                  <select
                    onChange={handleInputs}
                    name={"service_kind_id"}
                    className="form-control fullWidth"
                    value={
                      (currentServiceData &&
                        currentServiceData.service_kind_id) ||
                      ""
                    }
                  >
                    <option value={0}>
                      {"Seleccione" + " " + "tipo servicio"}
                    </option>
                    {serviceKinds
                      ? serviceKinds.map((element, index) => {
                          return (
                            <option key={index} value={element.id}>
                              {" "}
                              {element && element.name}{" "}
                            </option>
                          );
                        })
                      : null}
                  </select>
                ) : (
                  <select
                    disabled
                    readOnly
                    // onChange={handleInputs}
                    name={"service_kind_id"}
                    className="form-control fullWidth"
                    value={
                      (currentServiceData &&
                        currentServiceData.service_kind_id) ||
                      ""
                    }
                  >
                    <option value={0}>
                      {"Seleccione" + " " + "tipo servicio"}
                    </option>
                    {serviceKinds
                      ? serviceKinds.map((element, index) => {
                          return (
                            <option key={index} value={element.id}>
                              {" "}
                              {element && element.name}{" "}
                            </option>
                          );
                        })
                      : null}
                  </select>
                )}
              </div>
            ) : (
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
              ></input>
            )}
          </div>

          {/* // según documentación en swagger web taller no tiene acceso al param charge_cost */}
          <div>
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              {t("charge_cost")}
            </p>
            {LOCK_BUDGET == "false" && shortFlow == "true" ? (
              <ModalInputRadioTwo
                name={"charge_cost"}
                previousSelection={t(previousChargeCost)}
                isRequired={false}
                doChange={handleRadioButtons}
                withLabel={false}
                value1={t("yes")}
                value2={t("no")}
              />
            ) : (
              <ModalInputRadioTwo
                name={"charge_cost"}
                previousSelection={t(previousChargeCost)}
                isRequired={false}
                doChange={handleRadioButtons}
                withLabel={false}
                value1={t("yes")}
                value2={t("no")}
                isDisabled={true}
              />
            )}
          </div>

          <div
            className={
              windowSize && windowSize <= 640
                ? "field width45 mb-2"
                : "field mb-2 width45"
            }
          >
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              Acción
            </p>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "select fullWidth is-small"
                  : "select fullWidth"
              }
            >
              {LOCK_BUDGET == "false" && shortFlow == "true" ? (
                <select
                  onChange={handleInputs}
                  name={"expedient_warranty_id"}
                  className="form-control fullWidth"
                  value={
                    (currentServiceData &&
                      currentServiceData.expedient_warranty_id) ||
                    ""
                  }
                >
                  <option value={0}>{"Seleccione" + " " + "Garantía"}</option>
                  {warrantyState
                    ? warrantyState.map((element, index) => {
                        return (
                          <option key={index} value={element.id}>
                            {" "}
                            {t(element && element.name)}{" "}
                          </option>
                        );
                      })
                    : null}
                </select>
              ) : (
                <select
                  disabled
                  readOnly
                  // onChange={handleInputs}
                  name={"expedient_warranty_id"}
                  className="form-control fullWidth"
                  value={
                    (currentServiceData &&
                      currentServiceData.expedient_warranty_id) ||
                    ""
                  }
                >
                  <option value={0}>{"Seleccione" + " " + "Garantía"}</option>
                  {warrantyState
                    ? warrantyState.map((element, index) => {
                        return (
                          <option key={index} value={element.id}>
                            {" "}
                            {t(element && element.name)}{" "}
                          </option>
                        );
                      })
                    : null}
                </select>
              )}
            </div>
          </div>

          <div
            className={
              windowSize && windowSize <= 640
                ? "field fullWidth mb-2"
                : "field mb-2 fullWidth"
            }
          >
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              Descripción
            </p>
            {LOCK_BUDGET == "false" && shortFlow == "true" ? (
              <textarea
                className="textarea is-size-7"
                name={"description"}
                value={
                  (currentServiceData && currentServiceData.description) || ""
                }
                onChange={handleInputs}
              />
            ) : (
              <textarea
                disabled
                readOnly
                className="textarea is-size-7"
                name={"description"}
                value={
                  (currentServiceData && currentServiceData.description) || ""
                }
                // onChange={handleInputs}
              />
            )}
          </div>

          <div className="fullWidth is-flex is-justify-content-flex-end mt-2 field">
            {LOCK_BUDGET == "false" && shortFlow == "true" ? (
              <button
                className={
                  windowSize && windowSize <= 640
                    ? "button is-small is-success"
                    : "button is-success"
                }
                onClick={getInitialInterventionData}
              >
                <i className="fas fa-check"></i>&nbsp;{t("save")}
              </button>
            ) : (
              <button
                disabled
                className={
                  windowSize && windowSize <= 640
                    ? "button is-small is-success"
                    : "button is-success"
                }
                // onClick={handleSaveService}
              >
                <i className="fas fa-check"></i>&nbsp;{t("save")}
              </button>
            )}
          </div>
        </div>

        <div className="box">
          <div className="field is-flex fullWidth is-justify-content-space-between">
            <div className="label">{t("budget_lines")}</div>
            <div className="is-flex is-justify-content-flex-end">
              <button
                className={
                  windowSize && windowSize <= 640
                    ? "button is-light is-small mr-2"
                    : "button is-light mr-3"
                }
                onClick={handleReloadTableData}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
              {LOCK_BUDGET == "false" ? (
                <button
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-info is-small"
                      : "button is-info"
                  }
                  onClick={getLockBeforeAddBudgetLines}
                >
                  <i className="fas fa-plus"></i>
                </button>
              ) : (
                <button
                  disabled
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-info is-small"
                      : "button is-info"
                  }
                  onClick={getLockBeforeAddBudgetLines}
                >
                  <i className="fas fa-plus"></i>
                </button>
              )}
            </div>
          </div>
          <div className="field mt-5">
            {/* onClick={(event) =>
                                  handleDeleteBudgetLine(event, item)
                                } */}

            {windowSize && windowSize <= 640 ? (
              budgetLines &&
              budgetLines.map((item, index) => {
                return (
                  <div
                    key={index}
                    item={item}
                    className={"box mb-1 is-flex is-align-items-center"}
                    //onClick={(event) => handleEditBudgetLine(event, item)}
                  >
                    <a
                      className="container"
                      //onClick={(event) => handleDeleteBudgetLine(event, item)}
                    >
                      <div className="is-flex is-justify-content-space-between is-align-items-center">
                        <div className="width80 is-flex is-align-items-center is-justify-content-space-between is-flex-wrap-wrap fullWidth">
                          <div>
                            <p className="is-size-7 textGrey">
                              <b>{t("breakdown_kind")}</b>{" "}
                              {item && item.breakdown_kind}
                            </p>
                            <p className="is-size-7 textGrey">
                              <b>{t("sub_breakdown_kind")}</b>{" "}
                              {item && item.sub_breakdown_kind}
                            </p>
                            <p className="is-size-7 textGrey">
                              <b>{t("budget_detail_action")}</b>{" "}
                              {item && item.budget_detail_action}
                            </p>
                            <p className="is-size-7 textGrey">
                              <b>{t("total_workshop_cost")}</b>{" "}
                              {item &&
                                item.total_workshop_cost &&
                                defaults.formatNumberDecimalsCommaMiles(
                                  item.total_workshop_cost
                                )}
                              €
                            </p>
                            {/* <p className="is-size-9 textGrey">Estado: {item.status}</p> */}
                          </div>
                        </div>
                        <div className="icon width20 is-pulled-right minH100">
                          {LOCK_BUDGET == "false" ? (
                            <div className="icon is-flex is-flex-wrap-wrap fullHeight">
                              <button
                                className={
                                  windowSize && windowSize <= 640
                                    ? "button is-info is-small"
                                    : "button is-info"
                                }
                                // onClick={(event) =>
                                //   goToBudgetLine(event, item)
                                // }
                                onClick={(event) =>
                                  getLockBeforeEditBudgetLines(event, item)
                                }
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className={
                                  windowSize && windowSize <= 640
                                    ? "button is-danger is-small"
                                    : "button is-danger"
                                }
                                onClick={(event) =>
                                  getLockBeforeDeleteBudgetLines(event, item)
                                }
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="icon is-flex is-flex-wrap-wrap fullHeight">
                              <button
                                disabled
                                className={
                                  windowSize && windowSize <= 640
                                    ? "button is-info is-small"
                                    : "button is-info"
                                }
                                // onClick={() =>
                                //   item && item.id && goToBudgetLine(item.id)
                                // }
                                onClick={(event) =>
                                  getLockBeforeEditBudgetLines(event, item)
                                }
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                disabled
                                className={
                                  windowSize && windowSize <= 640
                                    ? "button is-danger is-small"
                                    : "button is-danger"
                                }
                                onClick={(event) =>
                                  getLockBeforeDeleteBudgetLines(event, item)
                                }
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })
            ) : (
              <table className="table table-hover-select table-striped fullWidth maxW100">
                <thead className="ng-scope"></thead>
                <tbody>
                  {budgetLines &&
                    budgetLines.map((item, index) => (
                      <tr key={index}>
                        <td>{item && item.breakdown_kind}</td>
                        <td>{item && item.sub_breakdown_kind}</td>
                        <td>{item && item.budget_detail_action}</td>
                        <td style={{ textAlign: "right" }}>
                          {item &&
                            item.workshop_cost &&
                            defaults.formatNumberDecimalsCommaMiles(
                              item.workshop_cost * item.workshop_units
                            )}
                          €
                        </td>
                        {LOCK_BUDGET == "false" ? (
                          <td
                            style={{ textAlign: "center" }}
                            onClick={(event) =>
                              getLockBeforeEditBudgetLines(event, item)
                            }
                          >
                            <i className="far fas fa-edit"></i>
                          </td>
                        ) : (
                          <td style={{ textAlign: "center" }}>
                            <i className="far fas fa-edit isDisabled"></i>
                          </td>
                        )}
                        {LOCK_BUDGET == "false" ? (
                          <td
                            style={{ textAlign: "center" }}
                            onClick={(event) =>
                              getLockBeforeDeleteBudgetLines(event, item)
                            }
                          >
                            <i className="far fa-trash-alt"></i>
                          </td>
                        ) : (
                          <td style={{ textAlign: "center" }}>
                            <i className="far fa-trash-alt isDisabled"></i>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
                {budgetLines && budgetLines.length > 0 ? (
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td style={{ textAlign: "right" }}>
                        {" "}
                        {t("total_workshop_cost")}{" "}
                      </td>
                      <td
                        style={{
                          backgroundColor: "rgba(144, 156, 194, 0.6)",
                          textAlign: "right",
                        }}
                      >
                        {currentServiceData &&
                          currentServiceData.total_workshop_cost &&
                          defaults.formatNumberDecimalsCommaMiles(
                            currentServiceData.total_workshop_cost
                          )}
                        €
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            )}
            {windowSize &&
              windowSize <= 640 &&
              budgetLines &&
              budgetLines.length > 0 && (
                <div className="is-flex is-flex-wrap-nowrap is-justify-content-flex-end is-align-items-center pt-3 pr-2">
                  <div>
                    <p className="is-size-7 mr-2">
                      <b>Total:</b>
                    </p>
                  </div>
                  <div>
                    <p className="is-size-7">
                      {currentServiceData &&
                        currentServiceData.total_workshop_cost &&
                        defaults.formatNumberDecimalsCommaMiles(
                          currentServiceData.total_workshop_cost
                        )}
                    </p>
                  </div>
                  <div>
                    <p className="is-size-7">€</p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </animated.div>
      <FooterNavBar />
    </>
  );
};

export default InterventionsServicesComponent;
