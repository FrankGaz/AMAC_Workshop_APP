import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TablePhonesModal from "./tableBudgetDetails.modal";

const TABLE_BUDGET_DETAILS_FIELDS = ["phone_kind", "country_code", "number"];

const TablePhonesComponent = ({ tableInfo, doAddPhone, doDeletePhone }) => {
  const { t } = useTranslation();

  const [phones, setPhones] = useState([]);
  const [phone, setPhone] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [totalItems, setTotalItems] = useState(0);
  const [showWidgetBody, setShowWidgetBody] = useState(true);

  // state modals
  const [showPhonesModal, setShowPhonesModal] = useState(false);

  useEffect(() => {
    if (tableInfo) {
      setPhones(tableInfo);
      setTotalItems(tableInfo.length);
    }
  }, [tableInfo]);

  // Phones
  const handleShowPhonesModalClick = (e, item) => {
    e.preventDefault();
    setPhone(item);
    setShowPhonesModal(true);
  };

  const handleClosePhonesSearchModalClick = () => {
    setShowPhonesModal(false);
  };

  const handlePhonesSearchSelectionClick = (item) => {
    doAddPhone(item);
    setPhone({});
  };

  // Shows the modal onclick on the delete icon
  const handleShowDeleteModal = (item) => {
    setPhone(item);
    doDeletePhone(item);
    setPhone({});
  };

  const toggleSearchBox = (event) => {
    event.preventDefault();
    setShowWidgetBody((prevState) => !prevState);
  };

  return (
    <div>
      {showPhonesModal && (
        <TablePhonesModal
          closeModal={handleClosePhonesSearchModalClick}
          showModal={showPhonesModal}
          searchSelection={(item) => handlePhonesSearchSelectionClick(item)}
          item={phone}
        ></TablePhonesModal>
      )}
      <div className="row">
        <div className="col-md-12 no-padding-left-right">
          <div className="col-md-12 widget-container">
            <div
              className="row"
              style={{ paddingLeft: "15px", paddingRight: "30px" }}
            >
              <div className="col-md-9">
                <h3>
                  <span className="blue">{t("phones__")}</span>
                </h3>
              </div>
              <div className="col-md-3" style={{ paddingTop: "10px" }}>
                <button
                  className="btn btn-success block btn-sm full btn-top"
                  onClick={(e) => handleShowPhonesModalClick(e)}
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
                        {TABLE_BUDGET_DETAILS_FIELDS.map((col) => (
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
                      {phones &&
                        phones.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td data-title="tablesTranslations.Phone">
                                {item.phone_kind && item.phone_kind.name}
                              </td>
                              <td data-title="tablesTranslations.Phone">
                                {item.country_code}
                              </td>
                              <td data-title="tablesTranslations.Phone">
                                {item.number}
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

export default TablePhonesComponent;
