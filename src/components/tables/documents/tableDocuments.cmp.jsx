import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import servicesApiService from "../../home/service/services.service";
import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";
import ConfirmDeleteModal from "../../modals/confirmDeleteModal";

const DOCUMENTS_FIELDS = ["file_name", "date", " "];

const TableDocumentsComponent = ({ documentsList, expedientId, doReload }) => {
  const { t } = useTranslation();

  const [documents, setDocuments] = useState([]);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [documentBudget, setDocumentBudget] = useState(null);

  useEffect(() => {
    if (documentsList) {
      setDocuments(documentsList);
    }
  }, [documentsList]);

  // Shows the modal onclick on the delete icon
  const handleShowDeleteModal = (item) => {
    setDocumentBudget(item);
    setShowConfirmDeleteModal(true);
  };

  // Closes the modal.
  const handleCloseDeleteModal = () => {
    return setShowConfirmDeleteModal(false);
  };

  const handleDeleteDocument = () => {
    setDocumentBudget(null);
    servicesApiService
      .deleteImage(expedientId, documentBudget.id)
      .then((res) => {
        action.sayMessage("success", t("delete_file_success"));
        setDocumentBudget(null);
        doReload("reload");
        setShowConfirmDeleteModal(false);
      })
      .catch((err) => action.sayMessage("danger", err));
  };

  const action = useConfirmActionMessage();

  return (
    <div>
      <ConfirmDeleteModal
        action={handleDeleteDocument}
        itemValue={documentBudget}
        closeModal={handleCloseDeleteModal}
        showDeleteModal={showConfirmDeleteModal}
      />
      <div className="row">
        <div className="col-md-12 no-padding-left-right">
          <div className="col-md-12 widget-container">
            <div
              className="row"
              style={{ paddingLeft: "15px", paddingRight: "30px" }}
            ></div>
            <div className={`widget-body`}>
              <div className="widget-main col">
                <div className="col-md-12 table-responsive sec-table-responsive">
                  <table className="table table-hover-search table-striped">
                    <thead className="ng-scope">
                      <tr className="ng-table-sort-header">
                        {DOCUMENTS_FIELDS.map((col) => (
                          <th
                            title=""
                            className="header sortable sort-asc"
                            key={col}
                          >
                            <div className="ng-table-header ng-scope">
                              <span className="ng-binding sort-indicator">
                                {t(col)}
                              </span>
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
                              <td>{item && item.file_name}</td>
                              <td>{item && item.date_file}</td>
                              <td className="col-md-1 options-column center">
                                <div className="ng-isolate-scope">
                                  <i
                                    onClick={() => handleShowDeleteModal(item)}
                                    className="red ace-icon fa fa-trash-o bigger-130 faa-pulse animated-hover hover-select-icon"
                                    alt={t("delete")}
                                    title={t("delete")}
                                  ></i>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDocumentsComponent;
