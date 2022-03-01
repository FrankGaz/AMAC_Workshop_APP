import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logic from "../../../logic/logic";
import appServices from "../../appServices.service";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import useModal from "../../reusableComponents/modals/useModal";

const VehicleItvRevisions = (props) => {
  const { t } = useTranslation();
  const [itvRevisionsList, setItvRevisionsList] = useState(null);
  const [itvRevisionsDonesList, setItvRevisionsDonesList] = useState(null);
  const { isShowing, toggle } = useModal();
  const [modalMessage, setModalMessage] = useState(null);
  const [modalKind, setModalKind] = useState(null);

  const vehicleData = JSON.parse(sessionStorage.getItem("currentVehicleData"));

  useEffect(() => {
    if (vehicleData && vehicleData !== undefined && vehicleData !== null && vehicleData.id) {
      getItvRevisionsDones(vehicleData && vehicleData.id);
      getItvRevisions(vehicleData && vehicleData.id);
    }
  }, [vehicleData]);

  const getItvRevisionsDones = (id) => {

    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    id &&
      id !== undefined &&
      appServices
        .getVehicleItvRevisionsDones(id)
        .then((res) => {
          setItvRevisionsDonesList(res.json.vehicle_itv_group_dones);
        })
        .catch((err) => {
          setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const getItvRevisions = (id) => {

    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    id &&
      id !== undefined &&
      appServices
        .getVehicleItvRevisions(id)
        .then((res) => {
          setItvRevisionsList(res.json.vehicle_itv_group);
        })
        .catch((err) => {
          setModalKind("Error");
        err && err.message && toggle(setModalMessage(err.message));
        err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };


  const VEHICLE_ITV_GROUP_DONES_HEADER = ["Fecha ITV", "Estado", "Km"];


  return (
    <div className="page-content">
       <ModalNotification
          isShowingModalNotification={isShowing}
          hide={toggle}
          modalTitle={modalMessage || "Error"}
          modalKind={modalKind || "Error"}
        />
      <div>
        <section>
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
        </section>
        {/* <div>
          <div className="col-md-12 mtop" style={{ marginBottom: "25px" }}>
            <h1>
              <span> {vehicleData && vehicleData.registration && vehicleData.registration}</span>
            </h1>
            <img
              className="img-header-vehicle-info"
              src={
                vehicleData && vehicleData.photo_url_thumb && vehicleData.photo_url_thumb ||
                "https://amac-renting.s3.amazonaws.com/vehicles/photos/medium.missing.png"
              }
              alt="car"
            />
          </div>
        </div> */}

        {itvRevisionsList && itvRevisionsList.id && (
          <div className="box">
            <div className="field">
              <p className="label textGrey">
                <b className="textBlack">{t("itv_group_date")}: </b>
                {itvRevisionsList &&
                  itvRevisionsList.itv_group_date &&
                  itvRevisionsList.itv_group_date}
              </p>
            </div>
            <div className="field">
              <p className="label textGrey">
                <b className="textBlack">{t("itv_group")}: </b>
                {itvRevisionsList &&
                  itvRevisionsList.itv_group &&
                  itvRevisionsList.itv_group.name &&
                  itvRevisionsList.itv_group.name}
              </p>
            </div>
            <div className="field">
              <p className="label textGrey">
                <b className="textBlack">{t("vehicle_kind")}: </b>
                {itvRevisionsList &&
                  itvRevisionsList.itv_group &&
                  itvRevisionsList.itv_group.vehicle_kind &&
                  itvRevisionsList.itv_group.vehicle_kind.name &&
                  itvRevisionsList.itv_group.vehicle_kind.name}
              </p>
            </div>
          </div>
        )}

        <div className="box">
          <table className="table fullWidth table-hover-select table-striped">
            <thead className="ng-scope">
              <tr className="ng-table-sort-header">
                {VEHICLE_ITV_GROUP_DONES_HEADER.map((item, index) => {
                  return <th key={index}>{item}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {itvRevisionsDonesList &&
                itvRevisionsDonesList.length > 0 &&
                itvRevisionsDonesList.map((element, index) => {
                  return (
                    <tr className="pointer" key={index}>
                      <td>
                        {element &&
                          element.itv_group_date &&
                          element.itv_group_date}
                      </td>
                      <td>
                        {element &&
                          element.vehicle_itv_group_state &&
                          element.vehicle_itv_group_state.name &&
                          element.vehicle_itv_group_state.name}
                      </td>
                      <td></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* <LoadingIcon loading={isLoading} /> */}
      </div>
      <FooterNavBar />
    </div>
  );
};
VehicleItvRevisions.displayName = VehicleItvRevisions;
export default VehicleItvRevisions;
