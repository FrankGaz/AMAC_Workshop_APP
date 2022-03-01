import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const modalActive = "modal is-active";

const ModalDelete = ({
  isShowingModalDelete,
  hide,
  isSaveData,
  itemToDelete,
  deleteBudgetLine,
  deleteService,
}) => {
  const { t } = useTranslation();
  const [itemKind, setItemKind] = useState(null);
  const [textToShow, setTextToShow] = useState(null);

  useEffect(() => {
    if (itemToDelete && itemToDelete.kind && itemToDelete.kind === "service") {
      setItemKind(t("service_"));
      setTextToShow(itemToDelete && itemToDelete.name);
    }
    if (
      itemToDelete &&
      itemToDelete.kind &&
      itemToDelete.kind === "budget_line"
    ) {
      setItemKind(t("budget_line_"));
      setTextToShow(itemToDelete && itemToDelete.breakdown_kind && itemToDelete.breakdown_kind);
    }
  }, [itemToDelete]);

  const handleClickDelete = () => {
    if (itemToDelete && itemToDelete.kind && itemToDelete.kind === "service") {
      setItemKind(null);
      deleteService(itemToDelete);
    }
    if (
      itemToDelete &&
      itemToDelete.kind &&
      itemToDelete.kind === "budget_line"
    ) {
      setItemKind(null);
      deleteBudgetLine(itemToDelete);
    }
  };

  const emptyString = "";

  return (
    <>
      {isShowingModalDelete
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowingModalDelete && modalActive}>
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
                    <section>
                      <p>
                        <b>{`${t("you_are_about_to_delete")} ${
                          (itemKind && itemKind) || t("this_register")
                        } ${(textToShow && textToShow) || emptyString}.`}</b>
                      </p>
                    </section>
                    <section className="mt-2">
                      <p>{t("are_you_sure")}</p>
                    </section>
                  </section>
                  {isSaveData === true && (
                    <footer className="modal-card-foot">
                      <button
                        className="button is-small is-success"
                        onClick={hide}
                      >
                        <i className="fas fa-times" aria-hidden="true"></i>&nbsp;{t('cancel')}
                      </button>
                      <button
                        className="button is-danger is-small"
                        onClick={handleClickDelete}
                      >
                        <i className="fas fa-trash-alt"></i>&nbsp;{t('delete')}
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

export default ModalDelete;
