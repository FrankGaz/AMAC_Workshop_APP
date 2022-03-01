import React from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

const modalActive = "modal is-active";

const ModalNotification = ({
  isShowingModalNotification,
  hide,
  modalTitle,
  modalKind }) => {
  const { t } = useTranslation();
  
  // modalKind can be --> Error / Warning / Success

  return (
    <>
      {isShowingModalNotification
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowingModalNotification && modalActive}>
                <div onClick={hide} className="modal-background"></div>
                <div className="modal-card px-2" onClick={hide}>
                  <header className={`modal-card-head modal${modalKind || "Error"}`}>
                    <p className="modal-card-title is-size-6 has-text-weight-semibold">
                      {t(modalTitle)}
                    </p>
                    <button
                      className="delete"
                      onClick={hide}
                      aria-label="close"
                    ></button>
                  </header>
                </div>
              </div>
            </React.Fragment>,
            document.body
          )
        : null}
    </>
  );
};
export default ModalNotification;
