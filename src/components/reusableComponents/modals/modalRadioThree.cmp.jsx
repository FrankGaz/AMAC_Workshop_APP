import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

import ModalInputRadioThree from "../modalInputRadioThree";
import _ from "lodash";

const modalActive = "modal is-active";


const ModalRadioThree = ({
  isShowingModalRadioThree,
  hide,
  modalTitle,
  isSaveData,
  onClickSave,
  value1,
  value2,
  value3,
  doChange,
  previousSelection,
}) => {
    const { t } = useTranslation();
    const [selectedCheck, setSelectedCheck] = useState("");
    const[previousRadioSelected, setPreviousRadioSelected]=useState(previousSelection);
    

  useEffect(() => {
    previousRadioSelected && setSelectedCheck(previousRadioSelected);
  }, [previousRadioSelected]);

  const handleInputChange = (event) => {
    setSelectedCheck(event.target.value);
    doChange({
      target: {
        value: event.target.value,
      },
    });
  };

  const handleSaveInputModal = () => {
    // console.log("ModalInput Value >>>>>> " + selectedCheck);
  };

  const testOnClickSave = () => {
    handleSaveInputModal();
  };



  return (
    <>
      {isShowingModalRadioThree
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowingModalRadioThree && modalActive}>
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
                    <ModalInputRadioThree
                        value1={value1}
                        value2={value2}
                        value3={value3}
                        doChange={doChange}
                        previousSelection={previousSelection}
                    />
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

export default ModalRadioThree ;
