import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import appServices from "../../appServices.service";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import logic from "../../../logic/logic";
import useModal from "../../reusableComponents/modals/useModal";
import useModalNotification from "../../reusableComponents/modals/useModalNotification";
import { useSpring, animated } from "react-spring";

const InterventionBudgetLineComponent = (props) => {
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
  const [currentBudgetLineData, setCurrentBudgetLineData] = useState(null);
  const { isShowingModalNotification, toggleNotification } =
    useModalNotification();
  const [breakdownKindToShow, setBreakdownKindToShow] = useState(null);

  const incidenceKindIdEq = sessionStorage.getItem("incidenceKindNBL");
  const currentInterventionData = JSON.parse(
    sessionStorage.getItem("currentInterventionData")
  );

  useEffect(() => {
    getInitialData();
    getBreakdownKinds();
    getSubBreakdownKinds();
    getBudgetDetailActions();
  }, []);

  useEffect(() => {
    if (currentBudgetLineData && currentBudgetLineData.workshop_cost == null) {
      setCurrentBudgetLineData({
        ...currentBudgetLineData,
        workshop_cost: 0,
      });
    }

    if (currentBudgetLineData && currentBudgetLineData.workshop_units == null) {
      setCurrentBudgetLineData({
        ...currentBudgetLineData,
        workshop_units: 1,
      });
    }

    if (
      currentBudgetLineData &&
      currentBudgetLineData.breakdown_kind_id != null
    ) {
      setBreakdownKindToShow(currentBudgetLineData.breakdown_kind_id);
    }
  }, [currentBudgetLineData]);


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

  const getInitialData = () => {
    const budgetId = sessionStorage.getItem("currentLineBudgetId");
    const serviceId = sessionStorage.getItem("currentServiceId");
    const interventionId = sessionStorage.getItem("currentInterventionId");
    interventionId &&
      serviceId &&
      budgetId &&
      appServices
        .getServiceBudgetLine(interventionId, serviceId, budgetId)
        .then((res) => {
          res &&
            res.json &&
            res.json.budget_line &&
            setCurrentBudgetLineData(res.json.budget_line);
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

    // interventionId &&
    //   serviceId &&
    //   budgetId &&
    //   appServices
    //     .getServiceBudgetLines(interventionId, serviceId)
    //     .then((res) => {
    //       if (res && res.json && res.json.budget_lines) {
    //         setBudgetLines(res.json.budget_lines);
    //       }
    //     })
    //     .catch((err) => {
    //       setModalKind("Error");
    //       err && err.message && toggle(setModalMessage(err.message));
    //       err && !err.message && toggle(setModalMessage("error_data_fetch"));
    //     });
  };

  const saveBudgetLine = () => {
    const currentBudgetLineIdToSave = sessionStorage.getItem(
      "currentLineBudgetId"
    );
    const interventionId =
      currentInterventionData && currentInterventionData.id;
    const serviceId = sessionStorage.getItem("currentServiceId");
    // const budgetLineId = sessionStorage.getItem("currentBugetId");
    const budgetLineData = {
      budget_detail_action_id:
        (currentBudgetLineData &&
          currentBudgetLineData.budget_detail_action_id) ||
        null,
      // budget_detail_actions:
      //   (currentBudgetLineData && currentBudgetLineData.budget_detail_action) ||
      //   null,
      breakdown_kind_id:
        (currentBudgetLineData && currentBudgetLineData.breakdown_kind_id) ||
        null,
      // breakdown_kind:
      //   (currentBudgetLineData && currentBudgetLineData.breakdown_kind) || null,
      sub_breakdown_kind_id:
        (currentBudgetLineData &&
          currentBudgetLineData.sub_breakdown_kind_id) ||
        null,
      sub_breakdown_kind:
        (currentBudgetLineData && currentBudgetLineData.sub_breakdown_kind) ||
        null,
      description:
        (currentBudgetLineData && currentBudgetLineData.description) || null,
      workshop_units:
        (currentBudgetLineData && currentBudgetLineData.workshop_units) || 1,
      workshop_cost:
        (currentBudgetLineData && currentBudgetLineData.workshop_cost) || 0,
      workshop_discount:
        (currentBudgetLineData && currentBudgetLineData.workshop_discount) ||
        null,
    };

    appServices
      .updateBudgetLine(
        interventionId,
        serviceId,
        currentBudgetLineIdToSave,
        budgetLineData
      )
      .then((data) => {
        if (
          data &&
          data.json &&
          data.json.budget_line &&
          data.json.budget_line.id
        ) {
          setModalKind("Success");
          toggle(setModalMessage("update_budget_line_success"));
          // setTimeout(() => {
          //   history.goBack();
          // }, 2000);
          setTimeout(() => {
            window.location.href =
              "#/home/interventions/data/" + interventionId + "/services";
          }, 2000);
        }
      })
      .catch((err) => {
        setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err &&
          !err.message &&
          toggle(setModalMessage("update_budget_line_error"));
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

    if (name === "breakdown_kind_id") {
      getBreakdownKinds(value);
    }
    if (name === "sub_breakdown_kind_id") {
      getSubBreakdownKinds(value);
    }
    if (name === "budget_detail_action_id") {
      getBudgetDetailActions(value);
    }

    setCurrentBudgetLineData({
      ...currentBudgetLineData,
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
          <div className="field fullWidth">
            <div className="label">{t("buget_line_data")}</div>
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
                // value={
                //   (currentBudgetLineData &&
                //     currentBudgetLineData.breakdown_kind_id &&
                //     currentBudgetLineData.breakdown_kind_id) ||
                //   ""
                // }
                value={breakdownKindToShow || ""}
              >
                <option value={0}>{`${t("select_kind")}`}</option>
                {breakdownKinds
                  ? breakdownKinds.map((element, index) => {
                      return (
                        <option key={index} value={element.id}>
                          {" "}
                          {element && element.name}{" "}
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
                value={
                  (currentBudgetLineData &&
                    currentBudgetLineData.sub_breakdown_kind_id &&
                    currentBudgetLineData.sub_breakdown_kind_id) ||
                  ""
                }
              >
                <option value={0}>{`${t("select_subkind")}`}</option>
                {subBreakdownKinds
                  ? subBreakdownKinds.map((element, index) => {
                      return (
                        <option key={index} value={element.id}>
                          {" "}
                          {element && element.name}{" "}
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
              value={
                currentBudgetLineData &&
                currentBudgetLineData.description &&
                currentBudgetLineData.description
              }
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
                value={
                  (currentBudgetLineData &&
                    currentBudgetLineData.budget_detail_action_id &&
                    currentBudgetLineData.budget_detail_action_id) ||
                  ""
                }
              >
                <option value={0}>{`${t("select_action")}`}</option>
                {budgetDetailActions
                  ? budgetDetailActions.map((element, index) => {
                      return (
                        <option key={index} value={element.id}>
                          {" "}
                          {element && element.name}{" "}
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
                (currentBudgetLineData &&
                  currentBudgetLineData.workshop_units &&
                  currentBudgetLineData.workshop_units) ||
                ""
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
              value={
                currentBudgetLineData &&
                currentBudgetLineData.workshop_cost &&
                currentBudgetLineData.workshop_cost
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
              {t("workshop_discount")}
            </p>
            <input
              type="number"
              className={
                windowSize && windowSize <= 640 ? "input is-small" : "input"
              }
              name="workshop_discount"
              value={
                currentBudgetLineData &&
                currentBudgetLineData.workshop_discount &&
                currentBudgetLineData.workshop_discount
              }
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
              onClick={saveBudgetLine}
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

export default InterventionBudgetLineComponent;
