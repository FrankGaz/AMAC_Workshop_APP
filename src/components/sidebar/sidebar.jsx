import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import menuItems from "../../data/sidebar";
import ListItem from "./listItem";

const Sidebar = props => {
  const { t } = useTranslation();

  const [menuState, setMenuState] = useState({});
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const toggleClick = () => {
    setToggleSidebar(!toggleSidebar)

  }

  // this method sets the current state of a menu item whether it is in expanded or collapsed. Also routes to the specified url
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

  /* if the menu item doesn't have any child, this method simply returns a clickable menu item that redirects to any location
     and if there is child this method uses recursion to go until the last level of children. */
  const showMenuItems = children => {
    return children.map(subOption => {
      const { name, url, icon, children } = subOption;
      if (!children) {
        return (
          <li key={name}>
            <ListItem
              onAnchorClick={e => handleClick(e, name, url)}
              name={t(name)}
              url={url}
              fontAwesomeFaIcon={icon}
              toggleSidebar={toggleSidebar}
            />
          </li>
        );
      }
      return (
        <li key={name}>
          <ListItem
            onAnchorClick={e => handleClick(e, name, url)}
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
        </li>
      );
    });
  };

  return (
    <>
    <div>
      <ul>
        {showMenuItems(menuItems.data)}
      </ul>

      {/* <div>
        <i
          className="ace-icon fa fa-angle-double-left"
          data-icon1="ace-icon fa fa-angle-double-left"
          data-icon2="ace-icon fa fa-angle-double-right"
        ></i>
      </div> */}
    </div>
  
    </>
  );
};

export default Sidebar;
