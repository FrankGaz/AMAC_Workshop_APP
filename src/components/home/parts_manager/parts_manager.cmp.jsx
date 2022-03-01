import React, { useEffect, useState } from "react";
import mocked_data from "./mocked_data";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import { useSpring, animated } from "react-spring";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useTranslation } from "react-i18next";
// import ConfirmActionMessage from "../../reusableComponents/confirmActionMessage";
// import { templateQueryParameters } from "../../../logic/queryParams";
// import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";
// import LoadingIcon from "../../reusableComponents/loadingIcon"
// import PartsAddModal from "./parts_add_modal";
// import useModal from "../../../hooks/useModal.hook";

const PartsManager = (props) => {
  const { t } = useTranslation();
  //   const action = useConfirmActionMessage();
  //   const [isLoading, setIsLoading] = useState(true);

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 500,
  });
  const springPropsContent = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });
  const springPropsTable = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1500,
  });

  const [workshopData, setWorkshopData] = useState(null);
  const [partsData, setPartsData] = useState(null);

  const workshopId = sessionStorage.getItem("workshopId");
  const PARTS_MANAGER_MAIN_HEADER = [
    "Código",
    "Proveedor",
    "Unid.",
    "Stock",
    "RSVP",
  ];
  const mockedData = mocked_data;

  useEffect(() => {
    if (workshopId && workshopId !== null && workshopId !== undefined) {
      setWorkshopData(workshopId);
      setPartsData(mockedData);
    }
  }, [workshopId]);

  //   const partsAddModal = useModal();

  const handleClickRSVP = (selectedItem) => {
    // event.preventDefault();
    // partsAddModal.openModal();
  };

  return (
    <animated.div style={springProps}>
      <div className="page-content">
        {/* <ConfirmActionMessage {...action} /> */}
        <div>
          {/* {partsAddModal.showModal && (
            <PartsAddModal
            {...partsAddModal}
            action={handleModalAction}
            />
      )} */}

          <animated.div style={springPropsContent}>
          <section className="hero is-warning">
                <div className="hero-body">
                  <div className="is-flex mb-3">
                    <i className="fas fa-2x fa-hard-hat"></i>
                    <p className="subtitle ml-5">{t("under_construction")}</p>
                  </div>
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                  </Box>
                  {/* <p className="title">Warning subtitle</p> */}
                </div>
              </section>
            {/* <div className="box">
              <table className="table fullWidth table-hover-select table-striped">
                <thead className="ng-scope">
                  <tr className="ng-table-sort-header">
                    {PARTS_MANAGER_MAIN_HEADER.map((item, index) => {
                      return (
                        <th key={index}>
                          <div>
                            <span>{item}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {partsData &&
                    partsData !== null &&
                    partsData.map((element, index) => {
                      return (
                        <tr className="pointer" key={index}>
                          <td>{element && element.code && element.code}</td>
                          <td>
                            {element && element.provider && element.provider}
                          </td>
                          <td>
                            {element &&
                            element.stock_cargo &&
                            element.stock_cargo ? (
                              <p>
                                {element &&
                                  element.stock_cargo &&
                                  element.stock_cargo}
                              </p>
                            ) : null}
                          </td>
                          <td>
                            {element &&
                            element.stock_provider &&
                            element.stock_provider ? (
                              <p style={{ color: "gray" }}>
                                {element &&
                                  element.stock_provider &&
                                  element.stock_provider}
                              </p>
                            ) : null}
                          </td>
                          <td className="is-flex is-justify-content-center" onClick={(event) => handleClickRSVP(element)}>
                            <i
                              className="fa fa-2x fa-plus-square-o"
                              style={{ color: "green" }}
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div> */}
          </animated.div>
          {/* <LoadingIcon loading={isLoading} /> */}
        </div>
        <FooterNavBar />
      </div>
    </animated.div>
  );
};

PartsManager.displayName = PartsManager;
export default PartsManager;
