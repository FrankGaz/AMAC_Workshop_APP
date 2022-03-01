import React, { useState, useEffect } from "react";
import appServices from "../../appServices.service";
import VehicleDocumentationTableItem from "./documentation_table_item.cmp";

const DocumentationComponent = (props) => {

  const vehicleId = sessionStorage.getItem("currentAssignmentId");
  const [documentationData, setDocumentationData] = useState(null);
  const TABLE_DOCUMENTATION_HEAD = ["Fecha", "Nombre"];

  useEffect(() => {
    vehicleId && getDocumentsList();
  }, [vehicleId]);

  const getDocumentsList = () => {
    vehicleId &&
      appServices.getDocumentsList(vehicleId).then((data) => {
        data &&
          data.json &&
          data.json.vehicle_files &&
          setDocumentationData(data.json.vehicle_files);
      });
  };

  return (<>
  <div>Document List</div>
  <div className="box">
        <table className="table is-striped is-responsive">
          <thead>
            <tr>
              {TABLE_DOCUMENTATION_HEAD.map((item) => {
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
                {documentationData &&
                  documentationData !== null &&
                  documentationData.length > 0 &&
                  documentationData[0] &&
                  documentationData.map((item) => (
                    <VehicleDocumentationTableItem key={item.id} item={item} />
                  ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </>);
};

export default DocumentationComponent;
