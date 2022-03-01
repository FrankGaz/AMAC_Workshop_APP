import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../reusableComponents/pagination";
import CloseButton from "../../../reusableComponents/CloseButton";
import logic from "../../../../logic/logic";
import countriesApiService from "./countriesService";
import SearchModalCountriesSearchBox from "./searchModalCountriesSearchBox";
import ReloadItems from "../../../reusableComponents/reloadItems";
import LoadingIcon from "../../../reusableComponents/loadingIcon";
import { useStateValue } from "../../../../data/context/store";

const SearchCountriesModal = ({ closeModal, showModal, searchSelection }) => {
  const { t } = useTranslation();

  const [{ user }] = useStateValue();

  const customer =
    user &&
    user.person &&
    user.person.company_client &&
    user.person.company_client.customer &&
    user.person.company_client.customer.id;

  // Search Items
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Flag that controls whether the modal is shown.
  // The className "aside" assigns a z-index of 1040, and without it assigns a z-index of 1050. This modal will open on top of an already opened modal.
  const showHideClassName = showModal
    ? "overflowYAuto rc-modal z1060 display-block modal-open modal in "
    : "modal fade in display-none";

  // Controls the total number of calls given
  const [totalItems, setTotalItems] = useState(0);

  // Dynamically loads all the item types to search
  const loadSearches = queryParameters => {
    setIsLoading(true);
    const query = {
      method: "GET",
      filterCustomer: customer
    };
    if (!queryParameters) {
      queryParameters = { method: "GET" };
    }

    logic.configureQueryParameters({ ...query, ...queryParameters });

    showModal &&
      countriesApiService
        .getCountries()
        .then(data => {
          setTotalItems(data && data.total);
          setItems(data && data.json && data.json.countries);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err.message);
          setIsLoading(true);
        });
  };

  // ComponentShouldUpdate
  useEffect(() => {
    setItems([]);
    loadSearches();
    document.addEventListener("keydown", handleEscapePress);
    return () => {
      setItems([]);
      document.removeEventListener("keydown", handleEscapePress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const handleEscapePress = e => {
    if (e.keyCode === 27) {
      return closeModal();
    }
  };

  const handleSelectItemClick = (e, item) => {
    e.preventDefault();
    searchSelection(item);
    return closeModal();
  };

  const handleRequestPagination = params => {
    loadSearches(params);
  };

  const handleRequestSearch = params => {
    loadSearches(params);
  };

  const handleRefreshClick = () => {
    loadSearches({
      refresh: true
    });
  };
  return (
    <div
      id="searchFleetsModal"
      className={showHideClassName}
      tabIndex="-1"
      draggable-modal="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header of the modal, title changes on either Add or Update depending on of recieved prop has database id or not. */}
          <div className="modal-header">
            <CloseButton closeModal={() => closeModal()} />
            <h3 className="smaller lighter blue no-margin">
              {t("search")} {t("lowercase", { text: t("countries") })}
            </h3>
          </div>

          <div className="modal-body">
            <div className="row">
              <ReloadItems doReload={handleRefreshClick} />
              <SearchModalCountriesSearchBox
                requestSearch={handleRequestSearch}
              ></SearchModalCountriesSearchBox>
            </div>
            <LoadingIcon loading={isLoading} />
            <div className="row table-responsive-row">
              <div className="col-md-12 table-responsive table-search">
                <table className="table table-hover-search table-striped">
                  <thead className="ng-scope">
                    <tr className="ng-table-sort-header">
                      <th title="" className="header  sortable sort-asc">
                        <div className="ng-table-header ng-scope">
                          <span className="ng-binding sort-indicator">
                            {t("countries")}
                          </span>
                        </div>
                      </th>
                      <th title="" className="header  sortable">
                        <div className="ng-table-header ng-scope">
                          <span className="ng-binding sort-indicator">
                            {t("management_company")}
                          </span>
                        </div>{" "}
                      </th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {items &&
                      items.map((item, index) => {
                        return (
                          <tr
                            onClick={e => handleSelectItemClick(e, item)}
                            key={index}
                            ng-repeat="fleet in $data track by $index"
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
                              data-sortable="'company_name'"
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

export default SearchCountriesModal;
