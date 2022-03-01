import React from "react";

const ExpensesAddComponent = (props) => {

  const vehicleId = sessionStorage.getItem("currentAssignmentId");

  const goToExpenses = () => {
    vehicleId &&
      vehicleId !== null &&
      props.history.push({
        pathname: `/home/expenses`,
      });
  };

  return (
    <>
      <div>
        <h2>Expenses Add Screen</h2>
      </div>
      <button onClick={goToExpenses}>GoBack</button>
      {/* <div>
        <form>
          <input type="date">Fecha</input>
          <input>Product Kind</input>
          <input type="number">Cost</input>
        </form>
        <button>Añadir</button>
      </div> */}
    </>
  );
};

export default ExpensesAddComponent;