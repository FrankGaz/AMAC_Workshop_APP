import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ShowAssignment = ({ showAssignment, doGoToAssignment }) => {
  //   const { t } = useTranslation();

  const [registration, setRegistration] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleBrand, setVehicleBrand] = useState(null);
  const [vehicleModel, setVehicleModel] = useState(null);

  useEffect(() => {
    if (
      showAssignment &&
      showAssignment.entity_job &&
      showAssignment.entity_job.registration &&
      showAssignment.entity_job.registration !== null
    ) {
      setRegistration(showAssignment.entity_job.registration);
      setVehicleId(showAssignment.entity_job.id);
      setVehicleImage(showAssignment.entity_job.photo_url_thumb);

      if(showAssignment.entity_job.brand && showAssignment.entity_job.brand.name){
        setVehicleBrand(showAssignment.entity_job.brand.name);
      }else{
        setVehicleBrand("Brand");
      }
      
      if(showAssignment.entity_job.model && showAssignment.entity_job.model.name){
        setVehicleModel(showAssignment.entity_job.model.name);
      }else{
        setVehicleModel("Model");
      }
    }
  }, [showAssignment]);

  const handleGoToVehicleData = (item) => {
    const itemToGo = item;
    doGoToAssignment(itemToGo);
  };

  return (
    <>
      {registration && (
        <div className="card home-slider my-2" style={{maxWidth:"150px"}}>
          {vehicleId && (
            <a
              className="textGrey"
              onClick={() => handleGoToVehicleData(vehicleId)}
            >
              <div className="card-image">
                <figure className="image is-square">
                  <img
                    src={
                      vehicleImage ||
                      "https://amac-renting.s3.amazonaws.com/vehicles/photos/thumb.missing.png"
                    }
                  />
                </figure>
              </div>
              <div className="card-header grey_box_center">
                <div className="card-header-title pb-0">
                  {/* <FontAwesomeIcon icon="car" className="mr-2 textRedAmac" /> */}
                  <p>{registration}</p>
                </div>

                
              </div>
              <div className="card-header grey_box_center ">
                  <div className="card-header-title textGrey pt-0">
                    <span className="mr-2 is-size-6">{vehicleBrand}</span>
                    <span className="is-size-7">{vehicleModel}</span>
                  </div>
                </div>
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default ShowAssignment;
