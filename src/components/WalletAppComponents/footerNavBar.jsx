import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {useHistory} from "react-router-dom";

const FooterNavBar = (props) => {
  const { t } = useTranslation();

  const GoHome = () => {
    props.history.push({
      pathname: `/home`,
    });
  };

  const history = useHistory();

  return (
    <div className="navbar footerNavBar is-fixed-bottom">
      <button
        className="button buttonFooter hasBorderRight width50 is-radiusless fullFooterHeight"
        onClick={() => history.goBack()}
      >
        <i className="fas fa-chevron-left mr-2"></i>
        {t("return")}
      </button>
      <a href="/home">
        <button
          
          className="button buttonFooter width50 is-radiusless fullFooterHeight"
        >
          <i className="fas fa-home mr-2"></i>
          {t("home")}
        </button>
      </a>
    </div>
  );
};

export default FooterNavBar;
