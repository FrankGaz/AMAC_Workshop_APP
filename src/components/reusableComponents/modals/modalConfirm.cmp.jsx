import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const modalActive = "modal is-active";

const ModalConfirm = ({
  isShowingModalConfirm,
  hide,
  isSaveData,
  confirmAction,
  textToShow,
  textToShowBold,
  
}) => {
  const { t } = useTranslation();
 //  const [itemKind, setItemKind] = useState(null);
//   const [textToShow, setTextToShow] = useState(null);

  

  const handleClickConfirm = () => {
      confirmAction(confirmAction);
  };

  const emptyString = "";

  return (
    <>
      {isShowingModalConfirm
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowingModalConfirm && modalActive}>
                <div className="modal-background" onClick={hide}></div>
                <div className="modal-card px-2">
                  <header className="modal-card-head modalWarningDelete">
                    <p className="modal-card-title is-size-6 has-text-weight-semibold">
                      <p>{t("attention")}</p>
                    </p>
                    <div className="closeModalButton">
                      <button
                        className="delete"
                        onClick={hide}
                        aria-label="close"
                      ></button>
                    </div>
                  </header>
                  <section className="modal-card-body is-flex is-justify-content-center is-flex-direction-column is-align-items-center">
                  <section className="mb-3">
                      <p>
                        {`${(textToShow && textToShow) || emptyString}`}
                      </p>
                    </section>
                    <section className="mb-3">
                      <p>
                        <b>{`${(textToShowBold && textToShowBold) || emptyString}`}</b>
                      </p>
                    </section>
                    <section className="mt-2">
                      <p>{t("are_you_sure")}</p>
                    </section>
                  </section>
                  {isSaveData === true && (
                    <footer className="modal-card-foot is-flex is-justify-content-space-around">
                      <button
                        className="button redContainer"
                        onClick={hide}
                      >
                        <i className="fas fa-times" aria-hidden="true"></i>&nbsp;{t('cancel')}
                      </button>
                      <button
                        className="button is-success "
                        onClick={handleClickConfirm}
                      >
                        <i className="fas fa-check"></i>&nbsp;{t('accept')}
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

export default ModalConfirm;
