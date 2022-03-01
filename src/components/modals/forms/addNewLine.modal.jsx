import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CloseButton from "../../reusableComponents/CloseButton";
import FieldInput from "../../reusableComponents/fieldInput";
import FieldInputSelect from "../../reusableComponents/fieldInputSelect";
import useIsValid from "../../../hooks/useIsValid.hook";
import ErrorMessage from "../../reusableComponents/errormessage";
import useModal from "../../../hooks/useModal.hook";
import * as _ from "lodash";
import SearchBreakdownsModal from "../search/searchBreakdownsModal/searchBreakdownsModal";
import ModalInputTextArea from "../../reusableComponents/modalInputTextArea";
import tableServiceBudget from "../../../components/home/service/tableServiceBudget.service";

const ChangePasswordModal = ({
  closeModal,
  searchSelection,
  showModal,
  networkValue,
  item,
  errorMessage,
}) => {
  // Hooks

  const [subBreakdownKinds, setSubBreakdownKinds] = useState(false);
  const { handleIsValid, activateActionButton } = useIsValid();
  const [budgetDetailActions, setBudgetDetailActions] = useState(false);
  const [itemEdit, setItemEdit] = useState({});

  const [newServiceData, setNewServiceData] = useState({});

  // translation hook from reactI18next
  const { t } = useTranslation();

  // Flag that controls whether the modal is shown.
  const showHideClassName = showModal
    ? "rc-modal display-block modal-open modal"
    : "modal fade in display-none";
  // Constant that is used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";

  // sets loading icon
  const [loading, setLoading] = useState(false);
  // state that controls required input error icon
  const [
    showNewPasswordsNotMatchingError,
    setShowNewPasswordsNotMatchingError,
  ] = useState(collapseElementClass);
  const [showCapsLockWarning, setShowCapsLockWarning] = useState(
    collapseElementClass
  );
  const [showMaxLengthError, setShowMaxLengthError] = useState(
    collapseElementClass
  );
  const [showRequiredError, setShowRequiredError] = useState(
    collapseElementClass
  );
  const [errorMessageState, setErrorMessageState] = useState("");

  useEffect(() => {
    setLoading(false);
    setItemEdit((prev) => (prev = item));

    tableServiceBudget
      .getSubBreakdownKinds()
      .then((res) => setSubBreakdownKinds(res.json.sub_breakdown_kinds));
    tableServiceBudget
      .getBudgetDetailActons()
      .then((res) => setBudgetDetailActions(res.json.budget_detail_actions));

    // Adds event listener OnMount that closes the modal on Esc key press
    document.addEventListener("keydown", handleEscapePress);

    // On UnMount it removes the event listener
    return () => {
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [networkValue, errorMessage, showModal]);

  // Closes the modal on Esc key press
  const handleEscapePress = (e) => {
    if (e.keyCode === 27) {
      handleCloseModal();
    }
  };

  const handleInputsChange = (event, e) => {
    let value = null;
    let name = null;

    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    setItemEdit({
      ...itemEdit,
      [name]: value,
    });
  };
  const handleSelectSubBreakdownKind = (item) => {
    setItemEdit({
      ...itemEdit,
      sub_breakdown_kind_id: item.target.value.id,
    });
  };
  const handleSelectExpedientState = (item) => {
    setItemEdit({
      ...itemEdit,
      full_expedient_state_id: item.target.value,
    });
  };
  const handleSelectBudgetDetailAction = (item) => {
    setItemEdit({
      ...itemEdit,
      //budget_detail_action_id: item.target.value
      budget_detail_action_id: item.target.value.id,
    });
  };

  //Select an option with the Id

  const handleServiceBreakdownsSelectChange = (item) => {
    setItemEdit({
      ...itemEdit,
      breakdown_kind: item,
      breakdown_kind_id: item.id,
    });
  };

  // Update Db with line info

  const handleSave = () => {
    setLoading(false);
    searchSelection(itemEdit);
    handleCloseModal();

    //}
  };

  // Because the modal is shown or hidden using CSS, we set the values to default when closed
  const handleCloseModal = () => {
    setLoading(false);
    setItemEdit({});
    setShowRequiredError(collapseElementClass);
    setShowMaxLengthError(collapseElementClass);
    closeModal();
  };

  const handleSelectBreakdownsModal = (item) => {
    setItemEdit({
      ...itemEdit,
      //   breakdown_kind: item && item.name,
      breakdown_kind_name: item.name,
      breakdown_kind_id: item.id,

      //   breakdowns_id: item && item.id
    });
  };

  // Modal hooks

  const breakdownsModal = useModal(handleSelectBreakdownsModal);

  return (
    <div
      data-test-id="addEditNetworkModal"
      id="fillModal"
      className={showHideClassName}
      draggable-modal="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {breakdownsModal.showModal && (
            <SearchBreakdownsModal {...breakdownsModal} />
          )}

          <div className="modal-header">
            <CloseButton closeModal={handleCloseModal} />
            <h3 className="smaller lighter blue no-margin">
              <span data-test-id="addEditNetworkTitle">
                {item.id
                  ? t("capitalize", { text: t("update_line") })
                  : t("capitalize", { text: t("add_new_line") })}
              </span>
            </h3>
          </div>

          <div className="modal-body">
            <form name="forms.fillModalForm" noValidate>
              <div className="row">
                <div className="col-md-6 form-group has-feedback animate-input">
                  <FieldInput
                    input={
                      (itemEdit &&
                        itemEdit.breakdown_kind &&
                        itemEdit.breakdown_kind.name) ||
                      (itemEdit && itemEdit.breakdown_kind_name)
                    }
                    name="breakdown_kind"
                    maxLength={76}
                    isRequired={true}
                    isValid={handleIsValid}
                    columnSize={11}
                    hasActivator={true}
                    activator={true}
                    doModalClick={() => breakdownsModal.openModal()}
                    doInputCheck={handleServiceBreakdownsSelectChange}
                    withLabel={true}
                  ></FieldInput>

                  <FieldInputSelect
                    name={"sub_breakdown_kind"}
                    initialInput={
                      itemEdit &&
                      itemEdit.sub_breakdown_kind &&
                      itemEdit.sub_breakdown_kind.id
                    }
                    columnWidth={10}
                    items={subBreakdownKinds}
                    isRequired={false}
                    doChange={handleSelectSubBreakdownKind}
                    withLabel={true}
                  />

                  <FieldInputSelect
                    name={"budget_detail_action"}
                    initialInput={
                      itemEdit &&
                      itemEdit.budget_detail_action &&
                      itemEdit.budget_detail_action.id
                    }
                    columnWidth={10}
                    items={budgetDetailActions}
                    isRequired={false}
                    doChange={handleSelectBudgetDetailAction}
                    withLabel={true}
                  />
                </div>

                <div className="col-md-6 form-group has-feedback animate-input">
                  <FieldInput
                    input={(itemEdit && itemEdit.workshop_unity_number) || ""}
                    name={"workshop_unity_number"}
                    isRequired={false}
                    isValid={handleIsValid}
                    columnSize={12}
                    doInputCheck={handleInputsChange}
                    withLabel={true}
                  />

                  <FieldInput
                    input={(itemEdit && itemEdit.workshop_cost) || ""}
                    name={"workshop_cost"}
                    isRequired={false}
                    isValid={handleIsValid}
                    columnSize={12}
                    doInputCheck={handleInputsChange}
                    withLabel={true}
                  />
                  <label className="control-label show-hide">{t("")}</label>
                  <FieldInput
                    input={(itemEdit && itemEdit.workshop_discount) || ""}
                    name={"workshop_discount"}
                    isRequired={false}
                    isValid={handleIsValid}
                    columnSize={12}
                    doInputCheck={handleInputsChange}
                    withLabel={true}
                  />
                  <ModalInputTextArea
                    input={
                      (itemEdit && itemEdit.description) ||
                      (newServiceData && newServiceData.description)
                    }
                    name={"description"}
                    maxLength={76}
                    isRequired={true}
                    isValid={handleIsValid}
                    columnSize={12}
                    hasActivator={false}
                    activator={null}
                    doModalClick={null}
                    doInputCheck={handleInputsChange}
                  />
                </div>
              </div>
            </form>
            <p
              className={`help-block form-error ${showNewPasswordsNotMatchingError}`}
            >
              <i className="fas fa-exclamation-triangle"></i>{" "}
              {t("field_invalid_pass_repeat")}
            </p>
            <p className={`help-block form-error ${showCapsLockWarning}`}>
              <i className="fas fa-exclamation-triangle"></i> {t("capsLocked")}
            </p>
            <ErrorMessage message={errorMessageState} />
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
            {item.id ? (
              <button
                data-test-id="addEditNetworkButton"
                onClick={handleSave}
                type="button"
                className={
                  activateActionButton()
                    ? "btn btn-sm btn-primary"
                    : "btn btn-sm btn-primary disabled"
                }
                disabled={loading}
              >
                <i
                  className={
                    loading
                      ? "ace-icon fa fa-spinner fa-spin"
                      : "ace-icon fa fa-check"
                  }
                ></i>
                {t("update_line")}
              </button>
            ) : (
              <button
                data-test-id="addEditNetworkButton"
                onClick={handleSave}
                type="button"
                className={
                  activateActionButton()
                    ? "btn btn-sm btn-success"
                    : "btn btn-sm btn-success disabled"
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
                {t("add_new_line")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
