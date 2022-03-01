import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FieldInput from "../../reusableComponents/fieldInput";
import useIsValid from "../../../hooks/useIsValid.hook";
import _ from "lodash";
import CloseButton from "../../../components/reusableComponents/CloseButton";
//import LoadingIcon from "../../../reusableComponents/loadingIcon";

// ComponentShouldUpdate
/*
useEffect(() => {
  setItems([]);
  loadSearches();
  document.addEventListener("keydown", handleEscapePress);
  return () => {
    setItems([]);
    document.removeEventListener("keydown", handleEscapePress);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [showModal]);
*/
const ServiceRequestSearchModal = ({ doRequestSearch, closeModal,
  showModal, }) => {
  const { t } = useTranslation();
  const [registrationToSearch, setRegistrationToSearch] = useState(null);
  // Flag that controls whether the modal is shown.
  const showHideClassName = showModal
    ? "rc-modal display-block modal-open modal in"
    : "modal fade in display-none";
  // Constant that is used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";

  const handleSearchInputRegistration = (event, e) => {
    let value = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      value = event.target.value;
    } else {
      value = e.target.value;
    }
    setRegistrationToSearch(value);
  };

  const handleSearchClick = () => {
    doRequestSearch(registrationToSearch);
    setRegistrationToSearch(null);
  };

  

  const { handleIsValid } = useIsValid();

  return (
    <div
      id="searchFleetsModal"
      className={showHideClassName}
      tabIndex="-1"
      draggable-modal="true"
      
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header of the modal, title changes on either Add or Update depending on of recieved prop has database id or not. */}
          <div className="modal-header">
            <CloseButton closeModal={() => closeModal()} />
            <h3 className="smaller lighter blue no-margin">
              {t("search")} {t("lowercase", { text: t("countries") })}
            </h3>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-md-12 center" style={{ paddingTop: "1em" }}>
                <h3 className="widget-title center smaller lighter blue big-title-margins">
                  {t("incidence_notification")}
                </h3>
              </div>
              <div className="row center">
                <div className="col-md-4"></div>
                <div
                  className="col-md-4 center"
                  style={{
                    paddingTop: "4em",
                    paddingLeft: "5em",
                    paddingRight: "5em",
                  }}
                >
                  <div data-test-id="registration">
                    <FieldInput
                      input={
                        (registrationToSearch && registrationToSearch) || ""
                      }
                      name="registration"
                      maxLength={76}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={12}
                      doInputCheck={handleSearchInputRegistration}
                      withLabel={false}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4" style={{ paddingTop: "1em" }}>
                  <div
                    data-test-id="button"
                    style={{ paddingLeft: "5em", paddingRight: "5em" }}
                  >
                    <button
                      onClick={(event) => handleSearchClick(event)}
                      className="btn btn-primary block btn-sm full"
                    >
                      <i></i> {t("new_service")}
                    </button>
                  </div>
                  <div className="col-md-4"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={() => closeModal()}
              type="button"
              className="btn btn-sm btn-default"
              data-dismiss="modal"
            >
              <i className="ace-icon fa fa-times"></i> {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestSearchModal;
