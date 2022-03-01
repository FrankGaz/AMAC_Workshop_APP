import React from "react";

const VehicleDocumentationTableItem = ({item}) => {

  
    return (
      <tr key={item.id}>
        <td>{(item && item.data_file) || ''}</td>
        <td>{(item && item.name) || ''}</td>
        {/* <td>{(item && item.input_date) || ''}</td> */}
      </tr>
    );
  };

  export default VehicleDocumentationTableItem;