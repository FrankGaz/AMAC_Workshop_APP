import React, { useState, useEffect } from "react";
import useTranslation from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddButton = ({ label, doAddNew }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("add_new");

  useEffect(() => {
    if (label) {
      setTitle(label);
    }
  }, [label]);

  return (
    <div className="col-gray-bg side-paddings">
      <button
        type="button"
        onClick={() => doAddNew({})}
        className="btn btn-success block btn-sm full"
      >
        <FontAwesomeIcon icon="plus" /> {t(title)}
      </button>
    </div>
  );
};

export default AddButton;
