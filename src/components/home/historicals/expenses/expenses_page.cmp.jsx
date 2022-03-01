import React, { useEffect, useState } from "react";
import VehicleExpensesTableItem from "./expenses_talbe_item.cmp";
// import appServices from "../../../appServices.service";

const ExpensesComponent = (props) => {
  const [vehicleExpenses, setVehicleExpenses] = useState(null);
  const vehicleId = sessionStorage.getItem("currentAssignmentId");

  useEffect(() => {
    vehicleId &&
      vehicleId &&
      vehicleId !== null &&
      getVehicleExpenses(vehicleId);
  }, [vehicleId]);

  const getVehicleExpenses = () => {
    // console.log("GETTING VEHICLE EXPENSES :>> ");
    // if (id && id !== null && id !== undefined) {
    //   appServices.getVehicleExpenses(id).then((data) => {
    //     setVehicleExpenses(data.json.vehicle_fuels);
    //   });
    // }
  };

  const goToVehicle = () => {
    vehicleId &&
      vehicleId !== null &&
      props.history.push({
        pathname: `/home/vehicle/data/${vehicleId}`,
      });
  };

  const goToAddExpenses = () => {
    vehicleId &&
      vehicleId !== null &&
      props.history.push({
        pathname: `/home/expenses/add`,
      });
  };

  const GoHome = () => {
    props.history.push({
      pathname: `/home`,
    });
  };

  const TABLE_EXPENSES_CARDS_HEAD = ["Coste", "Producto", "Fecha"];

  return (
    <>
      <div>
        <p className="title is-4 my-3">Hist Gastos</p>
        <p className="title is-6">vehicleId: {vehicleId && vehicleId}</p>
      </div>
      {/* <div className="is-fab has-content-right">
        <button className="button is-redAmac_GoHome is-rounded" onClick={GoHome}>
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
          <button className="button" onClick={goToAddExpenses}>
            <span>Añadir Lectura</span>
          </button>
        </p>
      </div>
      <div className="box">
        <table className="table is-striped is-responsive">
          <thead>
            <tr>
              {TABLE_EXPENSES_CARDS_HEAD.map((item) => {
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
                {vehicleExpenses &&
                  vehicleExpenses !== null &&
                  vehicleExpenses.length > 0 &&
                  vehicleExpenses[0] &&
                  vehicleExpenses.map((item) => (
                    <VehicleExpensesTableItem key={item.id} item={item} />
                  ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExpensesComponent;
