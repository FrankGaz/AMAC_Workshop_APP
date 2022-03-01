import React, { useEffect, useState } from "react";
import appServices from "../../../appServices.service";
import VehicleFuelsTableItem from "./fuel_table_item.cmp";

const FuelComponent = (props) => {
  const [vehicleFuels, setVehicleFuels] = useState(null);
  const vehicleId = sessionStorage.getItem("currentAssignmentId");

  useEffect(() => {
    vehicleId &&
    vehicleId && vehicleId !== null && getVehicleFuels(vehicleId);
  }, [vehicleId]);

  const getVehicleFuels = (id) => {
    if (id && id !== null && id !== undefined) {
      appServices.getVehicleFuels(id).then((data) => {
        setVehicleFuels(data.json.vehicle_fuels);
      });
    }
  };

  const goToVehicle = () => {
    vehicleId &&
      vehicleId !== null &&
      props.history.push({
        pathname: `/home/vehicle/data/${vehicleId}`,
      });
  };

  const goToAddFuel = () => {
    vehicleId &&
      vehicleId !== null &&
      props.history.push({
        pathname: `/home/fuel/add`,
      });
  };

  const GoHome = () => {
    props.history.push({
      pathname: `/home`,
    });
  };

  const TABLE_FUEL_CARDS_HEAD = ["Producto", "Fecha", "Coste"];

  return (
    <>
      <div>
        <p className="title is-4">Hist Combustible</p>
        <p className="title is-6">vehicleId: {vehicleId && vehicleId}</p>
      </div>
      {/* <div className="is-fab has-content-right">
        <button
          className="button is-redAmac_GoHome is-rounded"
          onClick={GoHome}
        >
          <span className="icon">
            <i className="fas fa-home"></i>
          </span>
        </button>
      </div> */}
      <div className="field has-addons mt-3">
        <p className="control">
          <button className="button" onClick={goToVehicle}>
            <span>Volver a Vehículo</span>
          </button>
        </p>
        <p className="control">
          <button className="button" onClick={goToAddFuel}>
            <span>Añadir Lectura</span>
          </button>
        </p>
      </div>
      <div className="box">
        <table className="table is-striped is-responsive">
          <thead>
            <tr>
              {TABLE_FUEL_CARDS_HEAD.map((item) => {
                return (
                  <th title="" key={item}>
                    <div>
                      <span>{item}</span>
                    </div>
                  </th>
                );
              })}
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {vehicleFuels &&
                  vehicleFuels !== null &&
                  vehicleFuels.length > 0 &&
                  vehicleFuels[0] &&
                  vehicleFuels.map((item) => (
                    <VehicleFuelsTableItem key={item.id} item={item} />
                  ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FuelComponent;

// getVehicleFuel
