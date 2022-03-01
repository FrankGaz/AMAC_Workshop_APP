import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FieldInput from "./reusableComponents/fieldInput";
import FieldInputPassword from "./reusableComponents/fieldInputPassword";
import useIsValid from "../hooks/useIsValid.hook";
import ErrorMessage from "./reusableComponents/errormessage";
import logic from "../logic/logic";
import { useStateValue } from "../data/context/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";

const Login = (props) => {
  const [{ error }, dispatch] = useStateValue();

  const { t } = useTranslation();

  // Constant that is used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";
  const showElementClass = "";

  const [loading, setLoading] = useState();
  const [userData, setUserData] = useState({});
  const [passwordForLogin, setPasswordForLogin] = useState("");
  const [emailForLogin, setEmailForLogin] = useState("");
  const [showCapsLockWarning, setShowCapsLockWarning] =
    useState(collapseElementClass);
  // Handles the input change on the passwords
  // const handleInputChange = (value, event) => {
  //   const inputValue = value;
  //   const name = event.target.name;
  //   setUserData((prevState) => {
  //     return {
  //       ...prevState,
  //       [name]: inputValue,
  //     };
  //   });
  // };
  const handleSubmitClick = async (event) => {
    event.preventDefault();
    await setLoading(true);
    if (!activateActionButton()) {
      return setLoading(false);
    }
    await onLoginClick(userData);
  };

  const onLoginClick = () => {
    const loginEmail = emailForLogin;
    const loginPassword = passwordForLogin;

    logic
      .login(loginEmail, loginPassword)
      .then((res) => {
        dispatch({
          origin: "error",
          type: "clearError",
        });
        setLoading(false);
        goToInterventions();
      })
      .then(() => {
        props.history.push("/home/services_request");
        // <PrivateRoute
        //       exact
        //       path="/home/services_request"
        //       component={ServicesRequest}
        //     />
      })
      .catch((err) => {
        dispatch({
          origin: "error",
          type: "setError",
          errorMessage: err.message,
        });
        setLoading(false);
      });
  };

  const goToInterventions = () => {
    props.history.push("/home/services_request");
  };

  const handleKeyPress = (event) => {
    const capsLockCheck = event.getModifierState("CapsLock");
    if (capsLockCheck) {
      setShowCapsLockWarning(showElementClass);
    } else {
      setShowCapsLockWarning(collapseElementClass);
    }
  };

  const handleInputLogin = (event, e) => {
    let value = null;
    let name = null;

    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    /*
    Handles the state change
    */

    if (name === "email") setEmailForLogin(value);

    if (name === "password") setPasswordForLogin(value);
  };

  const { handleIsValid, activateActionButton } = useIsValid();
  return (
    <div>
      <div>
        <div>
          <div className="pt-6 px-3 is-flex is-justify-content-center">
            <img
              src="images/nuuk-mobility-solutions-logo-b.png"
              // src="images/afm_amac_fleet_manager_b.png"
              alt="NUUK - Mobility Solutions"
              // alt="AFM Logo"
              title="NUUK - Mobility Solutions"
              // title="AFM Logo"
            />
          </div>
          <div></div>
          <div>
            <div>
              <div className="mt-6 pt-2 is-flex is-flex-direction-column is-align-items-center">
                <section className="box mt-6 mx-2 maxW450 minW300">
                  {/* <h4>
                    <i></i>
                    {t("login_title")}
                  </h4> */}
                  <div></div>
                  <form onSubmit={(e) => handleSubmitClick(e)} noValidate>
                    <div className="mt-4">
                      <div>
                        <FieldInput
                          name="email"
                          label="user"
                          maxLength={76}
                          isRequired={true}
                          isValid={handleIsValid}
                          columnSize={6}
                          hasActivator={false}
                          activator={null}
                          doInputCheck={handleInputLogin}
                        />
                      </div>
                      <div className="mt-3">
                        <FieldInputPassword
                          name={"password"}
                          maxLength={76}
                          isRequired={true}
                          isValid={handleIsValid}
                          columnSize={12}
                          hasActivator={false}
                          doInputCheck={handleInputLogin}
                          keyPress={handleKeyPress}
                          autoComplete={"current-password"}
                        />
                      </div>
                    </div>
                    <div className="is-full is-flex is-justify-content-center">
                      <button
                        type="submit"
                        onClick={handleSubmitClick}
                        data-test-id="login-button"
                        disabled={loading}
                        className="button mt-5 buttonLogOut" 
                      >
                        <span>{t("login_act")}</span>
                        {loading ? (
                          <span>
                            <FontAwesomeIcon icon="spinner" spin />
                          </span>
                        ) : null}
                      </button>
                    </div>
                    <div></div>

                    <div>
                      <p
                        className={`help-block form-error ${showCapsLockWarning}`}
                      >
                        <i className="fas fa-exclamation-triangle"></i>{" "}
                        {t("capsLocked")}
                      </p>
                      <ErrorMessage message={error} />
                    </div>
                  </form>
                  <div></div>
                </section>
                <div className="is-flex is-flex-direction-column is-align-items-center">
                  <div>
                    <a
                      className="textGrey"
                      href="tel:+34902199177"
                      target="blank"
                    >
                      Tel. 902 199 177
                    </a>
                  </div>
                  <div className="mt-3">
                    <a
                      className="textGrey"
                      href="https://www.amacautomotive.com"
                      target="blank"
                    >
                      <i className="fa fa-copyright"></i>&nbsp;AMAC Automotive Services
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
