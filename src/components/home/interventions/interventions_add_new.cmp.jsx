import React, { useEffect, useState } from "react";
import appServices from "../../appServices.service";
import defaults from "../../reusableComponents/defaults";
import { useTranslation } from "react-i18next";
import InterventionSearchVehicle from "./interventions_add_new_search_vehicle.cmp";
import _ from "lodash";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import useModalNotification from "../../reusableComponents/modals/useModalNotification";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import { useSpring, animated } from "react-spring";
import ModalInterventionDone from "../../reusableComponents/modals/modalInterventionDone.cmp";
import useModalInterventionDone from "../../reusableComponents/modals/useModalInterventionDone";
import ModalCalendar from "../../reusableComponents/modals/modalCalendar.cmp";
import useModalCalendar from "../../reusableComponents/modals/useModalCalendar";
import { useHistory } from "react-router-dom";

const InterventionAddNew = (props) => {
  const [interventionShortFlow, setInterventionShortFlow] = useState(null);
  const [currentInterventionData, setCurrentIntervenitonData] = useState(null);
  const [currentInterventionServices, setCurrentIntervenitonServices] =
    useState(null);
  const [totalWorkshopCost, setTotalWorkshopCost] = useState(0);
  const [showRegistrationInput, setShowRegistrationInput] = useState(true);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [registrationResponse, setRegistrationResponse] = useState(null);
  const [holdedRegistrationResponse, setHoldedRegistrationResponse] =
    useState(null);
  const [interventionDescription, setInterventionDescription] = useState("");
  const [currentVehicleKilometer, setCurrentVehicleKilometer] = useState(null);
  const [newKilometers, setNewKilometers] = useState(null);
  const [incidenceResponse, setIncidenceResponse] = useState(null);
  const [kilometersFieldValid, setKilometersFieldValid] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);
  const [interventionExpectedRemovalDate, setInterventionExpectedRemovalDate] =
    useState("");
  const [interventionEntryDate, setInterventionEntryDate] = useState("");
  const [newInterventionData, setNewInterventionData] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const { isShowingModalNotification, toggleNotification } =
    useModalNotification();
  const { isShowingModalInterventionDone, toggleInterventionDone } =
    useModalInterventionDone();
  const { isShowingModalCalendar, toggleCalendar } = useModalCalendar();
  const [calendarUse, setCalendarUse] = useState(null);
  const [initialExpEntryMM, setInitialExpEntryMM] = useState("");

  const [initialExpRemovalMM, setInitialExpRemovalMM] = useState("");

  const [initialExpEntryHH, setInitialExpEntryHH] = useState("");

  const [initialExpRemovalHH, setInitialExpRemovalHH] = useState("");

  const [lockBudgetStatus, setLockBudgetStatus] = useState(true);

  const shortFlow = sessionStorage.getItem("workshopLock");

  const history = useHistory();

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

  const springPropsBottom = useSpring({
    to: { opacity: 1, bottom: 0, position: "relative" },
    from: { opacity: 0, bottom: -1000, position: "relative" },
    delay: 1500,
  });
  const springPropsBottom2 = useSpring({
    to: { opacity: 1, bottom: 0, position: "relative" },
    from: { opacity: 0, bottom: -1000, position: "relative" },
    delay: 2000,
  });
  const springPropsBottom3 = useSpring({
    to: { opacity: 1, bottom: 0, position: "relative" },
    from: { opacity: 0, bottom: -1000, position: "relative" },
    delay: 3000,
  });

  const formatTimesToShow = (data) => {
    if (
      data &&
      data.expected_vehicle_entry_date &&
      data.expected_vehicle_entry_date !== null &&
      data.expected_vehicle_entry_date.includes("T")
    ) {
      const timeToSet = data.expected_vehicle_entry_date.substr(11, 8);
      const splittedTime = timeToSet.split(":");
      setInitialExpEntryMM(Number(splittedTime[1]).toString());
      setInitialExpEntryHH(Number(splittedTime[0]).toString());
    }
    if (
      data &&
      data.expected_vehicle_removal_date &&
      data.expected_vehicle_removal_date !== null &&
      data.expected_vehicle_removal_date.includes("T")
    ) {
      const timeToSet = data.expected_vehicle_removal_date.substr(11, 8);
      const splittedTime = timeToSet.split(":");
      setInitialExpRemovalMM(Number(splittedTime[1]).toString());
      setInitialExpRemovalHH(Number(splittedTime[0]).toString());
    }
  };

  const checkFieldsBeforeAddNewIntervention = () => {
    const todayDate = new Date();
    const todayForSplit = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
    const todaySplitted = todayForSplit.split("/");
    const todaysDate = `${todaySplitted[0]}-${todaySplitted[1]}-${
      todaySplitted[2]
    }T${("0" + todayDate.getHours().toString()).slice(-2)}:${(
      "0" + todayDate.getMinutes().toString()
    ).slice(-2)}:${("0" + todayDate.getSeconds().toString()).slice(-2)}.000Z`;

    const addZero = (number) => {
      if (Number(number).toString() >= 10) return number;
      if (Number(number).toString() < 10) return `0${number}`;
    };
    const oneToZeroZero = (number) => {
      if (Number(number).toString() === "1") return "00";
      if (Number(number).toString() !== "1") return number;
    };

    const interventionTimes = {
      expected_vehicle_removal_date:
        (newInterventionData && newInterventionData.exp_removal_date) || null,
      expected_vehicle_entry_date:
        (newInterventionData &&
          newInterventionData.expected_vehicle_entry_date) ||
        null,
    };

    let expected_vehicle_entry_date_data = `${defaults.formatDateUS(
      interventionTimes.expected_vehicle_entry_date
    )}T${addZero(initialExpEntryHH) || "00"}:${
      oneToZeroZero(initialExpEntryMM) || "00"
    }:00.000Z`;

    let expected_vehicle_removal_date_data = `${defaults.formatDateUS(
      interventionTimes.expected_vehicle_removal_date
    )}T${addZero(initialExpRemovalHH) || "00"}:${
      oneToZeroZero(initialExpRemovalMM) || "00"
    }:00.000Z`;

    const intervention = {
      expected_vehicle_removal_date:
        (newInterventionData &&
          newInterventionData.exp_removal_date &&
          expected_vehicle_removal_date_data) ||
        null,
      expected_vehicle_entry_date:
        (newInterventionData &&
          newInterventionData.expected_vehicle_entry_date &&
          expected_vehicle_entry_date_data) ||
        null,
      vehicle_id: (registrationResponse && registrationResponse.id) || null,
      vehicle_kilometers: (newKilometers && newKilometers) || null, // @ the moment !
      workshop_budget_date: todaysDate || null,
      workshop_description: interventionDescription || null,
      lock_budget: lockBudgetStatus || null,
    };

    // let expected_vehicle_entry_date_data;

    // let expected_vehicle_removal_date_data;

    // if (
    //   intervention &&
    //   intervention.expected_vehicle_entry_date &&
    //   intervention.expected_vehicle_entry_date !== null
    // ) {
    //   expected_vehicle_entry_date_data = `${defaults.formatDateUS(
    //     intervention.expected_vehicle_entry_date
    //   )}T${addZero(initialExpEntryHH) || "00"}:${
    //     oneToZeroZero(initialExpEntryMM) || "00"
    //   }:00.000Z`;
    // } else {
    //   expected_vehicle_entry_date_data = null;
    // }
    // if (
    //   intervention &&
    //   intervention.expected_vehicle_removal_date &&
    //   intervention.expected_vehicle_removal_date !== null
    // ) {
    //   expected_vehicle_removal_date_data = `${defaults.formatDateUS(
    //     intervention.expected_vehicle_removal_date
    //   )}T${addZero(initialExpRemovalHH) || "00"}:${
    //     oneToZeroZero(initialExpRemovalMM) || "00"
    //   }:00.000Z`;
    // } else {
    //   expected_vehicle_removal_date_data = null;
    //}

    let checkKilometers = true;
    

    if (
      registrationResponse &&
      registrationResponse.vehicle_kilometers &&
      intervention &&
      intervention.vehicle_kilometers &&
      intervention.vehicle_kilometers > 0 &&
      intervention.vehicle_kilometers <= registrationResponse.vehicle_kilometers
    ) {
      console.log("hace comparación !!!");
      checkKilometers = false;
      setModalKind("Error");
      toggleNotification(setModalMessage("field_kilometers_min"));
    }
   

    if (
      (intervention && !intervention.workshop_description) ||
      (intervention && intervention.workshop_description === null) ||
      (intervention && intervention.workshop_description.length < 1) ||
      checkKilometers === false
    ) {
      if (checkKilometers === false && intervention.vehicle_kilometers) {
        setModalKind("Error");
        toggleNotification(setModalMessage("field_kilometers_min"));
      } else {
        setModalKind("Error");
        toggleNotification(setModalMessage("empty_description_field"));
      }
    } else {
      setLockBudgetStatus(false);
      saveIntervention(intervention);
      
    }
  };

  const saveIntervention = (intervention) => {
    
    intervention &&
      appServices
        .addIntervention(intervention)
        .then((res) => {
          res &&
            res.json &&
            res.json.intervention &&
            res.json.intervention.id &&
            sessionStorage.setItem(
              "newInterventionId",
              res.json.intervention.id
            );
          res &&
            res.json &&
            res.json.intervention &&
            res.json.intervention.id &&
            sessionStorage.setItem(
              "currentInterventionData",
              JSON.stringify(res.json.intervention)
            );
          res &&
            res.json &&
            res.json.intervention &&
            res.json.intervention.id &&
            setTimeout(() => {
              if (shortFlow == "true") {
                toggleInterventionDone();
                setTimeout(() => {
                  resetStates();
                }, 2000);
              } else {
                setModalKind("Success");
                toggleNotification(setModalMessage("add_intervention_success"));
                setTimeout(() => {
                  history.goBack();
                }, 2000);
              }
            }, 10);
        })
        .catch((err) => {
          err && setModalKind("Error");
          err &&
            err.message &&
            toggleNotification(setModalMessage(err.message));
          err &&
            !err.message &&
            toggleNotification(setModalMessage("intervention_creation_error"));
          setLoading(false);
       });
  };

  const resetStates = () => {
    setCurrentIntervenitonData(null);
    setCurrentIntervenitonServices(null);
    setTotalWorkshopCost(0);
    setShowRegistrationInput(true);
    setLoading(false);
    setRegistrationResponse(null);
    setHoldedRegistrationResponse(null);
    setInterventionDescription("");
    setCurrentVehicleKilometer(null);
    setIncidenceResponse(null);
    setKilometersFieldValid(true);
    setIsEmpty(true);
    setInterventionExpectedRemovalDate("");
    setInterventionEntryDate("");
    setNewInterventionData(null);
    setLockBudgetStatus(true);
  };

  const handleAddNewKilometer = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    if (value != 0 && value != null) {
      setNewKilometers(value);
    }
    console.log("value KM :>> ", value);
    console.log("newKilometers :>> ", newKilometers);
  };

  const handleSearchClick = (search) => {
    const arrayPlates = sessionStorage.getItem("licensePlatesArray");
    setLoading(true);
    search &&
      search !== undefined &&
      search !== null &&
      search.length > 2 &&
      appServices
        .searchVehicleByRegistration(search)
        .then((res) => {
          setLoading(false);
          const resArray = res.json.vehicles;
          const activeVehicle = resArray.find(
            (vehicle) => vehicle.vehicle_state.id != 4
          );
          if (resArray && resArray.length == "0") {
            toggleNotification(setModalMessage("no_vehicle_found"));
            setShowRegistrationInput(true);
          }
          if (resArray && resArray.length >= 1) {
            const registrationToCompare = activeVehicle.registration;
            const comparison = arrayPlates.includes(
              registrationToCompare.toUpperCase()
            );
            if (comparison === true) {
              setHoldedRegistrationResponse(activeVehicle);
              setShowRegistrationInput(false);
            }
            if (comparison === false) {
              setRegistrationResponse(activeVehicle);
            }
          }
        })
        .catch((err) => {
          setLoading(false);
          setModalKind("Error");
          err &&
            err.message &&
            toggleNotification(setModalMessage(err.message));
          err &&
            !err.message &&
            toggleNotification(setModalMessage("error_data_fetch"));
          setShowRegistrationInput(true);
        });
  };

  useEffect(() => {
    if (
      registrationResponse &&
      registrationResponse.registration &&
      registrationResponse.registration !== null &&
      registrationResponse.registration.length > 0
    ) {
      setShowRegistrationInput(false);
    }
  }, [registrationResponse]);

  const lastKilometersRegistred =
    registrationResponse && registrationResponse.current_tire_kilometer;

  const handleProceedAnyway = (event) => {
    event.preventDefault();
    setRegistrationResponse(holdedRegistrationResponse);
    setHoldedRegistrationResponse(null);
  };

  const handleGoToInterventions = () => {
    props.history.push({
      pathname: `/home/interventions`,
    });
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
      } else if (kilometersFieldValid == false) {
        setIsEmpty(true);
      } else if (!value) {
        setIsEmpty(true);
      }
    }

    setInterventionDescription(value);
    //ableSaveButton();
  };

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
  };

  const goToNewService = () => {
    props.history.push({
      pathname: `/home/interventions/newservice`,
    });
  };

  const goToInterventionsList = () => {
    props.history.push({
      pathname: `/home/interventions`,
    });
  };

  const openCalendar = (event, use) => {
    event.preventDefault();
    if (use && use.length > 0 && use !== undefined && use !== null) {
      setCalendarUse(use);
      toggleCalendar();
    }
  };

  const dateSelectedOutput = (dateSelected) => {
    const dateKey = Object.keys(dateSelected);
    const dateValue = Object.values(dateSelected);

    if (
      dateKey &&
      dateKey.toString().toLowerCase() === "expected_vehicle_entry_date"
    ) {
      setNewInterventionData({
        ...newInterventionData,
        expected_vehicle_entry_date: dateValue,
      });
    }
    if (dateKey && dateKey.toString().toLowerCase() === "exp_removal_date") {
      setNewInterventionData({
        ...newInterventionData,
        exp_removal_date: dateValue,
      });
    }
    toggleCalendar();
  };

  const handleHoursAndMinutes = (event, e) => {
    let value = null;
    let name = null;

    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    if (name === "expected_vehicle_entry_hours") {
      if (value === 0) {
        setInitialExpEntryHH("00");
      } else {
        setInitialExpEntryHH(value);
      }
    }
    if (name === "expected_vehicle_entry_minutes") {
      if (value === 1) {
        setInitialExpEntryMM("00");
      } else {
        setInitialExpEntryMM(value);
      }
    }

    if (name === "expected_vehicle_removal_hours") {
      if (value === 0) {
        setInitialExpRemovalHH("00");
      } else {
        setInitialExpRemovalHH(value);
      }
    }
    if (name === "expected_vehicle_removal_minutes") {
      if (value === 1) {
        setInitialExpRemovalMM("00");
      } else {
        setInitialExpRemovalMM(value);
      }
    }
  };

  return (
    <>
      <animated.div style={springPropsContent}>
        <animated.div style={springPropsContent}>
          <div className="pt-3">
            <ModalNotification
              isShowingModalNotification={isShowingModalNotification}
              hide={toggleNotification}
              modalTitle={modalMessage || "Error"}
              modalKind={modalKind}
            />
            <ModalInterventionDone
              isShowingModalInterventionDone={isShowingModalInterventionDone}
              hide={toggleInterventionDone}
              modalTitle={modalMessage || "Atención"}
              modalKind={modalKind}
              goToInterventionsList={goToInterventionsList}
              goToNewService={goToNewService}
            />
            <ModalCalendar
              isShowingModalCalendar={isShowingModalCalendar}
              hide={toggleCalendar}
              dateInputName={calendarUse}
              dateSelectedOutput={dateSelectedOutput}
            />

            {/* 1 / 3 */}

            {showRegistrationInput && showRegistrationInput === true && (
              // holdedRegistrationResponse === null && (
              <animated.div style={springPropsBottom}>
                <div className="box relative">
                  <div className="field">
                    <label className="label is-size-7">
                      {t("search_vehicle")}
                    </label>
                    <InterventionSearchVehicle
                      doRequestSearch={handleSearchClick}
                    />
                  </div>
                </div>
                {/* <button onClick={toggleInterventionDone}>PUSH ME!</button> */}
              </animated.div>
            )}

            {/* 2 / 3 */}

            {holdedRegistrationResponse && holdedRegistrationResponse !== null && (
              <animated.div style={springPropsBottom2}>
                <div className="modal-card boxShadow noMargin modalDone modalWarning">
                  <header className={`modal-card-head `}>
                    <p className="modal-card-title is-size-6 has-text-weight-semibold">
                      {t("intervention_with_this_license_already_exists")}
                    </p>
                  </header>
                  <section className="modal-card-body is-flex is-justify-content-center is-flex-direction-column is-align-items-center">
                    <section>
                      <p>
                        {/* <b>{`${t("intervention_creation_success")}.`}</b> */}
                        <b>{` `}</b>
                      </p>
                    </section>
                    <section className="mt-2">
                      <p>{t("proceed_anyway")}</p>
                    </section>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      className="button is-danger is-small"
                      onClick={(event) => handleGoToInterventions(event)}
                    >
                      <i className="fas fa-times"></i>
                      &nbsp;{t("cancel")}
                    </button>
                    <button
                      className="button is-success is-small"
                      onClick={(event) => handleProceedAnyway(event)}
                    >
                      {t("continue")} &nbsp;
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </footer>
                </div>
              </animated.div>
            )}

            {/* 3 / 3 */}

            {registrationResponse &&
              registrationResponse !== null &&
              registrationResponse.registration &&
              registrationResponse.registration !== null && (
                <animated.div style={springPropsBottom3}>
                  <div className="box relative budgetDataBox is-justify-content-space-between is-flex is-flex-wrap-wrap">
                    <div
                      className={
                        windowSize && windowSize <= 640
                          ? "field width45 mb-2"
                          : "field mb-2 width45"
                      }
                    >
                      <div
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("license_plate")}
                      </div>
                      <input
                        className={
                          windowSize && windowSize <= 640
                            ? "input is-small"
                            : "input"
                        }
                        disabled
                        value={
                          (registrationResponse &&
                            registrationResponse.registration) ||
                          ""
                        }
                      ></input>
                    </div>
                    <div
                      className={
                        windowSize && windowSize <= 640
                          ? "field width45 mb-2"
                          : "field mb-2 width45"
                      }
                    >
                      <div
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("chassis")}
                      </div>
                      <input
                        className={
                          windowSize && windowSize <= 640
                            ? "input is-small"
                            : "input"
                        }
                        disabled
                        value={
                          (registrationResponse &&
                            registrationResponse.chassis) ||
                          ""
                        }
                      ></input>
                    </div>

                    <div
                      className={
                        windowSize && windowSize <= 640
                          ? "field width45 mb-2"
                          : "field mb-2 width45"
                      }
                    >
                      <div
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("brand")}
                      </div>
                      <input
                        className={
                          windowSize && windowSize <= 640
                            ? "input is-small"
                            : "input"
                        }
                        disabled
                        value={
                          (registrationResponse &&
                            registrationResponse.brand &&
                            registrationResponse.brand.name) ||
                          ""
                        }
                      ></input>
                    </div>
                    <div
                      className={
                        windowSize && windowSize <= 640
                          ? "field width45 mb-2"
                          : "field mb-2 width45"
                      }
                    >
                      <div
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("model")}
                      </div>
                      <input
                        className={
                          windowSize && windowSize <= 640
                            ? "input is-small"
                            : "input"
                        }
                        disabled
                        value={
                          (registrationResponse &&
                            registrationResponse.model &&
                            registrationResponse.model.name) ||
                          ""
                        }
                      ></input>
                    </div>

                    <div
                      className={
                        windowSize && windowSize <= 640
                          ? "field width45 mb-2"
                          : "field mb-2 width45"
                      }
                    >
                      <div
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("kilometers")}
                      </div>
                      <input
                        className={
                          windowSize && windowSize <= 640
                            ? "input is-small"
                            : "input"
                        }
                        disabled
                        value={
                          (registrationResponse &&
                            registrationResponse.vehicle_kilometers) ||
                          ""
                        }
                      ></input>
                    </div>
                    <div
                      className={
                        windowSize && windowSize <= 640
                          ? "field width45 mb-2"
                          : "field mb-2 width45"
                      }
                    >
                      {registrationResponse &&
                      registrationResponse.vehicle_kilometers &&
                      registrationResponse.vehicle_kilometers !== null &&
                      registrationResponse.vehicle_kilometers >= 0 ? (
                        <div
                          className={
                            windowSize && windowSize <= 640
                              ? "label isSearchBox textGrey"
                              : "label textGrey"
                          }
                        >
                          {t("current_kilometer")}
                        </div>
                      ) : null}
                      {registrationResponse &&
                      registrationResponse.vehicle_kilometers &&
                      registrationResponse.vehicle_kilometers !== null &&
                      registrationResponse.vehicle_kilometers >= 0 ? (
                        <input
                          onChange={handleAddNewKilometer}
                          className={
                            windowSize && windowSize <= 640
                              ? "input is-small"
                              : "input"
                          }
                        ></input>
                      ) : null}
                    </div>

                    <div className="field width45 mb-2">
                      <div
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("expect_entry_date")}
                      </div>

                      <input
                        className={
                          windowSize && windowSize <= 640
                            ? "input is-small"
                            : "input"
                        }
                        onClick={(event) =>
                          openCalendar(event, "expected_vehicle_entry_date")
                        }
                        value={
                          newInterventionData &&
                          newInterventionData.expected_vehicle_entry_date &&
                          newInterventionData.expected_vehicle_entry_date !==
                            null &&
                          defaults.formatDate(
                            newInterventionData &&
                              newInterventionData.expected_vehicle_entry_date &&
                              newInterventionData.expected_vehicle_entry_date
                          )
                        }
                      ></input>
                    </div>
                    <div className="field width45 mb-2">
                      <p
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("expect_entry_time")}
                      </p>
                      <div className="is-flex">
                        <div
                          className={
                            windowSize && windowSize <= 640
                              ? "select fullWidth is-small"
                              : "select fullWidth"
                          }
                        >
                          <select
                            onChange={handleHoursAndMinutes}
                            name={"expected_vehicle_entry_hours"}
                            className="form-control fullWidth"
                            value={initialExpEntryHH && initialExpEntryHH}
                          >
                            <option>{`${t("HH")}`}</option>
                            {defaults && defaults.hours
                              ? defaults.hours.map((element, index) => {
                                  return (
                                    <option key={index} value={element.id}>
                                      {" "}
                                      {t(element && element.name)}{" "}
                                    </option>
                                  );
                                })
                              : null}
                          </select>
                        </div>
                        <div
                          className={
                            windowSize && windowSize <= 640
                              ? "select fullWidth is-small"
                              : "select fullWidth"
                          }
                        >
                          <select
                            onChange={handleHoursAndMinutes}
                            name={"expected_vehicle_entry_minutes"}
                            className="form-control fullWidth"
                            value={initialExpEntryMM && initialExpEntryMM}
                          >
                            <option>{`${t("MM")}`}</option>
                            {defaults && defaults.minutes
                              ? defaults.minutes.map((element, index) => {
                                  return (
                                    <option key={index} value={element.id}>
                                      {" "}
                                      {t(element && element.name)}{" "}
                                    </option>
                                  );
                                })
                              : null}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="field width45 mb-2">
                      <div
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("date_planned_output")}
                      </div>
                      <input
                        className={
                          windowSize && windowSize <= 640
                            ? "input is-small"
                            : "input"
                        }
                        onClick={(event) =>
                          openCalendar(event, "exp_removal_date")
                        }
                        value={
                          newInterventionData &&
                          newInterventionData.exp_removal_date &&
                          defaults.formatDate(
                            newInterventionData &&
                              newInterventionData.exp_removal_date &&
                              newInterventionData.exp_removal_date
                          )
                        }
                      ></input>
                    </div>
                    <div className="field width45 mb-2">
                      <p
                        className={
                          windowSize && windowSize <= 640
                            ? "label isSearchBox textGrey"
                            : "label textGrey"
                        }
                      >
                        {t("time_planned_output_hour")}
                      </p>
                      <div className="is-flex">
                        <div
                          className={
                            windowSize && windowSize <= 640
                              ? "select fullWidth is-small"
                              : "select fullWidth"
                          }
                        >
                          <select
                            onChange={handleHoursAndMinutes}
                            name={"expected_vehicle_removal_hours"}
                            className="form-control fullWidth"
                            value={initialExpRemovalHH && initialExpRemovalHH}
                          >
                            <option>{`${t("HH")}`}</option>
                            {defaults && defaults.hours
                              ? defaults.hours.map((element, index) => {
                                  return (
                                    <option key={index} value={element.id}>
                                      {" "}
                                      {t(element && element.name)}{" "}
                                    </option>
                                  );
                                })
                              : null}
                          </select>
                        </div>
                        <div
                          className={
                            windowSize && windowSize <= 640
                              ? "select fullWidth is-small"
                              : "select fullWidth"
                          }
                        >
                          <select
                            onChange={handleHoursAndMinutes}
                            name={"expected_vehicle_removal_minutes"}
                            className="form-control fullWidth"
                            value={initialExpRemovalMM && initialExpRemovalMM}
                          >
                            <option>{`${t("MM")}`}</option>
                            {defaults && defaults.minutes
                              ? defaults.minutes.map((element, index) => {
                                  return (
                                    <option key={index} value={element.id}>
                                      {" "}
                                      {t(element && element.name)}{" "}
                                    </option>
                                  );
                                })
                              : null}
                          </select>
                        </div>
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
                        {t("name_description")}
                      </p>
                      <textarea
                        className="textarea is-size-7"
                        value={
                          currentInterventionData &&
                          currentInterventionData.workshop_description
                        }
                        onChange={handleInputDescription}
                      />
                    </div>

                    <div className="fullWidth is-flex is-justify-content-flex-end mt-2 field">
                      <button
                        className={
                          windowSize && windowSize <= 640
                            ? "button is-small is-success"
                            : "button is-success"
                        }
                        onClick={checkFieldsBeforeAddNewIntervention}
                      >
                        <i className="fas fa-check"></i>&nbsp;{t("save")}
                      </button>
                    </div>
                  </div>
                </animated.div>
              )}
            <FooterNavBar />
          </div>
        </animated.div>
      </animated.div>
    </>
  );
};

export default InterventionAddNew;
