import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableEmailsModal from "./tableEmails.modal";

const TABLE_EMAILS_FIELDS = ["email"];

const TableEmailsComponent = ({ emailsList, doAddEmail, doDeleteEmail }) => {
  const { t } = useTranslation();

  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [totalItems, setTotalItems] = useState(0);
  const [showWidgetBody, setShowWidgetBody] = useState(true);

  // state modals
  const [showEmailsModal, setShowEmailsModal] = useState(false);

  useEffect(() => {
    if (emailsList) {
      setEmails(emailsList);
      setTotalItems(emailsList.length);
    }
  }, [emailsList]);

  // Emails
  const handleShowEmailsModalClick = (item) => {
    setEmail(item);
    return setShowEmailsModal(true);
  };

  const handleCloseEmailsSearchModalClick = () => {
    return setShowEmailsModal(false);
  };

  const handleEmailsSearchSelectionClick = (item) => {
    doAddEmail(item);
    setEmail({});
  };

  // Shows the modal onclick on the delete icon
  const handleShowDeleteModal = (item) => {
    setEmail(item);
    doDeleteEmail(item);
    setEmail({});
  };

  const toggleSearchBox = (event) => {
    event.preventDefault();
    setShowWidgetBody((prevState) => !prevState);
  };

  return (
    <div>
      {showEmailsModal && (
        <TableEmailsModal
          closeModal={handleCloseEmailsSearchModalClick}
          showModal={showEmailsModal}
          searchSelection={(item) => handleEmailsSearchSelectionClick(item)}
          item={email}
        />
      )}
      <div className="row">
        <div className="col-md-12 no-padding-left-right">
          <div className="col-md-12 widget-container">
            <div
              className="row"
              style={{ paddingLeft: "20px", paddingRight: "30px" }}
            >
              <div className="col-md-9">
                <h3>
                  <span className="blue">{t("emails")}</span>
                </h3>
              </div>
              <div className="col-md-3" style={{ paddingTop: "10px" }}>
                <button
                  className="btn btn-success block btn-sm full btn-top"
                  style={{ paddingRight: "10px" }}
                  onClick={(e) => handleShowEmailsModalClick(e)}
                >
                  <i className="ace-icon fa fa-plus"></i> {t("add")}
                </button>
              </div>
            </div>
            <div
              className={
                showWidgetBody ? `widget-body` : `widget-body collapse`
              }
            >
              <div className="widget-main col">
                <div className="col-md-12 table-responsive sec-table-responsive">
                  <table className="table table-hover-search table-striped">
                    <thead className="ng-scope">
                      <tr className="ng-table-sort-header">
                        {TABLE_EMAILS_FIELDS.map((col) => (
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
                      {emails &&
                        emails.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td data-title="tablesTranslations.Email">
                                {item.email}
                              </td>
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

export default TableEmailsComponent;
