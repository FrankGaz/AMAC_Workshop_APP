import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ModalInput from "../../reusableComponents/modalInput";
import FieldInput from "../../reusableComponents/fieldInput";
import ModalInputTextArea from "../../reusableComponents/modalInputTextArea";
import CloseButton from "../../reusableComponents/CloseButton";
import useIsValid from "../../../hooks/useIsValid.hook";
import _ from "lodash";

const TableEmailsModal = ({
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
  // eslint-disable-next-line no-unused-vars
  const [showAlreadyUsedError, setShowAlreadyUsedError] = useState(
    collapseElementClass
  );

  // Component state
  // Inicident selected for adding or updating
  const [emailItem, setEmailItem] = useState({});

  useEffect(() => {
    // set initial values for data
    setLoading(false);
    setEmailItem(item);

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

  const handleEmailNumberInputChange = ({ name, input }) => {
    // Handles the state change
    setEmailItem({
      ...emailItem,
      [name]: input,
    });
  };

  /*
      Handles modal save/update actions
    */
  const handleSave = () => {
    // setLoading(true)
    // if (!showMaxLengthError || !showRequiredError) {
    setLoading(false);
    searchSelection(emailItem);
    handleCloseModal();
    // return
    // }
  };

  // Because the modal is shown or hidden using CSS, we set the values to default when closed
  const handleCloseModal = () => {
    setShowRequiredError(collapseElementClass);
    setShowMaxLengthError(collapseElementClass);
    setShowAlreadyUsedError(collapseElementClass);
    setLoading(false);
    setEmailItem({});
    return closeModal();
  };

  const handleInputChange = (event, e) => {
    let value = null;
    let name = null;

    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    if (name === "observations") {
      setEmailItem({
        ...emailItem,
        observations: value,
      });
    }

    if (name === "email") {
      setEmailItem({
        ...emailItem,
        email: value,
      });
    }
  };

  const { handleIsValid, activateActionButton } = useIsValid();

  return (
    <div id="fillModal" className={showHideClassName} draggable-modal="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <CloseButton closeModal={handleCloseModal} />
            <h3 className="smaller lighter blue no-margin">
              <span> {t("add") + " " + t("email")} </span>
            </h3>
          </div>

          {/* Handles the inputs of the modal.*/}
          <div className="modal-body">
            <div>
              <div className="row">
                {/* <ModalInput
                  input={(emailItem && emailItem.email) || ""}
                  name="email"
                  maxLength={76}
                  isRequired={true}
                  doInputChange={handleInputChange}
                  isAlreadyUsedError={collapseElementClass}
                  columnSize={6}
                /> */}
                <FieldInput
                  input={(emailItem && emailItem.email) || ""}
                  name="email"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  doInputCheck={handleInputChange}
                  withLabel={true}
                />
              </div>

              <div className="row">
                {/* <ModalInputTextArea
                    input={emailItem && emailItem.observations}
                    name="observations"
                    isValid={handleIsValid}
                    maxLength={200}
                    isRequired={false}
                    doInputChange={handleEmailNumberInputChange}
                    columnSize={12}
                  /> */}
                <ModalInputTextArea
                  input={(emailItem && emailItem.observations) || ""}
                  name={"observations"}
                  maxLength={512}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={12}
                  hasActivator={false}
                  activator={null}
                  doModalClick={null}
                  doInputCheck={handleInputChange}
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
          {emailItem && emailItem.id ? (
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

/* const OptionSelect = ({
    options,
    selectedOption,
    optionTypeName,
    initialValue
  }) => {
    // translation API from reactI18next
    const { t } = useTranslation();
  
    const handleOptionSelectChange = event => {
      const option = event.target.value;
      selectedOption(option);
    };
  
    return (
      <div className="col-md-4 form-group has-feedback animate-input">
        <label className="control-label show-hide" htmlFor={optionTypeName}>
          {t(optionTypeName)}
        </label>
        <span className="block input-icon input-icon-right">
          <select
            onChange={handleOptionSelectChange}
            name={optionTypeName}
            id={optionTypeName}
            className="form-control"
            value={initialValue}
          >
            <option>{t("choose")} </option>
            {options
              ? options.map((option, index) => {
                  return (
                    <option key={index} value={option.id}>
                      {" "}
                      {t(option && option.name)}{" "}
                    </option>
                  );
                })
              : null}
          </select>
        </span>
      </div>
    );
  }; */
export default TableEmailsModal;
