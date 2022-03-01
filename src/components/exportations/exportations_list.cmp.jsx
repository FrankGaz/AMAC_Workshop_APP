import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logic from "../../logic/logic";
import Pagination from "../reusableComponents/pagination";
import exportationsListService from "./exportations.service";
import LoadingIcon from "../reusableComponents/loadingIcon";
import ExportationsListHeader from "./exportations_list_header.cmp";
import useConfirmActionMessage from "../../hooks/useConfirmActionMessage";
import ConfirmActionMessage from "../reusableComponents/confirmActionMessage";
import defaults from "../reusableComponents/defaults";
import _ from "lodash";

const TABLE_EXPORT_LIST_FIELDS = [
  "finished",
  "name_of_model",
  "name_of_method",
  "updated_at",
  "asset"
];

const ExportationsList = ({ routing }) => {
  // translation hook from the ReactI18next library
  const { t } = useTranslation();

  // state values
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Controls the total number of items that were recieved
  const [totalItems, setTotalItems] = useState(0);

  // ComponentDidMount
  useEffect(() => {
    setLoading(true);

    logic.configureQueryParameters({
      sortingBydate: "updated_at ",
      sortByAscDesc: "desc"
    });
    exportationsListService
      .getAll()
      .then(data => {
        setData(data.json.job_notifiers);
        setTotalItems(data && data.total);
        setLoading(false);
      })
      .catch(err => {
        action.sayMessage("danger", t("exportation_error"));
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function that sends a call to the API
  const handleUpdate = queryParameters => {
    let query = {
      method: "GET",
      sortingByDate: "updated_at ",
      sortByAscDesc: "desc"
    };

    logic.configureQueryParameters({ ...query, ...queryParameters });

    setLoading(true);

    exportationsListService
      .getAll()
      .then(data => {
        setTotalItems(data && data.total);
        setData(data.json.job_notifiers);
        setLoading(false);
      })
      .catch(err => {
        action.sayMessage("danger", t("exportation_error"));
        setLoading(false);
      });
  };

  // Function that reloads the page with a new get request the moment we click the reload button
  const handleReload = () => {
    handleUpdate({
      refresh: true
    });
  };

  // Function that handles the search box
  const handleSearchClick = searchParams => {
    if (!searchParams || _.isEmpty(searchParams)) {
      handleUpdate();
    } else {
      const { finished, name_of_method, from, to } = searchParams;

      const metodo = defaults.jobMethod.find(
        item => item.id === name_of_method
      );

      handleUpdate({
        searchExportationFromDate: from,
        searchExportationToDate: to,
        searchExportationType: (metodo && metodo.name) || null,
        searchExportationStatus: finished && (finished === 1 ? "true" : "false")
      });
    }
  };

  // End search box functions

  const handleShowModal = value => {};
  const handleExport = () => {};
  //Function that handles the pagination requests
  const handleRequestPagination = params => {
    handleUpdate(params);
  };

  const action = useConfirmActionMessage();

  return (
    <div className="page-content">
      <ConfirmActionMessage {...action} />

      <ExportationsListHeader
        doRequestSearch={handleSearchClick}
        doAddNew={handleShowModal}
        doReload={handleReload}
        doExport={handleExport}
      />

      <LoadingIcon loading={loading} />

      <div className="row table-responsive-row">
        <div className="col-md-12 table-responsive table-list">
          <table className="table table-hover-select table-striped">
            <thead className="ng-scope">
              <tr className="ng-table-sort-header">
                {TABLE_EXPORT_LIST_FIELDS.map(item => {
                  return (
                    <th
                      title=""
                      key={item}
                      className="header sortable sort-asc"
                    >
                      <div className="ng-table-header ng-scope">
                        <span className="ng-binding sort-indicator">
                          {t(item)}
                        </span>
                      </div>
                    </th>
                  );
                })}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {data &&
                data.map(unit => {
                  const dt = new Date(Date.parse(unit.updated_at));

                  return (
                    <tr
                      key={unit.id}
                      onDoubleClick={() => handleShowModal(unit)}
                      className="pointer"
                    >
                      <td data-sortable={"finished"}>
                        {unit && unit.finished ? (
                          <i
                            className="fa fa-check green ace-icon bigger-130 faa-pulse animated-hover hover-select-icon"
                            aria-hidden="true"
                          ></i>
                        ) : (
                          <i
                            className="fa fa-circle red ace-icon bigger-130 faa-pulse animated-hover hover-select-icon"
                            aria-hidden="true"
                          ></i>
                        )}
                      </td>

                      <td data-sortable={"name_of_model"}>
                        {unit && unit.name_of_model}
                      </td>

                      <td data-sortable={"name_of_method"}>
                        {unit && unit.name_of_method}
                      </td>

                      <td data-sortable={"updated_at"}>
                        {unit && unit.updated_at
                          ? dt.getFullYear() +
                            "-" +
                            (dt.getMonth() + 1) +
                            "-" +
                            dt.getDate()
                          : null}
                      </td>

                      <td data-sortable={"asset"}>
                        <a href={unit && unit.asset && unit.asset.file_url}>
                          <i
                            className="fa fa-download green ace-icon bigger-130 faa-pulse animated-hover hover-select-icon"
                            aria-hidden="true"
                          ></i>
                        </a>
                      </td>

                      <td className="col-md-1 options-column center">
                        {/* <div className='ng-isolate-scope'>
                        <i onClick={() => handleShowModal(unit)} className='blue ace-icon fa fa-pencil bigger-130 faa-pulse animated-hover hover-select-icon' alt='Ver / Modificar' title='Ver / Modificar'></i>
                        <i onClick={() => handleShowDeleteModal(unit)} className='red ace-icon fa fa-trash-o bigger-130 faa-pulse animated-hover hover-select-icon' alt='Eliminar' title='Eliminar'></i>
                      </div> */}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        requestPagination={handleRequestPagination}
        total={totalItems}
      ></Pagination>
    </div>
  );
};

export default ExportationsList;
