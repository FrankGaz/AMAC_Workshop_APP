import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FieldInputMask from "../../reusableComponents/fieldInputMask";
import logic from "../../../logic/logic";
import useIsValid from "../../../hooks/useIsValid.hook";
import _ from "lodash";
import passwordChangeService from "./password_change.service";
import ConfirmActionMessage from "../../reusableComponents/confirmActionMessage";
import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";

const PasswordChangePopUp = props => {
    // translation API from reactI18next
    const { t } = useTranslation();
  
    // Flag that controls whether the modal is shown.
    const showHideClassName = true
      ? //   const showHideClassName = showModal
        'rc-modal display-block modal-open modal in'
      : 'modal fade in display-none';
    // Constant that is used to declare the class that hides error icons in the input
    const collapseElementClass = 'collapse';
    const [loading, setLoading] = useState(false);
  
    // state that controls required input error icon
    const [showRequiredError, setShowRequiredError] = useState(
      collapseElementClass
    );
    const [showMaxLengthError, setShowMaxLengthError] = useState(
      collapseElementClass
    );
    const [showAlreadyUsedError, setShowAlreadyUsedError] = useState(
      collapseElementClass
    );
    const [isValid, setIsValid] = useState([]);
  
    // Component states
    const [passwordFieldOne, setPasswordFieldOne] = useState('');
    const [passwordFieldTwo, setPasswordFieldTwo] = useState('');
    const [passwordFieldThree, setPasswordFieldThree] = useState('');
    const [passwordsAreEqual, setPasswordsAreEqual] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState(false);
  
    const [sameAsOld, setSameAsOld] = useState(false);
    const [sameAsOldMessage, setSameAsOldMessage] = useState(false);
  
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userName, setUserName] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [changeShowModal, setChangeShowModal] = useState(false);
  
    // cleans backend error messages
    const errorString = from =>
      from
        .split('[')
        .join(' ')
        .split(']')
        .join(', ')
        .split('}')
        .join(' ')
        .split('"')
        .join(' ');
  
    useEffect(() => {
      try {
        const res = JSON.parse(sessionStorage.getItem('userData'));

        const _need_change_password = (res && res.need_change_password) || false;
        if (res && res.person && res.person.id) {
            setUserName(res.person.first_name);
            setUserData(res);
            setUserId(res.id);
          }

        if (changeShowModal) {
          setShowModal(false);
        } else {
          if (_need_change_password) {
            setShowModal(true);
            if (res && res.person && res.person.id) {
              setUserName(res.person.first_name);
              setUserData(res);
              setUserId(res.id);
            }
          }
        }
      } catch (e) {
        console.log('error :>> ', e);
      }
    }, [changeShowModal]);
  
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
      if (name === 'new_password' && value.length > 7) {
        setPasswordFieldOne(value);
        checkPasswordFieldsAreEqual();
      }
      if (name === 'new_password_confirmation' && value.length > 7) {
        setPasswordFieldTwo(value);
        checkPasswordFieldsAreEqual();
      }
      if (name === 'current_password' && value.length > 7) {
        setPasswordFieldThree(value);
      }
    };
  
    const checkPasswordFieldsAreEqual = () => {
      if (
        passwordFieldOne &&
        passwordFieldOne !== '' &&
        passwordFieldOne.length > 6 &&
        passwordFieldTwo &&
        passwordFieldTwo !== '' &&
        passwordFieldTwo.length > 6 &&
        passwordFieldOne === passwordFieldTwo
      ) {
        setPasswordsAreEqual(true);
      }
  
      if (
        passwordFieldOne &&
        passwordFieldOne !== '' &&
        passwordFieldOne.length > 7 &&
        passwordFieldTwo &&
        passwordFieldTwo !== '' &&
        passwordFieldTwo.length > 7 &&
        passwordFieldOne !== passwordFieldTwo
      ) {
        setPasswordsAreEqual(false);
      }
    };
  
    // automatic password check
    useEffect(() => {
      if (passwordFieldOne === passwordFieldTwo) {
        setPasswordsAreEqual(true);
        setPasswordMessage(false);
      }
      if (passwordFieldOne !== passwordFieldTwo) {
        setPasswordsAreEqual(false);
        setPasswordMessage(true);
      }
      // check if old/new passwords are equal
      if (passwordFieldThree !== "" && passwordFieldOne === passwordFieldThree) {
        setSameAsOld(true)
        setSameAsOldMessage(true)
      } else {
        setSameAsOld(false)
        setSameAsOldMessage(false)
      }
    }, [passwordFieldOne, passwordFieldTwo, passwordFieldThree]);
  
    const passwordUpdateAction = () => {
      const dataToSend = {
        password: passwordFieldOne || null,
        password_confirmation: passwordFieldTwo || null,
        current_password: passwordFieldThree || null
      };
  
      passwordChangeService
        .updatePassword(dataToSend)
        .then(res => {
          setChangeShowModal(true);
          setShowModal(false);
          handleCloseModal();
        })
        .then(() => {
            logic.getWorkshopId(userId).then((res) => {
                if (res.user && res.user.workshop) {
                    sessionStorage.setItem(
                      "workshopId",
                      JSON.stringify(res.user.workshop.id)
                    );
                }
            })
        })
        .catch(err => {
          action.sayMessage('danger', errorString(JSON.stringify(err)));
        });
    };
  
    /*
      Handles modal save/update actions
    */
    const handleSave = () => {
      if (passwordsAreEqual === true) {
        setLoading(true);
        passwordUpdateAction();
      }
    };
  
    // Because the modal is shown or hidden using CSS, we set the values to default when closed
    const handleCloseModal = () => {
      setLoading(false);
      setShowRequiredError(collapseElementClass);
      setShowMaxLengthError(collapseElementClass);
      setShowAlreadyUsedError(collapseElementClass);
      //closeModal();
      setShowModal(false);
    };
  
    const handleLogout = () => {
        logic.logout();
        props && props.history && props.history.push("/");
    };
  
    // TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
    //   at Function.o (<anonymous>:1:83)
  
    const { handleIsValid, activateActionButton } = useIsValid();
    const action = useConfirmActionMessage();
  
    return (
      <React.Fragment>
        {showModal && (
          <div
            id="fillModal"
            className={showHideClassName}
            draggable-modal="true"
          >
            <div
              className="modal-dialog"
              style={{ position: 'relative', top: '30%' }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="smaller lighter blue no-margin">
                    <span> {t('password_change_popup_title')} </span>
                  </h3>
                </div>
  
                {/* Handles the inputs of the modal.*/}
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12" style={{ padding: '2em' }}>
                      <p style={{ fontWeight: 'normal' }}>{`${t(
                        'hello'
                      )} ${userName}, ${t(
                        'password_change_popup_message'
                      )}  `}</p>
                    </div>
                  </div>
                  <div className="row" style={{ paddingBottom: '2em' }}>
                    <div className="col-md-6">
                      <FieldInputMask
                        input={(passwordFieldThree && passwordFieldThree) || ''}
                        name={'current_password'}
                        maxLength={76}
                        isDisabled={false}
                        isRequired={true}
                        isValid={handleIsValid}
                        columnSize={12}
                        hasActivator={true}
                        activator={true}
                        doInputCheck={handleInputChange}
                        // doInputBlurCheck={arePasswordsEqual}
                        withLabel={true}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <FieldInputMask
                        input={(passwordFieldOne && passwordFieldOne) || ''}
                        name={'new_password'}
                        maxLength={76}
                        isDisabled={false}
                        isRequired={true}
                        isValid={handleIsValid}
                        columnSize={12}
                        hasActivator={true}
                        activator={true}
                        doInputCheck={handleInputChange}
                        // doInputBlurCheck={arePasswordsEqual}
                        withLabel={true}
                      />
                      {passwordFieldOne.length > 2 &&
                      passwordFieldOne.length <= 7 ? (
                        <p
                          style={{
                            color: 'red',
                            marginTop: '1em'
                          }}
                        >
                          {t('password_size_message')}
                        </p>
                      ) : null}
                      {sameAsOldMessage === true ? (
                        <p
                          style={{
                            color: 'red',
                            marginTop: '1em',
                            paddingLeft: '2em'
                          }}
                        >
                          {t('password_same_as_old')}
                        </p>
                      ) : null}
                    </div>
                    <div className="col-md-6">
                      {passwordFieldOne &&
                      passwordFieldOne !== null &&
                      passwordFieldOne.length > 7 ? (
                        <FieldInputMask
                          input={(passwordFieldTwo && passwordFieldTwo) || ''}
                          name={'new_password_confirmation'}
                          maxLength={76}
                          isDisabled={false}
                          isRequired={true}
                          isValid={handleIsValid}
                          columnSize={12}
                          hasActivator={true}
                          activator={true}
                          doInputCheck={handleInputChange}
                          withLabel={true}
                        />
                      ) : (
                        <div
                          className="side-paddings"
                          style={{ paddingTop: '9px' }}
                        >
                          <input
                            type="text"
                            name="new_password_confirmation"
                            id="new_password_confirmation"
                            className="form-control"
                            placeholder={t('new_password_confirmation')}
                            readOnly
                          />
                        </div>
                      )}
                      {passwordMessage === true && passwordFieldTwo.length > 4 ? (
                        <p
                          style={{
                            color: 'red',
                            marginTop: '1em',
                            paddingLeft: '2em'
                          }}
                        >
                          {t('field_invalid_pass_repeat')}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-sm btn-default"
                  data-dismiss="modal"
                >
                  <i className="ace-icon fa fa-times"></i>
                  {t('logout')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !activateActionButton() || sameAsOldMessage}
                  type="button"
                  className={
                    passwordsAreEqual &&
                    passwordsAreEqual === true &&
                    passwordsAreEqual !== false
                      ? 'btn btn-sm btn-primary'
                      : 'btn btn-sm btn-primary disabled'
                  }
                >
                  <i
                    className={
                      loading
                        ? 'ace-icon fa fa-spinner fa-spin'
                        : 'ace-icon fa fa-check'
                    }
                  ></i>
                  {t('confirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  };

  export default PasswordChangePopUp;
  