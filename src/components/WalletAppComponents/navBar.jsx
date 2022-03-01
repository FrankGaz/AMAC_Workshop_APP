import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import menuItems from "../../data/sidebar";
import ListItem from "../sidebar/listItem";
import logic from "../../logic/logic";

const Navbar = (props) => {
  const { t } = useTranslation();
  const [isActive, setisActive] = useState(false);
  const [menuState, setMenuState] = useState({});
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [path, setPath] = useState(null);
  const [path2, setPath2] = useState(null);
  const [path3, setPath3] = useState(null);
  const [pathSpace, setPathSpace] = useState(".");

  const pathSeparator = "·";

  useEffect(() => {
    getPatch();
    //setBreadcrumbSpaces();
    setPath(sessionStorage.getItem("subNavBar"));
  }, [props]);

  const getPatch = () => {
    setTimeout(() => {
      setPath(sessionStorage.getItem("subNavBar"));
      setPath2(sessionStorage.getItem("currentInterventionCode"));
      setPath3(sessionStorage.getItem("currentVehicleSection"));
    }, 10);
  };

  // const setBreadcrumbSpaces = () => {
  //   if (path2 != null || path3 != null) {
  //     setPathSpace(pathSeparator);
  //   } else {
  //     setPathSpace("");
  //   }
  // };

  const toggleClick = () => {
    setToggleSidebar(!toggleSidebar);
  };

  const handleClick = (event, item, url) => {
    event.preventDefault();
    setMenuState((prevState) => {
      return {
        ...prevState,
        [item]: !prevState[item],
      };
    });
    props.history.push(url);
  };

  const onLogoutClick = (e) => {
    e.preventDefault();

    logic.logout();
    props && props.history && props.history.push("/");
  };

  const showMenuItems = (children) => {
    return children.map((subOption) => {
      const { name, url, icon, children } = subOption;
      if (!children) {
        return (
          <div className="py-2" key={name}>
            <ListItem
              onAnchorClick={(e) => handleClick(e, name, url)}
              name={t(name)}
              url={url}
              fontAwesomeFaIcon={icon}
              toggleSidebar={toggleSidebar}
            />
          </div>
        );
      }
      return (
        <div className="flex-content-element" key={name}>
          <ListItem
            onAnchorClick={(e) => handleClick(e, name, url)}
            name={t(name)}
            url={url}
            fontAwesomeFaIcon={icon}
            hasSubmenu={true}
            toggleSidebar={toggleSidebar}
          />
          {/* <ul
            id={menuState[name] === true ? "display-block" : ""}
          >
            {showMenuItems(children)}
          </ul> */}
        </div>
      );
    });
  };

  return (
    <>
      {windowSize && windowSize < 1024 && (
        <div className="mb-3">
          <nav
            className="px-5 navbar is-fixed-top"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <div className="image my-2">
                <img
                  //src="../images/afm_amac_fleet_manager_n.png"
                  src="../images/nuuk-mobility-solutions-logo-navbar.png"
                  // alt="AFM Logo"
                  alt="NUUK Logo"
                  width="112"
                  height="28"
                />
              </div>
              <button
                onClick={() => {
                  setisActive(!isActive);
                }}
                className={`navbar-burger burger ${
                  isActive ? "is-active" : ""
                }`}
                aria-label="menu"
                aria-expanded="false"
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
              <div className="navbar-start flex-containerColumnCenter  p-2">
                <div className="flex-content-block">
                  {showMenuItems(menuItems.data)}
                  <div className="flex-content-element">
                    <button
                      className="button is-small is-rounded buttonLogOut"
                      onClick={(e) => onLogoutClick(e)}
                    >
                      <span className="icon is-small mr-1">
                        <i className="fas fa-sign-out-alt"></i>
                      </span>
                      <p className="is-size-7">SALIR</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {windowSize && windowSize < 1024 && path !== "home" && (
                <section className="hero redContainer">
                  <div className="hero-body">
                    {path && path2 == null && path3 == null && (
                      <p className="subtitle is-size-7 textWhite">{`${t(
                        path
                      )}`}</p>
                    )}
                    {path2 != null && (
                      <p className="subtitle is-size-7 textWhite">{`${t(
                        path
                      )} · ${t(path2)}`}</p>
                    )}
                    {path3 != null && (
                      <p className="subtitle is-size-7 textWhite">{`${t(
                        path
                      )} · ${t(path3)}`}</p>
                    )}
                  </div>
                </section>
              )}
              {windowSize && windowSize >= 1024 && path !== "home" && (
                <div className="is-flex is-align-items-center">
                  {path && path2 == null && path3 == null && (
                    <span className="tag tag-location is-size-7 textRedAmac">
                      {`${t(path)}`}
                    </span>
                  )}
                  {path2 != null && (
                    <span className="tag tag-location is-size-7 textRedAmac">{`${t(
                      path
                    )} · ${t(path2)}`}</span>
                  )}
                  {path3 != null && (
                    <span className="tag tag-location is-size-7 textRedAmac">{`${t(
                      path
                    )} · ${t(path3)}`}</span>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
      {windowSize && windowSize >= 1024 && (
        <div className="mb-3">
          <nav
            className="px-5 navbar is-fixed-top"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <div className="image my-2 mr-5">
                <img
                  // src="../images/afm_amac_fleet_manager_n.png"
                  src="../images/nuuk-mobility-solutions-logo-navbar.png"
                  // alt="AFM Logo"
                  alt="NUUK Logo"
                  width="112"
                  height="28"
                ></img>
              </div>

              <button
                className="navbar-burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="navbar-menu">
              <div className="navbar-start">
                {showMenuItems(menuItems.data)}
              </div>

              <div className="navbar-end">
                {windowSize && windowSize >= 1024 && path !== "home" && (
                  <div className="navbar-item">
                    <div className="is-flex is-align-items-center">
                      {path && path2 == null && path3 == null && (
                        <span className="tag tag-location is-size-7 textRedAmac">
                          {`${t(path)}`}
                        </span>
                      )}
                      {path2 != null && (
                        <span className="tag tag-location is-size-7 textRedAmac">{`${t(
                          path
                        )} · ${t(path2)}`}</span>
                      )}
                      {path3 != null && (
                        <span className="tag tag-location is-size-7 textRedAmac">{`${t(
                          path
                        )} · ${t(path3)}`}</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="navbar-item">
                  <div className="buttons">
                    <button
                      className="button buttonLogOut"
                      onClick={(e) => onLogoutClick(e)}
                    >
                      <strong className="is-size-7">{t('logout')}</strong>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
