import React, { useEffect, useState } from "react";
import appServices from "../../appServices.service";
import FieldInput from "../../reusableComponents/fieldInput";
import useIsValid from "../../../hooks/useIsValid.hook";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VehicleDataComponent = (props) => {
  const [vehicleData, setVehicleData] = useState(null);
  const [vehicleKilometers, setVehicleKilometers] = useState(null);
  const [vehicleTechnicalData, setVehicleTechnicalData] = useState(null);
  const [userData, setUserData] = useState(null);
  const { handleIsValid, activateActionButton } = useIsValid();
  const [driverName, setDriverName] = useState("");
  const [driverLastName, setDriverLastName] = useState("");
  // const [viewKilometersLimit, setViewKilometersLimit] = useState(null);

  const assignmentId = sessionStorage.getItem("currentAssignmentId");
  // const userId = sessionStorage.getItem("gloveBoxDataSet");

  // useEffect(() => {
  //   assignmentId && assignmentId !== null && getVehicleData(assignmentId);
  //   assignmentId && assignmentId !== null && getKilometers(assignmentId);
  // }, [vehicleId]);

  // useEffect(() => {
  //   userId && userId !== null && setUserData(sessionStorage.getItem("userData"));
  // }, [userId]);

  const getVehicleData = (id) => {
    if (id && id !== null && id !== undefined) {
      appServices.getVehicleData(id).then((data) => {
        data &&
          data.json &&
          data.json.vehicle &&
          setVehicleData(data.json.vehicle);
        appServices.getVehicleTechData(id).then((data) => {
          data &&
            data.json &&
            data.json.vehicle_technical_datum &&
            setVehicleTechnicalData(data.json.vehicle_technical_datum);
        });
      });
    }
  };

  // const getUserData = (id) => {
  //   if (id && id !== null && id !== undefined) {
  //     appServices.getUser(id).then((data) => {
  //       data && data.json && data.json.user && setUserData(data.json.user);
  //     });
  //   }
  // };

  // useEffect(() => {
  //   const DName = userData && userData.person && userData.person.first_name;
  //   if (DName) {
  //     setDriverName(DName);
  //   }
  // }, [driverName]);

  // useEffect(() => {
  //   const DLName = userData && userData.person && userData.person.last_name;
  //   if (DLName) {
  //     setDriverLastName(DLName);
  //   }
  // }, [driverLastName]);


  const getKilometers = (id) => {
    if (id && id !== null && id !== undefined) {
      appServices.getVehicleKilometers(id).then((data) => {
        orderByDate(data);
        // setVehicleKilometers(data.json.vehicle_kilometers);
      });
    }
  };

  const orderByDate = (data) => {
    let byDate = data.json.vehicle_kilometers;

    if (byDate.length > 0) {
      const ordered = byDate.sort(function (a, b) {
        return new Date(a.input_date) - new Date(b.input_date);
      });
      toLast(ordered.reverse());
    } else {
      setVehicleKilometers(0);
    }
  };

  // sets last kilometer state
  const toLast = (data) => {
    getLastKilometer(data);
  };

  const getLastKilometer = (data) => {
    setVehicleKilometers(Number(data[0].kilometers));
  };

  const GoHome = () => {
    props.history.push({
      pathname: `/home`,
    });
  };

  const goToExpensesComponent = () => {
    props.history.push({
      pathname: `/home/expenses`,
    });
  };
  const goToFuelComponent = () => {
    props.history.push({
      pathname: `/home/fuel`,
    });
  };
  const goToViewInsurance = () => {
    props.history.push({
      pathname: `/home/documentation`,
    });
  };
  const goToViewTechnicalData = () => {
    props.history.push({
      pathname: `/home/documentation`,
    });
  };
  const goToViewPermission = () => {
    props.history.push({
      pathname: `/home/documentation`,
    });
  };

  return (
    <>
      <div>
        <p className="title is-4 my-3">Datos del vehículo</p>
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

      {vehicleData && vehicleData && (
        <div className="card accordionCar mt-3">
          <div className="card-image is-fullwidth">
            <div className="image is-fullwidth">
              <img
                src={
                  (vehicleData && vehicleData.photo_url_thumb) ||
                  "https://amac-renting.s3.amazonaws.com/vehicles/photos/thumb.missing.png"
                }
              />
            </div>
          </div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className="is-flex is-flex-direction-row is-align-items-center">
                <FontAwesomeIcon icon="user" className="textRedAmac mr-2" />
                <strong>Titular del Vehículo</strong>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {/* <p>
                Titular:{" "}
                {userData && userData.person && userData.person.first_name}{" "}
                {userData && userData.person && userData.person.last_name}
              </p> */}
              <div className="my-3">
                <FieldInput
                  input={
                    userData && userData.person && userData.person.first_name
                  }
                  name="Titular"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <input className="input" type="text" placeholder="Titular:">
                Titular
              </input> */}
              {/* <p>
                CIF/DNI:{" "}
                {userData &&
                  userData.person &&
                  userData.person.legal_identifier}
              </p> */}
              <div className="my-3">
                <FieldInput
                  input={
                    userData &&
                    userData.person &&
                    userData.person.legal_identifier
                  }
                  name="CIF/DNI"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>
                Municipio Fiscal:{" "}
                {userData && userData.person && userData.person.address}{" "}
                {userData &&
                  userData.person &&
                  userData.person.personal_address}
              </p> */}
              <div className="my-3">
                <FieldInput
                  input={
                    userData &&
                    userData.person &&
                    userData.person.personal_address
                  }
                  name="Municipio Fiscal"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className="is-flex is-flex-direction-row is-align-items-center">
                <FontAwesomeIcon icon="file-alt" className="textRedAmac mr-2" />
                <strong>Ficha Técnica</strong>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {/* <p>
                Marca:{" "}
                {vehicleData && vehicleData.brand && vehicleData.brand.name}
              </p> */}
              <div className="my-3">
                <FieldInput
                  input={
                    vehicleData && vehicleData.brand && vehicleData.brand.name
                  }
                  name="Marca"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>
                Modelo:{" "}
                {vehicleData && vehicleData.model && vehicleData.model.name}
              </p> */}
              <div className="my-3">
                <FieldInput
                  input={
                    vehicleData && vehicleData.model && vehicleData.model.name
                  }
                  name="Modelo"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Bastidor: 183674645893</p> */}
              <div className="my-3">
                <FieldInput
                  input={vehicleData && vehicleData.chassis}
                  name="Bastidor"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Carburante: Gasolina</p> */}
              <div className="my-3">
                <FieldInput
                  input={"Gasolina"}
                  name="Carburante"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Cilindrada: 1300</p> */}
              <div className="my-3">
                <FieldInput
                  input={"1300"}
                  name="Cilindrada"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Fecha Matriculación: 01-01-2016</p> */}
              <div className="my-3">
                <FieldInput
                  input={"01-05-2016"}
                  name="Fecha Matriculación"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Distintivo Ambiental: C</p> */}
              <div className="my-3">
                <FieldInput
                  input={"C"}
                  name="Distintivo Ambienta"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              <div className="card-footer field has-addons mt-3">
                <button
                  className="card-footer-item buttonAccordion buttonAccordion_left"
                  onClick={goToViewTechnicalData}
                >
                  Ver Ficha Técnica
                </button>
                <button
                  className="card-footer-item buttonAccordion buttonAccordion_right"
                  onClick={goToViewPermission}
                >
                  Ver Permiso Circulación
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className="is-flex is-flex-direction-row is-align-items-center">
                <FontAwesomeIcon icon="tools" className="textRedAmac mr-2" />
                <strong>ITV</strong>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {/* <p>Fecha ITV: 17-05-2021</p> */}
              <div className="my-3">
                <FieldInput
                  input={"17-05-2021"}
                  name="Fecha ITV"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Kilómetros: {vehicleKilometers && vehicleKilometers}</p> */}
              <div className="my-3">
                <FieldInput
                  input={vehicleKilometers && vehicleKilometers}
                  name="Kilómetros"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Fecha Próxima ITV: 17-05-2022</p> */}
              <div className="my-3">
                <FieldInput
                  input={"17-05-2022"}
                  name="Fecha Próxima ITV"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className="is-flex is-flex-direction-row is-align-items-center">
                <FontAwesomeIcon
                  icon="car-crash"
                  className="textRedAmac mr-2"
                />
                <strong>Entidad Aseguradora</strong>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {/* <p>Enitdad Aseguradora: Catalan Occidente</p> */}
              <div className="my-3">
                <FieldInput
                  input={"Catalan Occidente"}
                  name="Enitdad Aseguradora"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Nº Póliza: 1893-1835-4731-9903-78</p> */}
              <div className="my-3">
                <FieldInput
                  input={"1893-1835-4731-9903-78"}
                  name="Nº Póliza"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Fecha Inicio: 21-05-2021</p> */}
              <div className="my-3">
                <FieldInput
                  input={"21-05-2021"}
                  name="Fecha Inicio"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              {/* <p>Fecha Fin: Fecha Fin</p> */}
              <div className="my-3">
                <FieldInput
                  input={"Fecha Fin"}
                  name="Fecha Fin"
                  maxLength={76}
                  isRequired={false}
                  isValid={handleIsValid}
                  columnSize={11}
                  hasActivator={false}
                  activator={false}
                  //doModalClick={() => breakdownsModal.openModal()}
                  //doInputCheck={handleServiceBreakdownsSelectChange}
                  withLabel={true}
                ></FieldInput>
              </div>
              <div className="card-footer field has-addons mt-3">
                <button
                  className="card-footer-item buttonAccordion buttonAccordion_center"
                  onClick={goToViewInsurance}
                >
                  Ver Póliza de Seguro
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
          {/* <p>Observations: {vehicleData && vehicleData.zone && vehicleData.zone.name}</p> */}
          <div className="card-footer field has-addons">
            <button
              className="card-footer-item buttonFooter buttonFooter_left"
              onClick={goToFuelComponent}
            >
              Go To Historico Combustible
            </button>
            <button
              className="card-footer-item buttonFooter buttonFooter_right"
              onClick={goToExpensesComponent}
            >
              Go To Historico Gastos
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleDataComponent;
