import React, { useState, useEffect } from "react";
import appServices from "../../appServices.service";
import { useSpring, animated } from "react-spring";
import _ from "lodash";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import { useTranslation } from "react-i18next";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import useModalNotification from "../../reusableComponents/modals/useModalNotification";
import useModal from "../../reusableComponents/modals/useModal";
import logic from "../../../logic/logic";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FieldInput from "../../reusableComponents/fieldInput";
import useIsValid from "../../../hooks/useIsValid.hook";
import FieldInputDateMobile from "../../reusableComponents/fieldInputDateMobile";
import defaults from "../../reusableComponents/defaults";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalCalendar from "../../reusableComponents/modals/modalCalendar.cmp";
import useModalCalendar from "../../reusableComponents/modals/useModalCalendar";

const InterventionsComponent = (props) => {
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

  const { t } = useTranslation();
  const { isShowing, toggle } = useModal();
  const [modalMessage, setModalMessage] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const [interventionData, setInterventionData] = useState([]);
  // const [interventionStatus, setInterventionStatus] = useState("");
  const [statusTagStyle, setStatusTagStyle] = useState("");
  const [lastInterventionCreated, setLastInterventionCreated] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [licenseNumberInput, setLicenseNumberInput] = useState(null);
  const [fromDateInput, setFromDateInput] = useState(null);
  const [toDateInput, setToDateInput] = useState(null);
  const [interventionCode, setInterventionCode] = useState(null);
  const { isShowingModalCalendar, toggleCalendar } = useModalCalendar();
  const [calendarUse, setCalendarUse] = useState(null);
  const [showThereIsNothingToShow, setShowThereIsNothingToShow] =
    useState(false);

  const [INTERVENTION_STATUS, setInterventionStatus] = useState([]);

  const shortFlow = sessionStorage.getItem("workshopLock");

  //const[shortFlow, setShortFlow]=useState(sessionStorage.getItem("workshopLock"));

  useEffect(() => {
    if (shortFlow == "true") {
      setInterventionStatus([
        {
          id: "without_quote",
          name: "without_butget",
        },

        {
          id: "workshop_authorized",
          name: "authorized_workshop",
        },
        {
          id: "finished",
          name: "finished",
        },
      ]);
    } else if (shortFlow == "false") {
      setInterventionStatus([
        {
          id: "open_quote",
          name: "open_butget",
        },
        {
          id: "without_quote",
          name: "without_butget",
        },
        {
          id: "with_quote",
          name: "with_butget",
        },
        {
          id: "pending_authorization_request",
          name: "pending_request_for_authorisation",
        },
        {
          id: "rejected",
          name: "rejected",
        },
        {
          id: "workshop_authorized",
          name: "authorized_workshop",
        },
        {
          id: "finished",
          name: "finished",
        },
        {
          id: "closed",
          name: "closed",
        },
      ]);
    }
  }, [shortFlow]);

  useEffect(() => {
    setLastInterventionCreated(sessionStorage.getItem("newInterventionId"));
    getInitialDataInterventions();
    sessionStorage.removeItem("currentInterventionId");
    sessionStorage.removeItem("currentInterventionCode");
    sessionStorage.removeItem("currentLockBudget");
    sessionStorage.removeItem("currentFleetData");
  });

  const getInitialDataInterventions = () => {
    if (interventionData && interventionData.length === 0) {
      getInterventions();
    }
  };

  const getInterventions = () => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    appServices
      .getInterventions()
      .then((res) => {
        res &&
          res.json &&
          res.json.interventions &&
          res.json.interventions.length > 0 &&
          setInterventionData(res.json.interventions);
        res &&
          res.json &&
          res.json.interventions &&
          res.json.interventions.length > 0 &&
          setShowThereIsNothingToShow(false);
        res &&
          res.json &&
          res.json.interventions &&
          res.json.interventions.length == 0 &&
          setShowThereIsNothingToShow(true);
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("error_data_fetch"));
      });
  };

  const GoToIntervention = (id) => {
    sessionStorage.removeItem("newInterventionId");
    props.history.push({
      pathname: `/home/interventions/data/${id}`,
    });
  };
  //const tagStatusStyle = item.status.toLowerCase();
  const tagStyles = ["is-size-7", "tag", statusTagStyle];

  const handleGoToAddIntervention = () => {
    sessionStorage.removeItem("newInterventionId");
    props.history.push({
      pathname: `/home/interventions/add`,
    });
  };

  useEffect(() => {
    const preArray = interventionData.filter(
      (item) =>
        item.status !== "Cerrado" &&
        item.status !== "Finalizado" &&
        item.status !== "Rechazado"
    );
    const array = preArray.map((item) => item.license_number.toUpperCase());
    // setLicensePlatesArray(_.uniq(array));
    sessionStorage.setItem("licensePlatesArray", JSON.stringify(_.uniq(array)));
  }, [interventionData]);

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

    if (name === "intervention_status") {
      setSelectedFilter(value);
    }
    if (name === "registration") {
      setLicenseNumberInput(value);
    }
    if (name === "Cod.") {
      setInterventionCode(value);
    }
  };

  const handleSearchClick = () => {
    const to_date_input =
      (toDateInput && defaults.formatDate(toDateInput)) || null;
    const from_date_input =
      (fromDateInput && defaults.formatDate(fromDateInput)) || null;
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
      searchInterventionLicenseNumber:
        (licenseNumberInput &&
          licenseNumberInput.length > 1 &&
          licenseNumberInput !== null &&
          licenseNumberInput) ||
        null,
      searchInterventionCodeCont:
        (interventionCode &&
          interventionCode.length > 1 &&
          interventionCode !== null &&
          interventionCode) ||
        null,
      searchInterventionStatus:
        (selectedFilter &&
          selectedFilter.length > 1 &&
          selectedFilter !== null &&
          selectedFilter.toString()) ||
        null,
      searchInterventionToDate: (to_date_input && to_date_input) || null,
      searchInterventionFromDate: (from_date_input && from_date_input) || null,
    };

    logic.configureQueryParameters({ ...query });

    appServices
      .getInterventions()
      .then((res) => {
        res &&
          res.json &&
          res.json.interventions &&
          res.json.interventions.length > 0 &&
          setInterventionData(res.json.interventions);
        res &&
          res.json &&
          res.json.interventions &&
          res.json.interventions.length > 0 &&
          setShowThereIsNothingToShow(false);
        res &&
          res.json &&
          res.json.interventions &&
          res.json.interventions.length == 0 &&
          setShowThereIsNothingToShow(true);
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("error_data_fetch"));
      });
  };

  const { handleIsValid } = useIsValid();

  const handleClearSearch = () => {
    getInterventions();
    setShowThereIsNothingToShow(false);
    setFromDateInput(null);
    setToDateInput(null);
    setLicenseNumberInput(null);
    setLastInterventionCreated(null);
    setInterventionCode(null);
    setSelectedFilter(null);
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

    const compareDates = (date1, date2) => {
      if (date1 > date2) return "bigger";
    };

    if (dateKey && dateKey.toString().toLowerCase() === "datefrom") {
      if (
        fromDateInput &&
        compareDates(dateValue.toString(), toDateInput.toString()) === "bigger"
      ) {
        setModalKind("Error");
        toggle(setModalMessage("date_from_bigger_than_date_to"));
      } else {
        setFromDateInput(dateValue.toString());
      }
    }

    if (dateKey && dateKey.toString().toLowerCase() === "dateto") {
      if (
        fromDateInput &&
        compareDates(dateValue.toString(), fromDateInput.toString()) ===
          "bigger"
      ) {
        setModalKind("Error");
        toggle(setModalMessage("date_from_bigger_than_date_to"));
      } else {
        setToDateInput(dateValue.toString());
      }
    }

    toggleCalendar();
  };

  return (
    <>
      <animated.div style={springProps}>
        {/* <div>
        <p className="title is-4 my-3">Intervenciones</p>
      </div> */}

        <ModalNotification
          isShowingModalNotification={isShowing}
          hide={toggle}
          modalTitle={modalMessage || "Error"}
          modalKind={modalKind || "Error"}
        />
        <ModalCalendar
          isShowingModalCalendar={isShowingModalCalendar}
          hide={toggleCalendar}
          dateInputName={calendarUse}
          dateSelectedOutput={dateSelectedOutput}
        />
        <div className="mb-3">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id="additional-actions1-header"
            >
              <div
                className={
                  windowSize && windowSize <= 640
                    ? "select is-small fullWidth m-2"
                    : "select fullWidth m-2"
                }
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
              >
                <select
                  onChange={handleSearchInputChange}
                  name={"intervention_status"}
                  className="form-control fullWidth"
                >
                  <option value={0}>{"Estado"}</option>

                  {INTERVENTION_STATUS
                    ? INTERVENTION_STATUS.map((element, index) => {
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

              <div className="is-flex">
                <div
                  className="m-2"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                >
                  <button
                    data-test-id="searchClick"
                    type="button"
                    onClick={(e) => handleSearchClick(e)}
                    className={
                      windowSize && windowSize <= 640
                        ? "button is-small is-search"
                        : "button is-search"
                    }
                    alt={t("search")}
                    title={t("search")}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>

                <div
                  className="m-2"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                >
                  <button
                    data-test-id="clearSearch"
                    type="button"
                    onClick={handleClearSearch}
                    className={
                      windowSize && windowSize <= 640
                        ? "button is-small is-light"
                        : "button is-light"
                    }
                    alt={t("clear_search")}
                    title={t("clear_search")}
                  >
                    <i className="fa fa-eraser"></i>
                  </button>
                </div>
                <div
                  className="m-2"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                >
                  <button
                    data-test-id="clearSearch"
                    type="button"
                    onClick={handleGoToAddIntervention}
                    className={
                      windowSize && windowSize <= 640
                        ? "button is-small is-info"
                        : "button is-info"
                    }
                    alt={t("clear_search")}
                    title={t("clear_search")}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="is-flex mb-2 maxW100">
                <div className="mx-2 width50">
                <p className="label isSearchBox">{t('registration')}</p>
                  <FieldInput
                    input={(licenseNumberInput && licenseNumberInput) || ""}
                    name="registration"
                    maxLength={76}
                    isRequired={false}
                    isValid={handleIsValid}
                    columnSize={6}
                    doInputCheck={handleSearchInputChange}
                    withLabel={false}
                    hasActivator={false}
                    activator={false}
                    isSmall={true}
                  />
                </div>
                <div className="mx-2 width50">
                  <p className="label isSearchBox">{t('Código intervención')}</p>
                  <FieldInput
                    input={(interventionCode && interventionCode) || ""}
                    name="Código intervención"
                    maxLength={76}
                    isRequired={false}
                    isValid={handleIsValid}
                    columnSize={6}
                    doInputCheck={handleSearchInputChange}
                    withLabel={false}
                    hasActivator={false}
                    activator={false}
                    isSmall={true}
                  />
                </div>
              </div>
              <div className="is-flex maxW100">
                <div className="mx-2 width50">
                  <p className="label isSearchBox">Desde fecha</p>
                  {fromDateInput ? (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) => openCalendar(event, "dateFrom")}
                      value={defaults.formatDate(
                        fromDateInput && fromDateInput
                      )}
                    ></input>
                  ) : (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) => openCalendar(event, "dateFrom")}
                    ></input>
                  )}
                </div>
                <div className="mx-2 width50">
                  <p className="label isSearchBox">Hasta fecha</p>
                  {toDateInput ? (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) => openCalendar(event, "dateTo")}
                      value={defaults.formatDate(
                        toDateInput && toDateInput.toString()
                      )}
                    ></input>
                  ) : (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) => openCalendar(event, "dateTo")}
                    ></input>
                  )}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <animated.div style={springPropsContent}>
          {interventionData &&
          interventionData.length > 0 &&
          showThereIsNothingToShow === false ? (
            interventionData.map((item, index) => {
              return (
                <div
                  key={index}
                  item={item}
                  className={"box mb-1 is-flex is-align-items-center"}
                  style={{
                    backgroundColor:
                      item.id == lastInterventionCreated ? "#fffaeb" : "",
                  }}
                >
                  <a 
                    className="container"
                    onClick={(e) => {
                      GoToIntervention(item.id);
                      sessionStorage.setItem(
                        "currentInterventionData",
                        JSON.stringify(item)
                      );
                      sessionStorage.setItem("currentInterventionId", item.id);
                      sessionStorage.setItem(
                        "currentInterventionCode",
                        item.intervention_code
                      );
                    }}
                  >
                    {windowSize && windowSize <= 640 ? (
                      <div className="is-flex is-justify-content-space-between is-align-items-center">
                        <div className="is-flex is-align-items-center is-justify-content-space-between is-flex-wrap-wrap fullWidth">
                          <div className="fullWidth mb-1">
                            <div className="fullWidth mb-1">
                              <p className="is-size-7 textGrey">
                                <b>Nº Inter:</b> {item.intervention_code}
                              </p>
                            </div>
                            <div className="is-flex is-align-items-center is-justify-content-space-between">
                              <div className="width50">
                                <p className="smallerText textGrey">
                                  <b>Fecha:</b> {item.start_date}
                                </p>
                                <p className="smallerText textGrey">
                                  <b>{item.license_number}</b> -{" "}
                                  {item.vehicle_brand} {item.vehicle_model}
                                </p>
                                <p className="smallerText textGrey">
                                  <b>Flota:</b> {item.fleet}
                                </p>
                              </div>
                              <div className="width50">
                                <p className="smallerText textGrey">
                                  <b>Unidad:</b> {item.unity}
                                </p>
                                <p className="smallerText textGrey">
                                  <b>Zona:</b> {item.zone}
                                </p>
                                <p className="smallerText textGrey">
                                  <b>Subzona:</b> {item.subzone}
                                </p>
                              </div>
                            </div>
                            {/* <p className="is-size-9 textGrey">Estado: {item.status}</p> */}
                          </div>
                          <div className="minW250">
                            <span className={_.camelCase(item.status)}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="icon is-pulled-right">
                          <i className="fas fa-2x fa-angle-double-right textRedAmac"></i>
                        </div>
                      </div>
                    ) : (
                      <div className="is-flex is-justify-content-space-between is-align-items-center">
                        <div className="is-flex is-align-items-center is-justify-content-space-between fullWidth">
                          <div className="fullWidth">
                            <div className="fullWidth mb-2">
                              <p className="is-size-6 textGrey">
                                <b>Nº Inter:</b> {item.intervention_code}
                              </p>
                            </div>
                            <div className="is-flex is-align-items-center is-justify-content-space-between">
                              <div className="width50">
                                <p className="is-size-7 textGrey">
                                  <b>Fecha:</b> {item.start_date}
                                </p>
                                <p className="is-size-7 textGrey">
                                  <b>{item.license_number}</b> -{" "}
                                  {item.vehicle_brand} {item.vehicle_model}
                                </p>
                                <p className="is-size-7 textGrey">
                                  <b>Flota:</b> {item.fleet}
                                </p>
                              </div>
                              <div className="width50">
                                <p className="is-size-7 textGrey">
                                  <b>Unidad:</b> {item.unity}
                                </p>
                                <p className="is-size-7 textGrey">
                                  <b>Zona:</b> {item.zone}
                                </p>
                                <p className="is-size-7 textGrey">
                                  <b>Subzona:</b> {item.subzone}
                                </p>
                              </div>
                            </div>
                            {/* <p className="is-size-9 textGrey">Estado: {item.status}</p> */}
                          </div>
                          <div className="minW250">
                            <span className={_.camelCase(item.status)}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="icon is-pulled-right">
                          <i className="fas fa-2x fa-angle-double-right textRedAmac"></i>
                        </div>
                      </div>
                    )}
                  </a>
                </div>
              );
            })
          ) : (
            <div></div>
          )}
          {showThereIsNothingToShow && showThereIsNothingToShow === true && (
            <div>
              <p className="is-size-7 textGrey">
                No hay ninguna intervención en ese estado.
              </p>
            </div>
          )}
        </animated.div>
        <FooterNavBar />
      </animated.div>
    </>
  );
};

export default InterventionsComponent;
