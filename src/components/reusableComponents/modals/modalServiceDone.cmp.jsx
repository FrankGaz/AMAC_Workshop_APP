import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

const modalActive = "modal is-active";

const ModalServiceDone = ({
  isShowingModalServiceDone,
  hide,
  modalTitle,
  modalKind,
  goToIntervention,
  goToNewBudgetLine,
}) => {
  const { t } = useTranslation();
  const [newBudgetLine, setNewBudgetLine] = useState(false);
  const [interventionStarter, setInterventionStarter] = useState(false);
  // modalKind can be --> Error / Warning / Success

  const handleClickButton1 = (event) => {
    event.preventDefault();
    setInterventionStarter(true);
  };

  const handleClickButton2 = (event) => {
    event.preventDefault();
    setNewBudgetLine(true);
  };

  useEffect(() => {
    if (newBudgetLine && newBudgetLine === true) {
      setNewBudgetLine(false);
      goToNewBudgetLine("yeah");
    }
    if (interventionStarter && interventionStarter === true) {
      setInterventionStarter(false);
      goToIntervention("yeah");
    }
  }, [newBudgetLine, interventionStarter]);

  return (
    <>
      {isShowingModalServiceDone
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowingModalServiceDone && modalActive}>
                <div onClick={hide} className="modal-background"></div>
                <div
                  className="modal-card modalDone modalSuccess px-2"
                  onClick={hide}
                >
                  <header className={`modal-card-head modalSuccess`}>
                    <p className="modal-card-title is-size-6 has-text-weight-semibold">
                      {t("new_service_success")}
                    </p>
                    <button
                      className="delete"
                      onClick={hide}
                      aria-label="close"
                    ></button>
                  </header>
                  <section className="modal-card-body is-flex is-justify-content-center is-flex-direction-column is-align-items-center">
                    <section>
                      <p>
                        {/* <b>{`${t("intervention_creation_success")}.`}</b> */}
                        <b>{` `}</b>
                      </p>
                    </section>
                    <section className="mt-2">
                      <p>{t("what_to_do_now")}</p>
                    </section>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      className="button is-light is-small"
                      onClick={handleClickButton1}
                    >
                      <i className="fas fa-arrow-left"></i>
                      <p>&nbsp;Intervención</p>
                    </button>
                    <button
                      className="button is-success is-small"
                      onClick={handleClickButton2}
                    >
                      <p>Crear Línea de Presupuesto &nbsp;</p>{" "}
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </footer>
                </div>
              </div>
            </React.Fragment>,
            document.body
          )
        : null}
    </>
  );
};
export default ModalServiceDone;
