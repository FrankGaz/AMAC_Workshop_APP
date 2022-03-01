import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import useModal from "../../reusableComponents/modals/useModal";
import appServices from "../../appServices.service";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import logic from "../../../logic/logic";
import ModalInputRadioTwo from "../../reusableComponents/modalInputRadioTwo";
import { useSpring, animated } from "react-spring";
import ModalServiceDone from "../../reusableComponents/modals/modalServiceDone.cmp";
import useModalServiceDone from "../../reusableComponents/modals/useModalServiceDone";
import useModalNotification from "../../reusableComponents/modals/useModalNotification";

const InterventionAddNewServiceComponent = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [modalMessage, setModalMessage] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const { isShowing, toggle } = useModal();
  const [currentService, setCurrentService] = useState(null);
  const [serviceChargeCost, setServiceChargeCost] = useState(null);
  const [incidenceKinds, setIncidenceKinds] = useState(null);
  const [serviceKinds, setServiceKinds] = useState(null);
  const [interventionData, setInterventionData] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const { isShowingModalNotification, toggleNotification } =
    useModalNotification();
  const [warrantyState, setWarrantyState] = useState([
    { id: 1, name: "Garantía" },
    { id: 2, name: "Fuera Garantía" },
    { id: 3, name: "N.A." },
  ]);
  const { isShowingModalServiceDone, toggleServiceDone } =
    useModalServiceDone();

  useEffect(() => {
    setInterventionData(
      JSON.parse(sessionStorage.getItem("currentInterventionData"))
    );
  }, []);

  useEffect(() => {
    interventionData &&
      interventionData.id &&
      getInterventionDataCall(interventionData.id);
  }, [interventionData]);

  const getInterventionDataCall = (id) => {
    appServices.getIntervention(id).then((res) => {
      res &&
        res.json &&
        res.json.intervention &&
        res.json.intervention.vehicle_fleet_id &&
        getIncidenceKinds(res.json.intervention.vehicle_fleet_id);
      sessionStorage.setItem(
        "currentInterventionData",
        JSON.stringify(res.json.intervention)
      );
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
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
      });
  };

  const getServiceKinds = (incidence_kind_id_eq) => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
      incidenceKindIdEq: incidence_kind_id_eq || null,
    };

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
      });
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

    setCurrentService({
      ...currentService,
      [name]: value,
    });
  };

  const handleExpedientWarranty = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    setCurrentService({
      ...currentService,

      expedient_warranty_id: value,
      charge_cost: value === 1 ? false : true
    });
  };

  const checkFieldsBeforeAddNewService = () => {
    const interventionId = interventionData && interventionData.id;
    const workshopData = JSON.parse(sessionStorage.getItem("workshopData"));
    const workshopName = workshopData && workshopData.name;
    const companyId = logic.companyId.id;
    const service = {
      charge_cost: serviceChargeCost || false,
      company_id: companyId || null,
      description:
        (currentService &&
          currentService.description &&
          "- Servicio creado por " +
            workshopName +
            "\n" +
            currentService.description) ||
        "- Servicio creado por " + workshopName + "\n",
      expedient_warranty_id:
        (currentService && currentService.expedient_warranty_id) || null,
      incidence_kind_id:
        (currentService && currentService.incidence_kind_id) || null,
      service_kind_id:
        (currentService && currentService.service_kind_id) || null,
    };

    if (service && service.incidence_kind_id === null) {
      setModalKind("Error");
      toggleNotification(setModalMessage("choose_incidence_kind"));
    }
    if (service && service.service_kind_id === null) {
      setModalKind("Error");
      toggleNotification(setModalMessage("choose_service_kind"));
    }
    if (
      service &&
      service.incidence_kind_id != null &&
      service &&
      service.service_kind_id != null
    ) {
      saveService(service);
    }
  };

  const saveService = (service) => {
    const interventionId = interventionData && interventionData.id;
    const companyId = logic.companyId.id;
    service &&
      appServices
        .addService(interventionId, service)
        .then((data) => {
          if (data && data.json && data.json.service && data.json.service.id) {
            sessionStorage.setItem("currentServiceId", data.json.service.id);
            sessionStorage.setItem(
              "incidenceKindNBL",
              data.json.service.incidence_kind_id
            );
            toggleServiceDone();
            // setModalKind("Success");
            // toggle(setModalMessage("new_service_success"));
            // setTimeout(() => {
            //   history.goBack();
            // }, 2000);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("new_service_error"));
          // toggle error
          // stay in page
          // do not clear states
        });
  };

  const handleRadioButtons = (item) => {
    const value = item && item.target && item.target.value;

    if (
      value.toLowerCase() === "yes" ||
      value.toLowerCase() === "sí" ||
      value.toLowerCase() === "si"
    ) {
      setServiceChargeCost(true);
    } else {
      setServiceChargeCost(false);
    }
  };

  const springPropsContent = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });

  const goToIntervention = () => {
    const interventionIdForPush = sessionStorage.getItem(
      "currentInterventionId"
    );
    props.history.push({
      pathname: `/home/interventions/data/${interventionIdForPush}`,
    });
  };
  const goToNewBudgetLine = () => {
    props.history.push({
      pathname: `/home/interventions/newbudgetline`,
    });
  };

  return (
    <>
      <ModalNotification
        isShowingModalNotification={isShowingModalNotification}
        hide={toggleNotification}
        modalTitle={modalMessage || "Error"}
        modalKind={modalKind}
      />
      <ModalServiceDone
        isShowingModalServiceDone={isShowingModalServiceDone}
        hide={toggleServiceDone}
        modalTitle={modalMessage || "Atención"}
        modalKind={modalKind}
        goToNewBudgetLine={goToNewBudgetLine}
        goToIntervention={goToIntervention}
      />

      <animated.div style={springPropsContent}>
        {/* <div>
          <p>
            <strong>New Service Screen</strong>
          </p>
        </div> */}

        <div className="box budgetDataBox is-justify-content-space-between is-flex is-flex-wrap-wrap">
          <div className="field width45 mb-2">
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              {t("incidence_kind")}
            </p>

            <div
              className={
                windowSize && windowSize <= 640
                  ? "select fullWidth is-small"
                  : "select fullWidth"
              }
            >
              <select
                onChange={handleInputs}
                name={"incidence_kind_id"}
                className="form-control fullWidth"
              >
                <option value={0}>{t("select_incidence_kind")}</option>
                {incidenceKinds
                  ? incidenceKinds.map((element, index) => {
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
          <div className="field mb-2 width45">
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              {t("service_kind")}
            </p>
            {currentService &&
            currentService.incidence_kind_id &&
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
                <select
                  onChange={handleInputs}
                  name={"service_kind_id"}
                  className="form-control fullWidth"
                >
                  <option value={0}>{t("select_service_kind")}</option>
                  {serviceKinds
                    ? serviceKinds.map((element, index) => {
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
            ) : (
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
              ></input>
            )}
          </div>

          <div className="field mb-2 fullWidth">
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              {t("description")}
            </p>
            <textarea
              name={"description"}
              value={(currentService && currentService.description) || ""}
              onChange={handleInputs}
              className="textarea is-size-7"
            />
          </div>

          <div className="field mb-2 width45">
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              {t("charge_cost")}
            </p>
            <ModalInputRadioTwo
              name={"charge_cost"}
              initialInput={serviceChargeCost || ""}
              isRequired={false}
              doChange={handleRadioButtons}
              withLabel={false}
              value1={t("yes")}
              value2={t("no")}
            />
          </div>
          <div className="field mb-2 width45">
            <p
              className={
                windowSize && windowSize <= 640
                  ? "label isSearchBox textGrey"
                  : "label textGrey"
              }
            >
              {t("warranty")}
            </p>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "select fullWidth is-small"
                  : "select fullWidth"
              }
            >
              <select
                onChange={handleExpedientWarranty}
                name={"expedient_warranty_id"}
                className="form-control fullWidth"
              >
                <option value={0}>{t("select_warranty")}</option>
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
            </div>
          </div>

          {/* <p className="is-size-7 textGrey">Unidades Taller - input</p>
              <input
                type="number"
                name="workshop_units"
                value={currentService && currentService.workshop_units}
                onChange={handleInputs}
              />
              <p className="is-size-7 textGrey">Coste Taller</p>
              <input
                type="number"
                name="workshop_cost"
                value={currentService && currentService.workshop_cost}
                onChange={handleInputs}
              />
              <p className="is-size-7 textGrey">Descuento Taller - input</p>
              <input
                type="number"
                name="workshop_discount"
                value={currentService && currentService.workshop_discount}
                onChange={handleInputs}
              /> */}

          <div className="fullWidth is-flex is-justify-content-flex-end mt-2 field">
            <button
              className={
                windowSize && windowSize <= 640
                  ? "button is-small is-success"
                  : "button is-success"
              }
              onClick={checkFieldsBeforeAddNewService}
            >
              <i className="fas fa-check"></i>&nbsp;{t("save")}
            </button>
          </div>
        </div>
      </animated.div>
      <FooterNavBar />
    </>
  );
};

export default InterventionAddNewServiceComponent;
