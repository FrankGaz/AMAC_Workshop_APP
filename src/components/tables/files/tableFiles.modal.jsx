import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import FieldInput from "../../reusableComponents/fieldInput";
import useIsValid from "../../../hooks/useIsValid.hook";
import CloseButton from "../../reusableComponents/CloseButton";
import FieldInputDate from "../../reusableComponents/fieldInputDate";
import FieldInputSelect from "../../reusableComponents/fieldInputSelect";
import defaults from "../../reusableComponents/defaults";
import FieldInputFile from "../../reusableComponents/fieldInputFile";

const TableDocumentsModal = ({
  item,
  fieldsList,
  closeModal,
  showModal,
  selectionModal,
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
  const [hasCategory, setHasCategory] = useState(false);

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
  const [fileItem, setFileItem] = useState({});

  useEffect(() => {
    // set initial values for data
    // has category?
    if (fieldsList) {
      setHasCategory(fieldsList.includes("category"));
    }
    //
    setLoading(false);
    if (item) {
      setFileItem((prev) => (prev = item));
    }

    document.addEventListener("keydown", handleEscapePress);
    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, fieldsList]);

  // Closes the modal on Esc key press
  const handleEscapePress = (e) => {
    if (e.keyCode === 27) {
      return handleCloseModal();
    }
  };

  /*
      Handles modal save/update actions
    */
  const handleSave = () => {
    selectionModal(fileItem);
    handleCloseModal();
  };

  // Because the modal is shown or hidden using CSS, we set the values to default when closed
  const handleCloseModal = () => {
    setShowRequiredError(collapseElementClass);
    setShowMaxLengthError(collapseElementClass);
    setShowAlreadyUsedError(collapseElementClass);
    setFileItem({});
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

    // Handles the state change
    if (name === "file") {
      setFileItem({
        ...fileItem,
        [name]: e.target.files[0],
      });
    } else {
      setFileItem({
        ...fileItem,
        [name]: value,
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
              <span> {t("add") + " " + t("file")} </span>
            </h3>
          </div>

          {/* Handles the inputs of the modal.*/}
          <div className="modal-body">
            <form encType="multipart/form-data">
              <div className="row side-margins">
                <div className="col-md-4 form-group has-feedback">
                  <FieldInput
                    input={(fileItem && fileItem.name) || ""}
                    name={"name"}
                    maxLength={150}
                    isRequired={true}
                    isValid={handleIsValid}
                    columnSize={12}
                    hasActivator={false}
                    activator={null}
                    doModalClick={null}
                    doInputCheck={handleInputChange}
                  />
                </div>

                <div className="col-md-4 form-group has-feedback">
                  <div className="row">
                    <div className="col-md-12" style={{ marginTop: "14px" }}>
                      <FieldInputDate
                        input={(fileItem && fileItem.date_file) || ""}
                        name={"date_file"}
                        isRequired={true}
                        isValid={handleIsValid}
                        columnSize={12}
                        doInputCheck={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {hasCategory && (
                <div className="col-md-4 form-group has-feedback">
                  <FieldInputSelect
                    name={"category"}
                    items={defaults.minutes}
                    columnWidth={12}
                    withLabel={true}
                    initialInput={null}
                    isRequired={true}
                    doChange={handleInputChange}
                  />
                </div>
              )}

              <div className="row side-margins">
                <div className="col-md-4 form-group has-feedback ">
                  <FieldInputFile
                    input={(fileItem && fileItem.file) || ""}
                    name="file"
                    isRequired={true}
                    isValid={handleIsValid}
                    doInputCheck={handleInputChange}
                  />
                </div>
              </div>
            </form>
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
            {fileItem && fileItem.id ? (
              <button
                onClick={handleSave}
                disabled={!activateActionButton() || loading}
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
                disabled={!activateActionButton() || loading}
                type="button"
                className={
                  activateActionButton()
                    ? "btn btn-sm btn-success"
                    : "btn btn-sm btn-primary disabled"
                }
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
    </div>
  );
};

export default TableDocumentsModal;
