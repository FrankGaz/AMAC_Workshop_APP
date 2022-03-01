//OLD COMPONENT, NOT USED

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FieldInput from "../../reusableComponents/fieldInput";
import logic from "../../../logic/logic";
import useIsValid from "../../../hooks/useIsValid.hook";
import _ from "lodash";
import securityService from "./security.service";
import ConfirmActionMessage from "../../reusableComponents/confirmActionMessage";
import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";

const SecurityForm = () => {
  // translation API from reactI18next
  const { t } = useTranslation();

  const action = useConfirmActionMessage();

  // state values
  const [newServiceData, setNewServiceData] = useState({});

  const handleSearchInputChange = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    setNewServiceData({
      ...newServiceData,
      [name]: value,
    });
  };

  const handleSend = () => {

    const user = JSON.parse(logic._userId)

    if((newServiceData.user === user.email) && (newServiceData.password === logic._currentPassword) && newServiceData.new_password) {
      securityService
      .updatePassword(newServiceData)
      .then((data) => {
        action.sayMessage("success", "change_pswd_own_user_success");
      })
      .catch((err) => {
        action.sayMessage("danger", err.message);
      });
    }else{
      action.sayMessage("danger", "Email o contraseña inválidos");
    }
    
  }

  const { handleIsValid } = useIsValid();

  return (
    <div>
      <div className="col-md-12">
      <ConfirmActionMessage {...action} />
        <div className="row">
          <div
            className="col-md-12"
            style={{ paddingTop: "1em", paddingBottom: "1em" }}
          >
            <h3 className="widget-title center smaller lighter blue big-title-margins">
              {t("change_password")}
            </h3>
          </div>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div data-test-id="registration">
                <FieldInput
                  input={newServiceData.user || ""}
                  name={"user"}
                  maxLength={76}
                  isRequired={true}
                  isValid={handleIsValid}
                  columnSize={12}
                  hasActivator={false}
                  activator={false}
                  doInputCheck={handleSearchInputChange}
                />
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
          <div className="row" style={{ paddingTop: "1em" }}>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div data-test-id="registration">
                <FieldInput
                  input={newServiceData.password || ""}
                  name={"password"}
                  maxLength={76}
                  isRequired={true}
                  isValid={handleIsValid}
                  columnSize={12}
                  hasActivator={false}
                  activator={false}
                  doInputCheck={handleSearchInputChange}
                />
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
          <div className="row" style={{ paddingTop: "1em" }}>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div data-test-id="registration">
                <FieldInput
                  input={newServiceData.new_password || ""}
                  name={"new_password"}
                  maxLength={76}
                  isRequired={true}
                  isValid={handleIsValid}
                  columnSize={12}
                  hasActivator={false}
                  activator={false}
                  doInputCheck={handleSearchInputChange}
                />
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
          <div className="row" style={{ paddingTop: "1em" }}>
            <div className="col-md-4"></div>
            <div className="col-md-4">
               <div>
              <button
                  type="button"
                  onClick={(e) => handleSend(e)}
                  className="btn btn-purple btn-sm block full"
                  alt={t("send")}
                  title={t("send")}
                >{t("send")}</button>
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityForm;

