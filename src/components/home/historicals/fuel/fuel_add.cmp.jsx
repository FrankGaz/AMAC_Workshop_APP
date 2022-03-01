import React from "react";

const FuelAddComponent = (props) => {

  const vehicleId = sessionStorage.getItem("currentAssignmentId");

  const goToFuel = () => {
    vehicleId &&
      vehicleId !== null &&
      props.history.push({
        pathname: `/home/fuel`,
      });
  };

  return (
    <>
      <div>
        <h2>Fuel Add Screen</h2>
      </div>
      <button onClick={goToFuel}>GoBack</button>
      {/* <div>
          <input type="date">Fecha</input>
          <input>Product Kind</input>
          <input type="number">Fuel Cost</input>
        <button>Añadir</button>
      </div> */}
    </>
  );
};

export default FuelAddComponent;