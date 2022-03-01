import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import _, { set } from "lodash";
import appServices from "../../appServices.service";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import FooterNavBarCreateIntervention from "../../WalletAppComponents/footerNavBar.createIntervention";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import logic from "../../../logic/logic";
import useModal from "../../reusableComponents/modals/useModal";
import useModalNotification from "../../reusableComponents/modals/useModalNotification";
import { useSpring, animated } from "react-spring";

const InterventionAddNewBudgetLineComponent = (props) => {
  const [modalMessage, setModalMessage] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const { isShowing, toggle } = useModal();
  const [breakdownKinds, setBreakdownKinds] = useState([]);
  const [subBreakdownKinds, setSubBreakdownKinds] = useState(null);
  const [budgetDetailActions, setBudgetDetailActions] = useState(null);
  
  const [currentBudgetLine, setCurrentBudgetLine] = useState(null);
  const { t } = useTranslation();
  const history = useHistory();
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const { isShowingModalNotification, toggleNotification } =
    useModalNotification();

  const incidenceKindIdEq = sessionStorage.getItem("incidenceKindNBL");
  const currentInterventionData = JSON.parse(
    sessionStorage.getItem("currentInterventionData")
  );

  // var newID;
  var newID = sessionStorage.getItem("newInterventionId");

  useEffect(() => {
    getBreakdownKinds();
    getSubBreakdownKinds();
    getBudgetDetailActions();
    //var newID = sessionStorage.getItem("newInterventionId");
    // if (newID != null) {
    //   setInterventionIdBack(newID);
      
    // }
  }, []);

  const [interventionIdBack, setInterventionIdBack] = useState(newID);
 

  useEffect(() => {
    if (currentBudgetLine && currentBudgetLine.workshop_cost == null) {
      setCurrentBudgetLine({
        ...currentBudgetLine,
        workshop_cost: 0,
      });
    }

    if (currentBudgetLine && currentBudgetLine.workshop_units == null) {
      setCurrentBudgetLine({
        ...currentBudgetLine,
        workshop_units: 1,
      });
    }
  }, [currentBudgetLine]);

  const getBreakdownKinds = () => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
      incidenceKindIdEq: incidenceKindIdEq,
    };

    logic.configureQueryParameters({ ...query });

    appServices
      .getBreakdownKinds()
      .then((res) => {
        res &&
          res.json &&
          res.json.breakdown_kinds &&
          res.json.breakdown_kinds.length > 0 &&
          setBreakdownKinds(res.json.breakdown_kinds);
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
      });
  };

  const getSubBreakdownKinds = () => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    appServices
      .getSubBreakdownKinds()
      .then((res) => setSubBreakdownKinds(res.json.sub_breakdown_kinds));
  };

  const getBudgetDetailActions = () => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    appServices
      .getBudgetDetailActions()
      .then((res) => setBudgetDetailActions(res.json.budget_detail_actions));
  };

  const checkFieldsBeforeAddBudgetLine = () => {
    const budget_line = {
      workshop_discount:
        (currentBudgetLine && currentBudgetLine.workshop_discount) || null,
      workshop_cost:
        (currentBudgetLine && currentBudgetLine.workshop_cost) || 0,
      workshop_units:
        (currentBudgetLine && currentBudgetLine.workshop_units) || 1,
      sub_breakdown_kind_id:
        (currentBudgetLine && currentBudgetLine.sub_breakdown_kind_id) || null,
      description: (currentBudgetLine && currentBudgetLine.description) || null,
      budget_detail_action_id:
        (currentBudgetLine && currentBudgetLine.budget_detail_action_id) ||
        null,
      breakdown_kind_id:
        (currentBudgetLine && currentBudgetLine.breakdown_kind_id) || null,
    };

    if (
      (budget_line && !budget_line.breakdown_kind_id) ||
      (budget_line && budget_line.breakdown_kind_id === null)
    ) {
      setModalKind("Error");
      toggleNotification(setModalMessage("empty_breakdown_kind_id"));
    }

    // if (
    //   (budget_line && !budget_line.sub_breakdown_kind_id) ||
    //   (budget_line && budget_line.sub_breakdown_kind_id === null)
    // ) {
    //   setModalKind("Error");
    //   toggleNotification(setModalMessage("empty_sub_breakdown_kind_id"));
    // }

    // if (
    //   (budget_line && !budget_line.description) ||
    //   (budget_line && budget_line.description === null)
    // ) {
    //   setModalKind("Error");
    //   toggleNotification(setModalMessage("empty_description_field"));
    // }
    // if (
    //   (budget_line && !budget_line.workshop_cost) ||
    //   (budget_line && budget_line.workshop_cost === null) ||
    //   (budget_line && budget_line.workshop_cost === 0)
    // ) {
    //   setModalKind("Error");
    //   toggleNotification(setModalMessage("empty_workshop_cost_field"));
    // }

    // if (
    //   (budget_line && !budget_line.workshop_units) ||
    //   (budget_line && budget_line.workshop_units === null) ||
    //   (budget_line && budget_line.workshop_units === 0)
    // ) {
    //   setModalKind("Error");
    //   toggleNotification(setModalMessage("empty_workshop_units"));
    // }

    if (
      budget_line &&
      budget_line.breakdown_kind_id
      // budget_line.sub_breakdown_kind_id &&
      // budget_line &&
      // budget_line.description.length > 0
    ) {
      saveBudgetLine(budget_line);
    }
  };

  const goToIntervention = () => {
    // sessionStorage.setItem("currentServiceId", id);
    // sessionStorage.setItem(
    //   "currentLockBudget",
    //   currentInterventionData && currentInterventionData.lock_budget
    // );
    // props.history.push({
    //   pathname: `/home/interventions/data/${interventionId}`,
    // });
    const newIinterventionId = sessionStorage.getItem("newInterventionId");
    if (!newIinterventionId) {
      history.goBack();
    } else {
      window.location.reload();
    }
  };

  const saveBudgetLine = (budget_line) => {
    const interventionId =
      currentInterventionData && currentInterventionData.id;
    const serviceId = sessionStorage.getItem("currentServiceId");

    appServices
      .addBudgetLine(interventionId, serviceId, budget_line)
      .then((data) => {
        if (
          data &&
          data.json &&
          data.json.budget_line &&
          data.json.budget_line.id
        ) {
          setModalKind("Success");
          toggle(setModalMessage("new_budget_line_success"));
          setTimeout(() => {
            goToIntervention();
          }, 2000);
        }
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("new_budget_line_error"));
        // toggle error
        // stay in page
        // do not clear states
      });
  };

  // const saveWahetever = (budget_line) => {
  //    // hacer llamada
  //   const interventionId = sessionStorage.getItem("currentInterventionId");
  //   const serviceId = sessionStorage.getItem("currentServiceId");

  //   appServices
  //     .addBudgetLine(interventionId, serviceId, budget_line)
  //     .then((data) => {
  //       if (
  //         data &&
  //         data.json &&
  //         data.json.budget_line &&
  //         data.json.budget_line.id
  //       ) {
  //         setModalKind("Success");
  //         toggle(setModalMessage("new_budget_line_success"));
  //         setTimeout(() => {
  //           history.goBack();
  //         }, 2000);
  //       }
  //     })
  //     .catch((err) => {
  //       setModalKind("Error");
  //       err && err.message && toggle(setModalMessage(err.message));
  //       err && !err.message && toggle(setModalMessage("new_budget_line_error"));
  //       // toggle error
  //       // stay in page
  //       // do not clear states
  //     });
  // }

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

    setCurrentBudgetLine({
      ...currentBudgetLine,
      [name]: value,
    });
  };

  // const handleInputs = (event, e) => {
  //   let value = null;
  //   let name = null;
  //   if (event && event.target && event.target.value && event.target.name) {
  //     value = event.target.value;
  //     name = event.target.name;
  //   }

  //   setCurrentBudgetLine({
  //     ...currentBudgetLine,
  //     [name]: value,
  //   });
  // };

  const springPropsContent = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });

  return (
    <>
      {/* // aquests breakdownKinds es mostren a dins un modal amb dos botons  */}
      <ModalNotification
        isShowingModalNotification={isShowing}
        hide={toggle}
        modalTitle={modalMessage || "Error"}
        modalKind={modalKind}
      />
      <ModalNotification
        isShowingModalNotification={isShowingModalNotification}
        hide={toggleNotification}
        modalTitle={modalMessage || "Error"}
        modalKind={modalKind}
      />
      <animated.div style={springPropsContent}>
        <div className="box budgetDataBox is-justify-content-space-between is-flex is-flex-wrap-wrap">
          {/* <div className="field fullWidth">
            <p
              className={
                windowSize && windowSize <= 640
                  ? "is-size-6 textGrey"
                  : "is-size-5 textGrey"
              }
            >
              <strong>{t("new_budget_line")}</strong>
            </p>
          </div>
          <div className="divider fullWidth is-right my-2"></div> */}
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
              {t("breakdown_kind")}
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
                name={"breakdown_kind_id"}
                className="form-control fullWidth"
              >
                <option value={0}>{`${t("select_kind")}`}</option>
                {breakdownKinds
                  ? breakdownKinds.map((element, index) => {
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
              Subtipo de Avería
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
                name={"sub_breakdown_kind_id"}
                className="form-control fullWidth"
              >
                <option value={0}>{`${t("select_subkind")}`}</option>
                {subBreakdownKinds
                  ? subBreakdownKinds.map((element, index) => {
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
              {t("description")}
            </p>
            <textarea
              name={"description"}
              value={currentBudgetLine && currentBudgetLine.description}
              onChange={handleInputs}
              className="textarea is-size-7"
            />
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
              {t("action")}
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
                name={"budget_detail_action_id"}
                className="form-control fullWidth"
              >
                <option value={0}>{`${t("select_action")}`}</option>
                {budgetDetailActions
                  ? budgetDetailActions.map((element, index) => {
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
              {t("workshop_units")}
            </p>
            <input
              type="number"
              className={
                windowSize && windowSize <= 640 ? "input is-small" : "input"
              }
              name="workshop_units"
              value={
                (currentBudgetLine && currentBudgetLine.workshop_units) || ""
              }
              onChange={handleInputs}
            />
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
              {t("workshop_cost")}
            </p>
            <input
              type="number"
              className={
                windowSize && windowSize <= 640 ? "input is-small" : "input"
              }
              name="workshop_cost"
              value={currentBudgetLine && currentBudgetLine.workshop_cost}
              onChange={handleInputs}
            />
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
              {t("workshop_discount")}
            </p>
            <input
              type="number"
              className={
                windowSize && windowSize <= 640 ? "input is-small" : "input"
              }
              name="workshop_discount"
              value={currentBudgetLine && currentBudgetLine.workshop_discount}
              onChange={handleInputs}
            />
          </div>
          <div className="fullWidth is-flex is-justify-content-flex-end mt-2 field">
            <button
              className={
                windowSize && windowSize <= 640
                  ? "button is-small is-success"
                  : "button is-success"
              }
              onClick={checkFieldsBeforeAddBudgetLine}
            >
              <i className="fas fa-check"></i>&nbsp;{t("save")}
            </button>
          </div>
        </div>
      </animated.div>
      {/* <FooterNavBar /> */}
      <FooterNavBarCreateIntervention interventionId={newID} />
    </>
  );
};

export default InterventionAddNewBudgetLineComponent;
