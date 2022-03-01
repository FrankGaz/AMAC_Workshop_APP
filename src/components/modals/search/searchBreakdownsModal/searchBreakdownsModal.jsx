import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../reusableComponents/pagination";
import logic from "../../../../logic/logic";
import CloseButton from "../../../reusableComponents/CloseButton";
import SearchModalBreakdownsSearchBox from "./searchModalFleetsSearchBox2";
import breakdownsModalService from "./BreakdownsService";

const SearchBreakdownsModal = ({
  incidence,
  closeModal,
  showModal,
  searchSelection,
}) => {
  const { t } = useTranslation();

  // Flag that controls whether the modal is shown.
  // The className "aside" assigns a z-index of 1040, and without it assigns a z-index of 1050. This modal will open on top of an already opened modal.
  const showHideClassName = showModal
    ? "overflowYAuto rc-modal z1060 display-block modal-open modal in "
    : "modal fade in display-none";

  // Search Items
  const [items, setItems] = useState([]);
  // Controls the total number of calls given
  const [totalItems, setTotalItems] = useState(0);

  const loadSearches = (queryParameters) => {
    const query = {
      method: "GET",
      ...queryParameters,
    };

    logic.configureQueryParameters(query);

    breakdownsModalService.getBreakdowns().then((data) => {
      setTotalItems(data.total);
      setItems(data.json.breakdown_kinds);
    });
  };

  // ComponentShouldUpdate
  useEffect(() => {
    setItems([]);
    if (incidence) {
      loadSearches({
        searchModalIncidenceId: incidence,
      });
    } else {
      loadSearches();
    }

    document.addEventListener("keydown", handleEscapePress);
    return () => {
      setItems([]);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [showModal]);

  const handleEscapePress = (e) => {
    if (e.keyCode === 27) {
      return closeModal();
    }
  };

  const handleSelectItemClick = (e, item) => {
    e.preventDefault();
    searchSelection(item);
    return closeModal();
  };

  const handleRequestPagination = (params) => {
    loadSearches(params);
  };

  const handleRequestSearch = (params) => {
    loadSearches(params);
  };

  const handleRefreshClick = () => {
    loadSearches({
      refresh: true,
    });
  };
  return (
    <div
      id="searchBreakdownsModal"
      className={showHideClassName}
      tabIndex="-1"
      draggable-modal="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header of the modal, title changes on either Add or Update depending on of recieved prop has database id or not. */}
          <div className="modal-header">
            <CloseButton closeModal={() => closeModal()} />
            {/* <a href={`#/configuration/clients/branchs/add`} className="btn btn-success btn-sm btn-header-modal float-right" target="_blank">
            <i className="fa fa-plus"></i> {t('add_new_w')}
          </a> */}
            <h3 className="smaller lighter blue no-margin">
              {t("search")} {t("lowercase", { text: t("breakdowns") })}
            </h3>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-md-1">
                <a
                  onClick={handleRefreshClick}
                  className="btn btn-light btn-refresh full-a"
                  alt={t("refresh_table")}
                  title={t("refresh_table")}
                >
                  <div>
                    <i className="fa fa-refresh"></i>{" "}
                    <span className="hidden-md hidden-lg">
                      {t("refresh_table")}
                    </span>
                  </div>
                </a>
              </div>
              <SearchModalBreakdownsSearchBox
                requestSearch={handleRequestSearch}
              ></SearchModalBreakdownsSearchBox>
            </div>
            <div className="row table-responsive-row">
              <div className="col-md-12 table-responsive table-search">
                <table className="table table-hover-search table-striped">
                  <thead className="ng-scope">
                    <tr className="ng-table-sort-header">
                      <th title="" className="header  sortable sort-asc">
                        <div className="ng-table-header ng-scope">
                          <span className="ng-binding sort-indicator">
                            {t("name")}
                          </span>
                        </div>
                      </th>
                      <th title="" className="header  sortable">
                        <div className="ng-table-header ng-scope">
                          <span className="ng-binding sort-indicator">
                            {t("company")}
                          </span>
                        </div>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items &&
                      items.map((item, index) => {
                        return (
                          <tr
                            onClick={(e) => handleSelectItemClick(e, item)}
                            key={index}
                            className="pointer"
                          >
                            <td
                              data-title="tablesTranslations.fleet"
                              data-sortable="'name'"
                            >
                              {item && item.name}
                            </td>
                            <td
                              data-title="tablesTranslations.management_company"
                              data-sortable="'company_client'"
                            >
                              {item && item.company && item.company.name}
                            </td>
                            <td className="col-md-1 options-column center">
                              <i
                                className="green ace-icon fa fa-arrow-right bigger-150 hover-search-icon"
                                alt={t("select")}
                                title={t("select")}
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <Pagination
                  total={totalItems}
                  requestPagination={handleRequestPagination}
                ></Pagination>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={() => closeModal()}
              type="button"
              className="btn btn-sm btn-default"
              data-dismiss="modal"
            >
              <i className="ace-icon fa fa-times"></i> {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchBreakdownsModal;
