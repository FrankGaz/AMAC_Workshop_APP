import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DOCUMENTS_FIELDS = ["file_name", "date", "download"];

const InterventionsDocumentsTableComponent = ({ documentsList }) => {
  const { t } = useTranslation();

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (documentsList) {
      setDocuments(documentsList);
    }
  }, [documentsList]);

  return (
    <div>
      <table className="table fullWidth table-hover-select table-striped">
        <thead>
          <tr>
            {DOCUMENTS_FIELDS.map((item) => (
              <th key={item}>
                <div>
                  <span>{t(item)}</span>
                </div>
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {documents &&
            documents.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item && item.name}</td>
                  <td>{item && item.date_file}</td>
                  <td>
                    <a className="is-flex is-justify-content-center" href={item.file_url} target="_blank" download>
                      <FontAwesomeIcon icon="download" />{" "}
                    </a>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default InterventionsDocumentsTableComponent;
