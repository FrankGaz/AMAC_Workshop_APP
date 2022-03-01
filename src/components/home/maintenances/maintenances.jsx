import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useModal from "../../reusableComponents/modals/useModal";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import logic from "../../../logic/logic";
import appServices from "../../appServices.service";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";

const VehicleMaintenances = (props) => {
  // translation hook from the ReactI18next library
  const { t } = useTranslation();

  const history = useHistory();
  const [modalMessage, setModalMessage] = useState(null);
  const [modalKind, setModalKind] = useState(null);
  const { isShowing, toggle } = useModal();
  const [maintenancesList, setMaintenancesList] = useState(null);
  const [maintenancesDonesList, setMaintenancesDonesList] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);

  const vehicleId = sessionStorage.getItem("currentVehicleId");

  useEffect(() => {
    if (vehicleId !== undefined && vehicleId !== null) {
      getMaintenancesDones(vehicleId);
      getMaintenances(vehicleId);
      setVehicleData(JSON.parse(sessionStorage.getItem("currentVehicleData")));
    }
  }, [vehicleId]);

  const getMaintenancesDones = (id) => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    id &&
      id !== undefined &&
      appServices
        .getVehicleMaintenancesDones(id)
        .then((res) => {
          setMaintenancesDonesList(res.json.vehicle_maintenance_dones);
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const getMaintenances = (id) => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    id &&
      id !== undefined &&
      appServices
        .getVehicleMaintenances(id)
        .then((res) => {
          setMaintenancesList(res.json.vehicle_maintenances);
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const MAINTENANCES_HEADER = ["Mant.", "Fecha", "Km"];

  return (
    <>
      <div>
        <ModalNotification
          isShowingModalNotification={isShowing}
          hide={toggle}
          modalTitle={modalMessage || "Error"}
          modalKind={modalKind}
        />
        
          <div className="card mb-4">
            <div className="card-image">
              <figure className="image is-4by3">
                <img
                  src={
                    (vehicleData &&
                      vehicleData.photo_url_medium &&
                      vehicleData.photo_url_medium) ||
                    "https://amac-renting.s3.amazonaws.com/vehicles/photos/medium.missing.png"
                  }
                  alt="Vehicle Image"
                ></img>
              </figure>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content">
                  <p className="title is-4 textGrey">
                    {vehicleData && vehicleData.registration}
                  </p>
                  <p className="subtitle is-6 textGrey">
                    {(vehicleData &&
                      vehicleData.brand &&
                      vehicleData.brand.name) ||
                      "n/a"}{" "}
                    {(vehicleData &&
                      vehicleData.model &&
                      vehicleData.model.name) ||
                      "n/a"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        

        <div className="box">
          <div className="label textGrey">Mantenimientos Programados</div>
          <div>
            <table className="table fullWidth table-hover-select table-striped">
              <thead className="ng-scope">
                <tr className="ng-table-sort-header">
                  {MAINTENANCES_HEADER.map((item, index) => {
                    return <th key={index}>{item}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {maintenancesList &&
                  maintenancesList.map((element, index) => {
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
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="box">
          <div className="label textGrey">Histórico de Mantenimientos</div>
          <div>
            <table className="table fullWidth table-hover-select table-striped">
              <thead className="ng-scope">
                <tr className="ng-table-sort-header">
                  {MAINTENANCES_HEADER.map((item, index) => {
                    return <th key={index}>{item}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {maintenancesDonesList &&
                  maintenancesDonesList.map((element, index) => {
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
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FooterNavBar />
    </>
  );
};

VehicleMaintenances.displayName = VehicleMaintenances;
export default VehicleMaintenances;
