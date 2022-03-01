import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const modalActive = "modal is-active";


const Modal = ({
  isShowing,
  hide,
  modalTitle,
  modalBody,
  isSaveData,
  onClickSave,
  maintenance_states
}) => {
  const { t } = useTranslation();
  const [maintenanceStates, setMaintenanceStates] = useState(null);
  const [currentMaintenanceStatus, setCurrentMaintenanceStatus] = useState(null);

useEffect(() => {
  setMaintenanceStates(maintenance_states)
}, [maintenance_states])

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

  setCurrentMaintenanceStatus({
    ...currentMaintenanceStatus,
    [name]: value,
  });
};

const handleOnClickSave = () => {
  onClickSave()
}

  return (
    <>
      {isShowing
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowing && modalActive}>
                <div className="modal-background" onClick={hide}></div>
                <div className="modal-card px-2">
                  <header className="modal-card-head">
                    <p className="modal-card-title is-size-6 has-text-weight-semibold">
                      {modalTitle}
                    </p>
                    <button
                      className="delete"
                      onClick={hide}
                      aria-label="close"
                    ></button>
                  </header>
                  {/* <section className="modal-card-body">{modalBody}</section> */}
                  <section>
                  <div className="field">
                  <div className="select fullWidth">
                    <select
                      onChange={handleInputs}
                      name={"maintenance_status_id"}
                      className="form-control fullWidth"
                    >
                      <option value={0}>{`${t("select_action")}`}</option>
                      {maintenanceStates
                        ? maintenanceStates.map((element, index) => {
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
                  </section>
                  {isSaveData === true && (
                    <footer className="modal-card-foot">
                      <button
                        className="button is-success is-small"
                        onClick={handleOnClickSave}
                      >
                        <i className="fas fa-check" aria-hidden="true"></i>
                      </button>
                      <button
                        className="button is-light is-small"
                        onClick={hide}
                      >
                        <i className="fas fa-times" aria-hidden="true"></i>
                      </button>
                    </footer>
                  )}
                </div>
              </div>
            </React.Fragment>,
            document.body
          )
        : null}      
    </>
  );
};

export default Modal;
