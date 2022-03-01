import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import FieldInput from "../fieldInput";
import useIsValid from "../../../hooks/useIsValid.hook";
import _ from "lodash";

const modalActive = "modal is-active";

// type="text"
// type="password"
// type="email"
// type="tel"

const ModalInOut = ({
  isShowingModalInOut,
  hide,
  modalTitle,
  isSaveData,
  onClickSave,
  inputInName,
  inputInValue,
  inputOutName,
}) => {
  const [inputOutValue, setInputOutValue] = useState();

  const handleInputOutChange = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    setInputOutValue(value);
    return inputOutValue;
  };

  const handleSaveInputModal = () => {
    // console.log("ModalOutInput Value >>>>>> " + inputOutValue);
  };

  const testOnClickSave = () => {
    handleSaveInputModal();
  };

  const { handleIsValid } = useIsValid();

  return (
    <>
      {isShowingModalInOut
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowingModalInOut && modalActive}>
                <div className="modal-background" onClick={hide}></div>
                <div className="modal-card px-2">
                  <header className="modal-card-head">
                    <p className="modal-card-title is-size-6 has-text-weight-semibold">
                      {modalTitle}
                    </p>
                    <div className="closeModalButton">
                      <button
                        className="delete"
                        onClick={hide}
                        aria-label="close"
                      ></button>
                    </div>
                  </header>
                  <section className="modal-card-body">
                    <div className="minW250 is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-space-around">
                      <FieldInput
                        input={inputInValue}
                        name={inputInName}
                        maxLength={76}
                        isRequired={false}
                        isValid={handleIsValid}
                        columnSize={6}
                        withLabel={false}
                        hasActivator={false}
                        activator={false}
                        isDisabled
                        isNotAlone={true}
                      />
                      <FieldInput
                        input={inputOutValue}
                        name={inputOutName}
                        maxLength={76}
                        isRequired={false}
                        isValid={handleIsValid}
                        columnSize={6}
                        doInputCheck={handleInputOutChange}
                        withLabel={false}
                        hasActivator={false}
                        activator={false}
                        isNotAlone={true}
                      />
                    </div>
                  </section>
                  {isSaveData === true && (
                    <footer className="modal-card-foot">
                      <button
                        className="button is-success is-small"
                        onClick={onClickSave || testOnClickSave}
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

export default ModalInOut;
