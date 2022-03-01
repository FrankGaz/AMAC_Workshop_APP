import React from "react";

const VehicleFuelsTableItem = ({ item }) => {

  return (
    <tr key={item.id}>
      <td>
        {(item &&
          item.fuel_card_product_kind &&
          item.fuel_card_product_kind.name) ||
          ""}
      </td>
      <td>{(item && item.input_date) || ""}</td>
      <td>{(item && item.amount) || ""}</td>
    </tr>
  );
};

export default VehicleFuelsTableItem;
