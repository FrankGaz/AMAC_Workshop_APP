import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ReloadItems = ({ doReload }) => {
  const { t } = useTranslation();

  const handleDoReload = event => {
    event.preventDefault();
    doReload();
  };

  return (
    <div className="col-md-1">
      <a
        href="#/"
        data-test-id="reloadItems"
        className="btn btn-light btn-refresh full-a"
        onClick={e => handleDoReload(e)}
        alt={t("refresh_table")}
        title={t("refresh_table")}
      >
        <div>
          <FontAwesomeIcon icon="sync" />{" "}
          <span className="hidden-md hidden-lg">{t("refresh_table")}</span>
        </div>
      </a>
    </div>
  );
};

export default ReloadItems;
