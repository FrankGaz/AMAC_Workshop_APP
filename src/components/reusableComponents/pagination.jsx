import React, { useEffect, useState } from "react";

const Pagination = ({ total, requestPagination }) => {
  // !Important default values sent as an API request are controlled in file logic.js.

  // State that controls the max number of items per page
  const [itemsPerPage, setItemsPerPage] = useState(25);
  // State that controls the number of page buttons to be displayed
  const [pages, setPages] = useState(1);
  // Current page being displayed
  const [currentPage, setCurrentPage] = useState(1);
  // State that handles the items per page
  const [numberOfDivisions] = useState([10, 25, 50, 100]);
  // State that handles the index of the current division that is being used. Also controls which button is active on numbre of divisions.
  const [currentDivision, setCurrentDivision] = useState(2);
  // Object that handles the parameters sent to higher order components
  let parameters = {
    currentPage,
    perPage: itemsPerPage,
    method: "GET",
    pagination: true
  };

  useEffect(() => {
    const calculatedPages = Math.ceil(total / itemsPerPage);
    calculatedPages ? setPages(calculatedPages) : setPages(0);
  }, [total, itemsPerPage]);

  // Sets the current active page
  const handleSetCurrentPage = page => {
    setCurrentPage(page);
    parameters = {
      ...parameters,
      currentPage: page
    };
    requestPagination(parameters);
  };

  //sets the current kinds of items per page that are going to be used, then always resets to ask for first page.
  const handleSetCurrentDivision = divisionPage => {
    parameters = {
      ...parameters,
      perPage: numberOfDivisions[divisionPage - 1],
      currentPage: 1
    };
    setCurrentPage(1);
    setCurrentDivision(divisionPage);
    setItemsPerPage(numberOfDivisions[divisionPage - 1]);
    return requestPagination(parameters);
  };

  // handles whether we go a page forward or backwards.
  const handleNextPageClick = action => {
    if (action === "forward") {
      // if the number of pages equals the current page then it returns without any action.
      if (currentPage === pages) {
        return;
      }
      setCurrentPage(currentPage + 1);
      parameters = {
        ...parameters,
        currentPage: currentPage + 1
      };
      requestPagination(parameters);
    } else if (action === "backward") {
      // if the current equals 1 the current page then it returns without any action
      if (currentPage === 1) {
        return;
      }
      setCurrentPage(currentPage - 1);
      parameters = {
        ...parameters,
        currentPage: currentPage - 1
      };
      requestPagination(parameters);
    } else {
      console.error("unexpected error on pressing next or backwards button");
    }
  };
  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ height: "40px" }}>
          <div className="btn-group pull-right ">
            {numberOfDivisions.map((number, index) => (
              <button
                key={index}
                onClick={() => handleSetCurrentDivision(index + 1)}
                type="button"
                className={
                  currentDivision === index + 1
                    ? "btn btn-default active"
                    : "btn btn-default"
                }
              >
                <span className="ng-binding">{number}</span>
              </button>
            ))}
          </div>
          {pages !== 0 ? (
            <div className="pagination ng-table-pagination ">
              <ul className="pagination ng-table-pagination ">
                <li
                  onClick={() => handleNextPageClick("backward")}
                  className={currentPage === 1 ? "disabled" : ""}
                >
                  <span>«</span>
                </li>
                {[...Array(pages)].map((_, index) => (
                  <li
                    key={index}
                    onClick={() => handleSetCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    <span>{index + 1}</span>
                  </li>
                ))}
                <li
                  onClick={() => handleNextPageClick("forward")}
                  className={currentPage === pages ? "disabled" : ""}
                >
                  <span>»</span>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
        <div className="ml-5">Total {total}</div>
      </div>
    </div>
  );
};

export default Pagination;
