import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListItem = ({
  name,
  url,
  fontAwesomeFaIcon,
  hasSubmenu,
  onAnchorClick,
  toggleSidebar,
}) => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  return (
    <>
      {!hasSubmenu ? (
        <a
          onClick={(event) => onAnchorClick(event, name, url)}
          href="#/"
          className={
            windowSize && windowSize < 1024 ? "active button is-outlined " : ""
          }
        >
          <div
            className={
              windowSize && windowSize < 1024
                ? "minWidht230 is-flex is-flex-wrap-nowrap"
                : ""
            }
          >
            {windowSize && windowSize < 1024 && (
              <div className="mr-3">
                <FontAwesomeIcon
                  className="textRedAmac"
                  icon={fontAwesomeFaIcon}
                />
              </div>
            )}
            {!toggleSidebar && <div className={windowSize && windowSize >= 1024 ? ("navbar-item") : ("")}>{name}</div>}
          </div>
        </a>
      ) : (
        <a
          onClick={(event) => onAnchorClick(event, name, url)}
          href="/"
          className="btn-disabled"
          disabled="disabled"
        >
          <FontAwesomeIcon icon={fontAwesomeFaIcon} />
          {!toggleSidebar && (
            <>
              <span className="menu-text-padding">{name}</span>
              <div className="pull-right padding-right5">
                <i className="fas fa-angle-down"></i>
              </div>
            </>
          )}
        </a>
      )}
    </>
  );
};

export default ListItem;
