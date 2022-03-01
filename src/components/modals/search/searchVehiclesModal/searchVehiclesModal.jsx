import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../reusableComponents/pagination";
// import logic from "../../../../logic/logic";
import reactVehiclesService from "../searchVehiclesModal/vehiclesService";
import LoadingIcon from "../../../reusableComponents/loadingIcon";
import CloseButton from "../../../reusableComponents/CloseButton";
import SearchModalVehiclesSearchBox from "../searchVehiclesModal/searchModalVehiclesSearchBox";
import ReloadItems from "../../../reusableComponents/reloadItems";

const TABLE_VEHICLES_FIELDS = [
  "registration",
  "identification_code",
  "brand",
  "model",
  "fleet",
  "departament",
  "ceco",
  "zone",
  "division",
];

const SearchVehiclesModal = ({
  value,
  closeModal,
  showModal,
  searchSelection,
  selectedCompany,
  cancelledVehicles,
}) => {
  const { t } = useTranslation();

  // Search Items
  const [items, setItems] = useState([]);

  // Flag that controls whether the modal is shown.
  // The className "aside" assigns a z-index of 1040, and without it assigns a z-index of 1050. This modal will open on top of an already opened modal.
  const showHideClassName = showModal
    ? "overflowYAuto rc-modal z1060 display-block modal-open modal in "
    : "modal fade in display-none";

  // Controls the total number of calls given
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Dynamically loads all the item types to search
  const loadSearches = (queryParameters) => {
    const company_id = selectedCompany;
    const showCancelled = cancelledVehicles;
    const buscar = {};

    // if (queryParameters) {
    //   queryParameters.searchBrand
    //     ? (buscar.brand_name_cont = queryParameters.searchBrand)
    //     : "";
    //   queryParameters.searchRegistration
    //     ? (buscar.registration_cont = queryParameters.searchRegistration)
    //     : "";
    //   queryParameters.searchFleet
    //     ? (buscar.fleet_name_cont = queryParameters.searchFleet)
    //     : "";
    //   queryParameters.searchIdentificationCode
    //     ? (buscar.identification_code_eq =
    //         queryParameters.searchIdentificationCode)
    //     : "";
    //   queryParameters.searchModel
    //     ? (buscar.model_name_cont = queryParameters.searchModel)
    //     : "";
    //   queryParameters.searchSubzone
    //     ? (buscar.subzone_name_cont = queryParameters.searchSubzone)
    //     : "";
    //   queryParameters.searchUnity
    //     ? (buscar.unity_name_cont = queryParameters.searchUnity)
    //     : "";
    //   queryParameters.searchZone
    //     ? (buscar.zone_name_cont = queryParameters.searchZone)
    //     : "";
    // }

    let searchParams = {};

    if (showCancelled && showCancelled === "true") {
      searchParams = {
        ...queryParameters,
        page: (queryParameters && queryParameters.currentPage) || 1,
        per_page: (queryParameters && queryParameters.perPage) || 25,
        q: {
          company_id_eq: 1,
          // company_id_eq: company_id || logic.getFilter("company_id"),
          sorts: "id desc",
          ...buscar,
        },
      };
    } else {
      searchParams = {
        ...queryParameters,
        page: (queryParameters && queryParameters.currentPage) || 1,
        per_page: (queryParameters && queryParameters.perPage) || 25,
        q: {
          company_id_eq: 1,
          // company_id_eq: company_id || logic.getFilter("company_id"),
          sorts: "id desc",
          vehicle_state_name_not_eq: "Cancelado",
          ...buscar,
        },
      };
    }

    reactVehiclesService
      .getVehicles(searchParams)
      .then((data) => {
        setTotalItems(data.total);
        setItems(data.json.vehicles);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  // cdM
  useEffect(() => {
    setLoading(true);
    let matri = null;
    if (value) {
      matri = { searchRegistration: value };
    }
    loadSearches(matri);

    document.addEventListener("keydown", handleEscapePress);
    return () => {
      setItems([]);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, []);

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
      id="searchVehiclesModal"
      className={showHideClassName}
      tabIndex="-1"
      draggable-modal="true"
      style={{
        fontFamily: "Open Sans, sans-serif",
        fontSize: "14px",
        fontWeight: "600",
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header of the modal, title changes on either Add or Update depending on of recieved prop has database id or not. */}
          <div className="modal-header">
            <CloseButton closeModal={() => closeModal()} />
            {/* <a href={`#/configuration/parameters/vehicles/vehicles`} className="btn btn-success btn-sm btn-header-modal float-right" target="_blank">
            <i className="fa fa-plus"></i> {t('add_new_w')}
          </a> */}
            <h3 className="smaller lighter blue no-margin">
              {t("search")} {t("lowercase", { text: t("vehicle") })}
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
              <SearchModalVehiclesSearchBox
                requestSearch={handleRequestSearch}
              />
            </div>

            <LoadingIcon loading={loading} />

            <div className="row table-responsive-row">
              <div className="col-md-12 table-responsive table-search">
                <table className="table table-hover-search table-striped">
                  <thead className="ng-scope">
                    <tr className="ng-table-sort-header">
                      {TABLE_VEHICLES_FIELDS.map((col) => (
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
                    {items &&
                      items.map((vehicle) => {
                        return (
                          <tr
                            onClick={(e) => handleSelectItemClick(e, vehicle)}
                            key={vehicle.id}
                          >
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.registration}
                            </td>
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.identification_code}
                            </td>
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.brand && vehicle.brand.name}
                            </td>
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.model && vehicle.model.name}
                            </td>
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.fleet && vehicle.fleet.name}
                            </td>
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.departament && vehicle.departament.name}
                            </td>
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.ceco && vehicle.ceco.name}
                            </td>
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.zone && vehicle.zone.name}
                            </td>
                            <td data-title="tablesTranslations.vehicle">
                              {vehicle.division && vehicle.division.name}
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
                />
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

export default SearchVehiclesModal;
