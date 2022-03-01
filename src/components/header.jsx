import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useStateValue } from "../data/context/store";
import useModal from "../hooks/useModal.hook";
import ChangePasswordModal from "./modals/forms/changePassword.modal";
import logic from "../logic/logic";
import ConfirmActionMessage from "../components/reusableComponents/confirmActionMessage";
import useConfirmActionMessage from "../hooks/useConfirmActionMessage";
import menuItems from "../data/sidebar";
import ListItem from "./sidebar/listItem";

const Header = props => {
  const { t, i18n } = useTranslation();

  const [{ user }, dispatch] = useStateValue();
  const [menuState, setMenuState] = useState({});
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const toggleClick = () => {
    setToggleSidebar(!toggleSidebar);
  };

  useEffect(() => {
    if (logic && logic.sessionId) {
      dispatch({
        origin: "user",
        type: "setUser",
        setUser: logic.sessionId
      });
    }

    if (!logic.loggedIn) {
      props && props.history && props.history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, logic.loggedIn]);

  const showChangePasswordModal = event => {
    event.preventDefault();
    changePasswordProps.openModal();
  };

  const handleChangeLanguageClick = (language, event) => {
    event.preventDefault();
    i18n.changeLanguage(language);
  };

  const changePasswordProps = useModal();

  const handleChangePasswordResult = value => {
    if (value.status === "error") {
      action.sayMessage("danger", t("change_pswd_own_user_error"));
    } else {
      action.sayMessage("success", t("change_pswd_own_user_success"));
    }
  };

  const onLogoutClick = () => {
    logic.logout();
    props && props.history && props.history.push("/");
  };

  const action = useConfirmActionMessage();

  const handleClick = (event, item, url) => {
    event.preventDefault();
    setMenuState(prevState => {
      return {
        ...prevState,
        [item]: !prevState[item]
      };
    });
    props.history.push(url);
  };

  const showMenuItems = children => {
    return children.map(subOption => {
      const { name, url, icon, children } = subOption;
      if (!children) {
        return (
          <li key={name}>
            <ListItem
              onAnchorClick={e => handleClick(e, name, url)}
              url={url}
              fontAwesomeFaIcon={icon}
              name={t(name)}
            />
          </li>
        );
      }
      return (
        <li key={name}>
          <ListItem
            onAnchorClick={e => handleClick(e, name, url)}
            url={url}
            fontAwesomeFaIcon={icon}
            hasSubmenu={true}
            name={t(name)}
          />
          <ul
            id={menuState[name] === true ? "display-block" : ""}
            className="submenu"
          >
            {showMenuItems(children)}
          </ul>
        </li>
      );
    });
  };

  return (
    <div id="navbar" className="navbar navbar-default">
      <ConfirmActionMessage {...action} />
      {changePasswordProps.showModal && (
        <ChangePasswordModal
          {...changePasswordProps}
          action={handleChangePasswordResult}
        />
      )}
      <div className="navbar-container" id="navbar-container">
        <div className="navbar-logo navbar-header pull-left">
          <button
            type="button"
            className="navbar-toggle menu-toggler pull-left"
            id="menu-toggler"
            onClick={toggleClick}
          >
            <span className="icon-bar"></span>

            <span className="icon-bar"></span>

            <span className="icon-bar"></span>
          </button>
          {toggleSidebar && (
            <div id="sidebar" className="sidebar new2">
              <ul id="sidebar-list" className="nav nav-list">
                {showMenuItems(menuItems.data)}
              </ul>

              <div
                className="sidebar-toggle sidebar-collapse"
                id="sidebar-collapse"
                onClick={toggleClick}
              >
                <i
                  className="ace-icon fa fa-angle-double-left"
                  data-icon1="ace-icon fa fa-angle-double-left"
                  data-icon2="ace-icon fa fa-angle-double-right"
                ></i>
              </div>
            </div>
          )}

          {/* <!-- #section:basics/navbar.layout.brand --> */}
          <a href="#/" className="navbar-brand">
            <img
              className="img-responsive float-left"
              // src="images/afm_amac_fleet_manager_n.png"
              src="../images/nuuk-mobility-solutions-logo-navbar.png"
              alt="AFM - Amac Fleet Management"
              title="AFM - Amac Fleet Management"
            />
          </a>
        </div>

        {/* <!-- #section:basics/navbar.dropdown --> */}
        <div
          className="navbar-buttons navbar-header pull-right"
          role="navigation"
        >
          <img
            className="detail-header img-responsive pull-left"
            alt=""
            src="images/detail_header.png"
          />

          {/* <!-- User menu dropdown --> */}
          <ul className="nav ace-nav pull-right">
            <li className="grey grey-amac user-dropdown">
              <a
                data-toggle="dropdown"
                className="dropdown-toggle"
                href="#/"
                aria-expanded="true"
                alt=""
              >
                <FontAwesomeIcon icon="user" />
                <span className="user-info">
                  {(user && user.person && user.person.first_name) || "User"} (
                  {(user &&
                    user.person &&
                    user.person.company &&
                    user.person.company.name) ||
                    "Company"}
                  )
                </span>
                <FontAwesomeIcon icon="caret-down" />
              </a>

              <ul className="user-menu dropdown-menu-right dropdown-menu dropdown-caret dropdown-close">
                <li>
                  <a href="/#/home/workshop">
                    
                      {" "}
                      {/* <FontAwesomeIcon
                        className="ace-icon nabvar-user-icon"
                        icon={faUsers}
                      /> */}
                      <FontAwesomeIcon
                        icon="users"
                        className="icon-margins-right"
                      />
                      {t("user")}
                    
                    {/* ////Not used at the moment because workshops can't change roles////

                    {user && user.admin ? (
                      <div ng-repeat="role in currentUser.roles track by $index | unique">
                        <div className="nabvar-user-roles">{t("admin")}</div>
                      </div>
                    ) : null}
                    {user && user.employee ? (
                      <div ng-repeat="role in currentUser.roles track by $index | unique">
                        <div className="nabvar-user-roles">{t("Employee")}</div>
                      </div>
                    ) : null}
                    */}
                  </a>
                </li>

                <li className="divider" />

                <li>
                  <a href="#/" onClick={e => showChangePasswordModal(e)}>
                    <FontAwesomeIcon
                      icon="key"
                      className="icon-margins-right"
                    />
                    {t("change_password")}
                  </a>
                </li>
                <li className="divider" />

                <li>
                  <a href="#/">
                    <FontAwesomeIcon
                      icon="language"
                      className="icon-margins-right"
                    />
                    {t("choose")} {t("lang")}
                  </a>
                </li>
                <li>
                  <a
                    onClick={event => handleChangeLanguageClick("es", event)}
                    href="#/"
                    ng-click="setLanguage('es')"
                  >
                    {t("spanish")}
                  </a>
                </li>
                <li>
                  <a
                    onClick={event => handleChangeLanguageClick("en", event)}
                    href="#/"
                    ng-click="setLanguage('en')"
                  >
                    {t("english")}
                  </a>
                </li>
                <li>
                  <a
                    onClick={event => handleChangeLanguageClick("pt", event)}
                    href="#/"
                    ng-click="setLanguage('pt')"
                  >
                    {t("portuguese")}
                  </a>
                </li>

                <li className="divider" />

                <li>
                  <a href="#/">
                    <FontAwesomeIcon
                      icon="question-circle"
                      className="icon-margins-right"
                    />
                    {t("help")} / {t("support")}
                  </a>
                </li>

                <li className="divider" />

                <li>
                  <a onClick={() => onLogoutClick()} href="#/">
                    <FontAwesomeIcon
                      className="icon-margins-right"
                      icon="power-off"
                    />
                    {t("logout")}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
