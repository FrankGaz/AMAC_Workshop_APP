import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const FooterNavBarCreateIntervention = () => {
  const { t } = useTranslation();
  //const [newInterventionID, setNewInterventionID] = useState(interventionId);
  const newID = sessionStorage.getItem("newInterventionId");

  const goToIntervention = () => {
    if (newID != null && newID > 0) {
      //sessionStorage.setItem("currentInterventionId");
      // this.props.history.push({
      //   pathname: `/home/interventions/data/${newID}`,
      // });
      window.location.href = "#/home/interventions/data/" + newID;
    } else {
      history.goBack();
    }
  };

  const history = useHistory();

  return (
    <div className="navbar footerNavBar is-fixed-bottom">
      <button
        className="button buttonFooter hasBorderRight width50 is-radiusless fullFooterHeight"
        onClick={goToIntervention}
      >
        <i className="fas fa-chevron-left mr-2"></i>
        {t("return")}
      </button>
      <a href="/home">
        <button className="button buttonFooter width50 is-radiusless fullFooterHeight">
          <i className="fas fa-home mr-2"></i>
          {t("home")}
        </button>
      </a>
    </div>
  );
};

export default FooterNavBarCreateIntervention;
