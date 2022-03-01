import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

const modalActive = "modal is-active";

const ModalInterventionDone = ({
  isShowingModalInterventionDone,
  hide,
  modalTitle,
  modalKind,
  goToInterventionsList,
  goToNewService,
}) => {
  const { t } = useTranslation();
  const [newServiceStarter, setNewServiceStarter] = useState(false);
  const [interventionsListStarter, setInterventionsListStarter] =
    useState(false);
  // modalKind can be --> Error / Warning / Success

  const handleClickButton1 = (event) => {
    event.preventDefault();
    setInterventionsListStarter(true);
    // goToInterventionsList("yeah");
    // hide();
  };

  const handleClickButton2 = (event) => {
    event.preventDefault();
    setNewServiceStarter(true);
    // goToNewService("yeah");
    // hide();
  };

  useEffect(() => {
    if (newServiceStarter && newServiceStarter === true) {
      setNewServiceStarter(false);
      // whatToDoNext({action: "newservice"});
      goToNewService("yeah");
      // hide();
    }
    if (interventionsListStarter && interventionsListStarter === true) {
      setInterventionsListStarter(false);
      // whatToDoNext({action: "interventionslist"});
      goToInterventionsList("yeah");
      // hide();
    }
  }, [newServiceStarter, interventionsListStarter]);

  return (
    <>
      {isShowingModalInterventionDone
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowingModalInterventionDone && modalActive}>
                <div onClick={hide} className="modal-background"></div>
                <div
                  className="modal-card modalDone modalSuccess px-2"
                  onClick={hide}
                >
                  <header className={`modal-card-head `}>
                    <p className="modal-card-title is-size-6 has-text-weight-semibold">
                      {t("intervention_creation_success")}
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
                      <p>&nbsp;Lista de Intervenciones</p>
                    </button>
                    <button
                      className="button is-success is-small"
                      onClick={handleClickButton2}
                    >
                      <p>Crear Nuevo Servicio &nbsp;</p>
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
export default ModalInterventionDone;
