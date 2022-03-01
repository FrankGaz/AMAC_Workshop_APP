import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import VehicleSearchBox from "../vehicle/vehicle_searchbox";
import { useSpring, animated } from "react-spring";
// import vehicleApiService from "./vehicle.service";
import { templateQueryParameters } from "../../../logic/queryParams";
import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";
import Label from "../../reusableComponents/label";
// import VehicleTyres from "./vehicle-tyres";
import logic from "../../../logic/logic";
import appServices from "../../appServices.service";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import Modal from "../../reusableComponents/modals/modal.cmp";
import useModal from "../../reusableComponents/modals/useModal";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";

const VehicleMaintenancesManager = (props) => {
  // translation hook from the ReactI18next library
  const { t } = useTranslation();
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
  const { isShowing, toggle } = useModal();
  const action = useConfirmActionMessage();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const [maintenancesPrevision, setMaintenancesPrevision] = useState(null);
  const [showThereIsNothingToShow, setShowThereIsNothingToShow] =
    useState(false);

  useEffect(() => {
    setCompanyData(JSON.parse(sessionStorage.getItem("userCompany")));
  }, []);

  // Function that handles the search box
  const handleSearchClick = (searchParams) => {
    if (!searchParams || searchParams.registration === null) {
      setMaintenancesPrevision(null);
    } else {
      const query = {
        method: "GET",
        vehicle_vehicle_state_name_not_eq: "Cancelado",
        vehicle_registration_cont: searchParams && searchParams.registration,
        vehicle_fleet_company_id_eq: companyData && companyData.id,
        page: 1,
        per_page: 9999,
      };

      logic.configureQueryParameters({ ...query });

      appServices
        .getVehicleMaintenancesPrevision()
        .then((res) => {
          res &&
            res.json &&
            res.json.vehicle_maintenance_dones &&
            setMaintenancesPrevision(res.json.vehicle_maintenance_dones);
          res &&
            res.json &&
            res.json.vehicle_maintenance_dones &&
            res.json.vehicle_maintenance_dones.length == "0" &&
            setShowThereIsNothingToShow(true);
          res &&
            res.json &&
            res.json.vehicle_maintenance_dones &&
            res.json.vehicle_maintenance_dones.length > 0 &&
            setShowThereIsNothingToShow(false);
        })
        .catch((err) => {
          err && err.message && setShowThereIsNothingToShow(true);
        });
    }
  };

  const handleClearSearch = () => {
    setShowThereIsNothingToShow(false);
  };

  const maintenance_states = [
    { id: 1, name: "Pendiente" },
    { id: 2, name: "Avisado" },
    { id: 3, name: "Ignorado" },
    { id: 4, name: "Completado" },
  ];

  //   const goToVehicleItvRevisions = () => {
  //     sessionStorage.setItem("currentVehicleId", units.id);
  //     sessionStorage.setItem("currentVehicleData", JSON.stringify(units));
  //     props.history.push({
  //       pathname: `/home/itv`,
  //     });
  //   };

  const openMaintenanceStateModal = () => {
    //   sessionStorage.setItem("currentVehicleData", JSON.stringify(units));
    //   sessionStorage.setItem("currentVehicleId", units.id);
    //   props.history.push({
    //     pathname: `/home/maintenances`,
    //   });
  };

  // const modalBody = () => {
  //   return <p>Elige el estado</p>;
  // };

  const handleChangeMainenanceStatus = () => {
    // console.log("CLICK @ handleChangeMainenanceStatus :>> ");
  };

  const dummyTableData = [
    {
      maintenance_kind: { name: "RVTG_4" },
      maintenance_date: "10/12/2021",
      maintenance_km: null,
      vehicle_maintenance_state: { name: "Pendiente" },
    },
    {
      maintenance_kind: { name: "RVTG_3" },
      maintenance_date: "16/09/2021",
      maintenance_km: null,
      vehicle_maintenance_state: { name: "Avisado" },
    },
    {
      maintenance_kind: { name: "RVTG_2" },
      maintenance_date: "11/05/2021",
      maintenance_km: 123498,
      vehicle_maintenance_state: { name: "Completado" },
    },
    {
      maintenance_kind: { name: "RVTG_1" },
      maintenance_date: "21/02/2021",
      maintenance_km: 110050,
      vehicle_maintenance_state: { name: "Completado" },
    },
    {
      maintenance_kind: { name: "RVTG_4" },
      maintenance_date: "19/12/2021",
      maintenance_km: 99319,
      vehicle_maintenance_state: { name: "Completado" },
    },
    {
      maintenance_kind: { name: "RVTG_3" },
      maintenance_date: "05/09/2021",
      maintenance_km: 80998,
      vehicle_maintenance_state: { name: "Completado" },
    },
    {
      maintenance_kind: { name: "RVTG_2" },
      maintenance_date: "29/05/2021",
      maintenance_km: 71002,
      vehicle_maintenance_state: { name: "Completado" },
    },
    {
      maintenance_kind: { name: "RVTG_1" },
      maintenance_date: "10/02/2021",
      maintenance_km: 47310,
      vehicle_maintenance_state: { name: "Completado" },
    },
  ];

  const MAINTENANCES_MANAGER_HEADER = ["Manten.", "Fecha", "Km", ""];

  // End search box functions
  return (
    <animated.div style={springProps}>
      <div className="page-content">
        <animated.div style={springPropsContent}>
          <div>
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
            <div>
              {/* <VehicleSearchBox
                doRequestSearch={handleSearchClick}
                clearSearch={handleClearSearch}
              ></VehicleSearchBox> */}
            </div>

            {/* <LoadingIcon loading={isLoading} /> */}

            {maintenancesPrevision &&
              (maintenancesPrevision !== null) &
                (maintenancesPrevision !== undefined) &&
              maintenancesPrevision.length > 0 && (
                <animated.div style={springPropsTable}>
                  <Modal
                    isShowing={isShowing}
                    hide={toggle}
                    isSaveData={true}
                    // modalBody={modalBody()}
                    modalTitle="Cambiar estado del mantenimiento"
                    maintenance_states={maintenance_states}
                    onClickSave={handleChangeMainenanceStatus}
                  />
                  <div className="box maintenancesBoxTable">
                    <div className="field">
                      <table className="table fullWidth table-hover-select table-striped">
                        <thead className="ng-scope">
                          <tr className="ng-table-sort-header">
                            {MAINTENANCES_MANAGER_HEADER.map((item, index) => {
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
                          {/* {maintenancesPrevision &&
                            maintenancesPrevision.map((element, index) => { */}
                          {dummyTableData &&
                            dummyTableData.map((element, index) => {
                              return (
                                <tr className="pointer" key={index}>
                                  <td>
                                    {element &&
                                      element.maintenance_kind &&
                                      element.maintenance_kind.name &&
                                      element.maintenance_kind.name}
                                  </td>
                                  <td>
                                    {(element &&
                                      element.maintenance_date &&
                                      element.maintenance_date) ||
                                      "---"}
                                  </td>
                                  <td>
                                    {(element &&
                                      element.maintenance_km &&
                                      element.maintenance_km) ||
                                      "---"}
                                  </td>
                                  {element &&
                                    element.vehicle_maintenance_state &&
                                    element.vehicle_maintenance_state.name &&
                                    element.vehicle_maintenance_state.name ===
                                      "Pendiente" && (
                                      <td>
                                        <span
                                          className="tag is-danger"
                                          // onClick={toggle}
                                          // onClick={openMaintenanceStateModal(
                                          //   element.id
                                          // )}
                                        >
                                          {element &&
                                            element.vehicle_maintenance_state &&
                                            element.vehicle_maintenance_state
                                              .name &&
                                            element.vehicle_maintenance_state
                                              .name}
                                        </span>
                                      </td>
                                    )}
                                  {element &&
                                    element.vehicle_maintenance_state &&
                                    element.vehicle_maintenance_state.name &&
                                    element.vehicle_maintenance_state.name ===
                                      "Avisado" && (
                                      <td>
                                        <span className="tag is-warning">
                                          {element &&
                                            element.vehicle_maintenance_state &&
                                            element.vehicle_maintenance_state
                                              .name &&
                                            element.vehicle_maintenance_state
                                              .name}
                                        </span>
                                      </td>
                                    )}
                                  {element &&
                                    element.vehicle_maintenance_state &&
                                    element.vehicle_maintenance_state.name &&
                                    element.vehicle_maintenance_state.name ===
                                      "Completado" && (
                                      <td>
                                        <span className="tag is-success">
                                          {element &&
                                            element.vehicle_maintenance_state &&
                                            element.vehicle_maintenance_state
                                              .name &&
                                            element.vehicle_maintenance_state
                                              .name}
                                        </span>
                                      </td>
                                    )}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </animated.div>
              )}
            {showThereIsNothingToShow && showThereIsNothingToShow === true && (
              <div>
                <p className="is-size-6 textGrey is-align-items-center">
                  No hay datos para mostrar
                </p>
              </div>
            )}
          </div>
        </animated.div>
        <FooterNavBar />
      </div>
    </animated.div>
  );
};

VehicleMaintenancesManager.displayName = VehicleMaintenancesManager;
export default VehicleMaintenancesManager;
