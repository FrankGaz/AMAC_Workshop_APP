import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useIsValid from "../../../hooks/useIsValid.hook";
import CloseButton from "../../reusableComponents/CloseButton";
import tablePhonesService from "./tablePhones.service";
import ModalInput from "../../reusableComponents/modalInput";
import FieldInputSelect from "../../reusableComponents/fieldInputSelect";
import ModalInputTextArea from "../../reusableComponents/modalInputTextArea";
import _ from "lodash";

const TablePhonesModal = ({
  item,
  closeModal,
  showModal,
  searchSelection,
  errorMessage,
}) => {
  // translation API from reactI18next
  const { t } = useTranslation();

  // Flag that controls whether the modal is shown.
  const showHideClassName = showModal
    ? "rc-modal display-block modal-open modal in"
    : "modal fade in display-none";
  // Constant that is used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";

  // sets loading icon
  const [loading, setLoading] = useState(false);

  // state that controls required input error icon
  // eslint-disable-next-line no-unused-vars
  const [showRequiredError, setShowRequiredError] = useState(
    collapseElementClass
  );
  // eslint-disable-next-line no-unused-vars
  const [showMaxLengthError, setShowMaxLengthError] = useState(
    collapseElementClass
  );
  const [showAlreadyUsedError, setShowAlreadyUsedError] = useState(
    collapseElementClass
  );

  // Component state
  // Inicident selected for adding or updating
  const [phoneItem, setPhoneItem] = useState({});
  const [phoneKinds, setPhoneKinds] = useState([]);

  useEffect(() => {
    // set initial values for data
    setLoading(false);
    tablePhonesService
      .getPhoneKinds()
      .then((res) => setPhoneKinds(res.json.phone_kinds))
      .then(() => setPhoneItem(item));

    // Adds event listener OnMount that closes the modal on Esc key press
    document.addEventListener("keydown", handleEscapePress);
    // On UnMount it removes the event listener
    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  // Closes the modal on Esc key press
  const handleEscapePress = (e) => {
    if (e.keyCode === 27) {
      return handleCloseModal();
    }
  };

  const handlePhoneNumberInputChange = ({ name, input }) => {
    // Handles the state change
    setPhoneItem({
      ...phoneItem,
      [name]: input,
    });
  };

  /*
      Handles modal save/update actions
    */
  const handleSave = () => {
    setLoading(false);
    searchSelection(phoneItem);
    handleCloseModal();
  };

  // Because the modal is shown or hidden using CSS, we set the values to default when closed
  const handleCloseModal = () => {
    setShowRequiredError(collapseElementClass);
    setShowMaxLengthError(collapseElementClass);
    setShowAlreadyUsedError(collapseElementClass);
    setLoading(false);
    setPhoneItem({});
    return closeModal();
  };

  const { handleIsValid, activateActionButton } = useIsValid();

  const handleSelectInputChange = (phoneKindId) => {
    setPhoneItem({
      ...phoneItem,
      phone_kind_id: phoneKindId.target.value,
    });
  };

  const handleInputObservations = (event, e) => {
    let value = null;
    let name = null;

    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    setPhoneItem({
      ...phoneItem,
      observations: value,
    });
  };

  return (
    <div id="fillModal" className={showHideClassName} draggable-modal="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <CloseButton closeModal={handleCloseModal} />
            <h3 className="smaller lighter blue no-margin">
              <span> {t("add") + " " + t("phone")} </span>
            </h3>
          </div>

          {/* Handles the inputs of the modal.*/}
          <div className="modal-body">
            <div>
              <div className="row">
                <ModalInput
                  input={(phoneItem && phoneItem.country_code) || ""}
                  name="country_code"
                  maxLength={76}
                  isRequired={false}
                  doInputChange={handlePhoneNumberInputChange}
                  isAlreadyUsedError={showAlreadyUsedError}
                  columnSize={4}
                />
                <ModalInput
                  input={(phoneItem && phoneItem.number) || ""}
                  name="number"
                  maxLength={76}
                  isRequired={false}
                  doInputChange={handlePhoneNumberInputChange}
                  isAlreadyUsedError={collapseElementClass}
                  columnSize={4}
                />
                <FieldInputSelect
                  initialInput={
                    (phoneItem &&
                      phoneItem.phone_kind &&
                      phoneItem.phone_kind.id) ||
                    ""
                  }
                  items={phoneKinds}
                  columnWidth={4}
                  doChange={handleSelectInputChange}
                  name="phone_kinds"
                ></FieldInputSelect>
              </div>

              <div className="row">
                <ModalInputTextArea
                  input={(phoneItem && phoneItem.observations) || ""}
                  name={"observations"}
                  maxLength={512}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={12}
                  hasActivator={false}
                  activator={null}
                  doModalClick={null}
                  doInputCheck={handleInputObservations}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={handleCloseModal}
            className="btn btn-sm btn-default"
            data-dismiss="modal"
          >
            <i className="ace-icon fa fa-times"></i>
            {t("close")}
          </button>
          {phoneItem && phoneItem.id ? (
            <button
              onClick={handleSave}
              disabled={loading}
              type="button"
              className={
                activateActionButton()
                  ? "btn btn-sm btn-primary"
                  : "btn btn-sm btn-success disabled"
              }
            >
              <i
                className={
                  loading
                    ? "ace-icon fa fa-spinner fa-spin"
                    : "ace-icon fa fa-check"
                }
              ></i>
              {t("update")}
            </button>
          ) : (
            <button
              onClick={handleSave}
              type="button"
              className={
                activateActionButton()
                  ? "btn btn-sm btn-success"
                  : "btn btn-sm btn-primary disabled"
              }
              disabled={loading}
            >
              <i
                className={
                  loading
                    ? "ace-icon fa fa-spinner fa-spin"
                    : "ace-icon fa fa-plus"
                }
              ></i>
              {t("add_new")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TablePhonesModal;
