import React, { useEffect, useState } from "react";
// import appServices from "../appServices.service";
// import ShowAssignment from "../reusableComponents/showAssignment.cmp";
// import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import appServices from "../appServices.service";
import { useSpring, animated } from "react-spring";
// import useModalInput from "../reusableComponents/modals/useModalInput";
// import ModalInput from "../reusableComponents/modals/modalInput.cmp";
// import useModalInOut from "../reusableComponents/modals/useModalInOut";
// import ModalInOut from "../reusableComponents/modals/modalInOut.cmp";
// import useModalRadioThree from "../reusableComponents/modals/useModalRadioThree";
// import ModalRadioThree from "../reusableComponents/modals/modalRadioThree.cmp";
// import useModalCalendar from "../reusableComponents/modals/useModalCalendar";
// import ModalCalendar from "../reusableComponents/modals/modalCalendar.cmp";
// import useModalDelete from "../reusableComponents/modals/useModalDelete";
// import ModalDelete from "../reusableComponents/modals/modalDelete.cmp";
// import logic from "../../logic/logic";
// import DayPicker from 'react-day-picker/DayPicker';
// import 'react-day-picker/lib/style.css';

const HomeComponent = (props) => {
  const [userData, setUserData] = useState(null);
  const [workshopData, setWorkshopData] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  // const { isShowingModalInput, toggleInput } = useModalInput();
  // const { isShowingModalInOut, toggleInOut } = useModalInOut();
  // const { isShowingModalRadioThree, toggleRadioThree } = useModalRadioThree();
  // const { isShowingModalCalendar, toggleCalendar } = useModalCalendar();
  // const { isShowingModalDelete, toggleDelete } = useModalDelete();

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 500,
  });
  const springPropsContent = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });
  const springPropsTable = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1500,
  });

  // ComponentDidMount
  useEffect(() => {
    sessionStorage.removeItem("currentVehicleId");
    sessionStorage.removeItem("currentVehicleData");
    sessionStorage.removeItem("currentVehicleRegistration");
    sessionStorage.removeItem("subNavBar");
    sessionStorage.removeItem("currentInterventionData");
    sessionStorage.removeItem("currentServiceId");
    sessionStorage.removeItem("currentInterventionId");
    sessionStorage.removeItem("licensePlatesArray");
    sessionStorage.removeItem("incidenceKindNBL");
    sessionStorage.removeItem("currentInterventionCode");
    sessionStorage.removeItem("currentVehicleSection");
    sessionStorage.removeItem("currentLockBudget");
    sessionStorage.removeItem("currentFleetData");
    sessionStorage.setItem("subNavBar", "home");
    userData === null && getHomeData();
  }, []);

  // Window size mobile < 640px 
  // Window size mobile < 640px

  const getHomeData = () => {
    setUserData(JSON.parse(sessionStorage.getItem("userData")));
    const workshopId = sessionStorage.getItem("workshopId");

    appServices
      .getWorkshopData(workshopId)
      .then((res) => {
        if (res && res.json && res.json.workshop_for_list) {
          sessionStorage.setItem(
            "workshopData",
            JSON.stringify(res.json.workshop_for_list)
          );
          setWorkshopData(res.json.workshop_for_list);
        }
      });
  };

  const settings = {
    dots: false,
    infinite: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // const getInitialData = () => {
  //   const userId2 = JSON.parse(sessionStorage.getItem("userData"));
  //   setUserData(JSON.parse(sessionStorage.getItem("userData")));
  // };

  const handleGoToInterventions = () => {
    sessionStorage.setItem("subNavBar", "interventions");
    // getVehicles();
    props.history.push({
      pathname: `/home/interventions`,
    });
    props.history.push({
      pathname: `/home/interventions`,
    });
  };

  const getVehicles = () => {
    appServices.getVehicles().then(res => {
      console.log(`res.json.vehicles `, res.json.vehicles);
    })
  };

  const handleGoToVehicles = () => {
    sessionStorage.setItem("subNavBar", "vehicles");
    props.history.push({
      pathname: `/home/vehicles`,
    });
  };

  const handleGoToMaintenancesManager = () => {
    sessionStorage.setItem("subNavBar", "maintenancesmanager");
    props.history.push({
      pathname: `/home/maintenancesmanager`,
    });
  };

  const handleGoToRoutesManager = () => {
    sessionStorage.setItem("subNavBar", "routesmanager");
    props.history.push({
      pathname: `/home/routesmanager`,
    });
  };
  const handleGoToPartsManager = () => {
    sessionStorage.setItem("subNavBar", "partsmanager");
    props.history.push({
      pathname: `/home/partsmanager`,
    });
  };

  // const value1 = "radio 1";

  return (
    <>
      {/* <ModalRadioThree
        isShowingModalRadioThree={isShowingModalRadioThree}
        value1="radio 1"
        value2="radio 2"
        value3="radio 3"
        previousSelection={value1}
        hide={toggleRadioThree}
        isSaveData={true}
        modalTitle="Modal Input Radios"
        //doChange={}
      /> */}
      {/* <ModalInput
        isShowingModalInput={isShowingModalInput}
        modalTitle="Modal Input"
        hide={toggleInput}
        isSaveData={true}
        inputName="Input"
        //onClickSave={}
      />
      {userData && userData !== null ? (
        <ModalInOut
          isShowingModalInOut={isShowingModalInOut}
          modalTitle="Modal Input In Input Out"
          hide={toggleInOut}
          isSaveData={true}
          inputInName="Person Name"
          inputInValue={userData.person.first_name}
          inputOutName="New name"
        />
      ) : (
        <ModalInOut
          isShowingModalInOut={isShowingModalInOut}
          modalTitle="Modal Input In Input Out"
          hide={toggleInOut}
          isSaveData={true}
          inputInName="Person Name"
          inputInValue="No Name registred"
          inputOutName="New name"
        />
      )}
      <ModalRadioThree
        isShowingModalRadioThree={isShowingModalRadioThree}
        value1="radio 1"
        value2="radio 2"
        value3="radio 3"
        previousSelection={value1}
        hide={toggleRadioThree}
        isSaveData={true}
        modalTitle="Modal Input Radios"
        //doChange={}
      />
      <ModalDelete
        isShowingModalDelete={isShowingModalDelete}
        hide={toggleDelete}
        isSaveData={true}
      /> */}
      {/* <ModalCalendar
        isShowingModalCalendar={isShowingModalCalendar}
        hide={toggleCalendar}
        dateOutProp={handleDateOut}
      /> */}
      <animated.div style={springProps}>
        {/* <div>
        <p className="title is-4">Home</p>
      </div> */}
        <animated.div style={springPropsContent}>
          {userData && userData !== null && (
            <section>
              <div className="card isHorizontal isCardProfile flex-containerInlineBetween my-2">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src={
                        (userData &&
                          userData.person &&
                          userData.person.avatar_url_thumb) ||
                        "https://amac-renting.s3.amazonaws.com/people/avatars/thumb.missing.png"
                      }
                    />
                  </figure>
                </div>
                <div className="card-content">
                  {workshopData && workshopData.name && (
                    <p className="title is-6">
                      {(workshopData && workshopData.name) || null}
                    </p>
                  )}
                  <p className="subtitle is-6 mt-2">
                    {userData &&
                    userData.person &&
                    userData.person.last_name &&
                    userData.person.last_name !== null &&
                    userData.person.last_name.length > 0
                      ? `${userData.person.first_name} ${userData.person.last_name}`
                      : `${userData.person.first_name}`}
                  </p>
                </div>
              </div>

              {/* <button onClick={toggleInput}>Modal Input Test</button>
              <button onClick={toggleInOut}>Modal Inputs In Out Test</button> */}
              {/* <button onClick={toggleCalendar}>Modal Calendar</button> */}
              {/* <button onClick={toggleDelete}>Modal Delete Confirm</button> */}
            </section>
          )}
        </animated.div>
        {/* {assignmentsData && assignmentsData.length > 0 && (
        <section className="mb-3">
          <div>
            <p className="title is-6 mt-4 mb-2">Mis vehículos:</p>
            <div>
              <Slider {...settings}>
                {assignmentsData &&
                  assignmentsData[0] &&
                  assignmentsData[0].entity_job_type &&
                  assignmentsData[0].entity_job_type.length > 0 &&
                  assignmentsData[0].entity_job_type === "Vehicle" &&
                  assignmentsData.map((element, index) => (
                    <ShowAssignment
                      key={index}
                      showAssignment={element}
                      doGoToAssignment={handleGoToAssignment}
                    />
                  ))}
              </Slider>
            </div>
          </div>
        </section>
      )} */}
        {/* NEW AREA */}
        <animated.div style={springPropsTable}>
          {windowSize && windowSize <= 640 && (
            <section className="tile is-flex is-flex-direction-column is-align-content-center">
              <div className="divider is-right mb-5"></div>
              <div
                className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-center is-align-content-center columns"
                onClick={handleGoToInterventions}
              >
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon icon="tools" className="textRedAmac" />
                </div>
                <div className="minWidht230">
                  <strong>Gestión de Intervenciones</strong>
                  <p>Registra tus Intervenciones</p>
                </div>
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon
                    icon="angle-double-right"
                    className="textRedAmac"
                  />
                </div>
              </div>
              <div className="divider is-right mt-2 mb-5"></div>
              <div
                className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-center is-align-content-center columns"
                onClick={handleGoToMaintenancesManager}
              >
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon
                    icon="calendar-check"
                    className="textRedAmac"
                  />
                </div>
                <div className="minWidht230">
                  <strong>Gestión de Mantenimientos</strong>
                  <p>Registra tus Mantenimientos</p>
                </div>
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon
                    icon="angle-double-right"
                    className="textRedAmac"
                  />
                </div>
              </div>

              <div className="divider is-right mt-2 mb-5"></div>

              <div
                className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-center is-align-content-center columns"
                onClick={handleGoToVehicles}
              >
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon icon="car" className="textRedAmac" />
                </div>
                <div className="minWidht230">
                  <strong>Consulta de Vehículos</strong>
                  <p>Accede a los Datos del Vehículo</p>
                </div>
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon
                    icon="angle-double-right"
                    className="textRedAmac"
                  />
                </div>
              </div>

              <div className="divider is-right mt-2 mb-5"></div>

              <div
                className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-center is-align-content-center columns"
                onClick={handleGoToPartsManager}
              >
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon icon="cogs" className="textRedAmac" />
                </div>
                <div className="minWidht230">
                  <strong>Solicitud de Recambios</strong>
                  <p>Comunica tus Necesidades</p>
                </div>
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon
                    icon="angle-double-right"
                    className="textRedAmac"
                  />
                </div>
              </div>
              <div className="divider is-right mt-2 mb-5"></div>
              <div
                className="is-flex is-flex-direction-row is-flex-wrap-nowrap is-justify-content-center is-align-content-center columns"
                onClick={handleGoToRoutesManager}
              >
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon
                    icon="map-marker-alt"
                    className="textRedAmac"
                  />
                </div>
                <div className="minWidht230">
                  <strong>Gestión de Rutas</strong>
                  <p>Consulta tus Rutas</p>
                </div>
                <div className="is-flex is-align-items-center is-align-content-center is-justify-content-center column is-1">
                  <FontAwesomeIcon
                    icon="angle-double-right"
                    className="textRedAmac"
                  />
                </div>
              </div>
              <div className="divider is-right mt-2 mb-5"></div>
            </section>
          )}
          {windowSize && windowSize > 640 && (
            <div>
              <section className="is-flex is-justify-content-space-around pt-6">
                <div className="homeCard card redContainer is-flex is-flex-direction-column is-flex-wrap-nowrap is-align-items-center">
                  <div className="" onClick={handleGoToInterventions}>
                    <div className="card-header-icon">
                      <span className="icon is-large">
                        <i className="fas fa-3x fa-tools"></i>
                      </span>
                    </div>
                    <div className="card-content">
                      <p className="has-text-weight-bold has-text-centered">
                        Gestión de Intervenciones
                      </p>
                      <p className="is-size-7 has-text-centered">
                        Registra tus Intervenciones
                      </p>
                    </div>
                  </div>
                </div>
                <div className="homeCard card redContainer is-flex is-flex-direction-column is-flex-wrap-nowrap is-align-items-center">
                  <div className="" onClick={handleGoToMaintenancesManager}>
                    <div className="card-header-icon">
                      <span className="icon is-large">
                        <i className="fas fa-3x fa-calendar-check"></i>
                      </span>
                    </div>
                    <div className="card-content">
                      <p className="has-text-weight-bold has-text-centered">
                        Gestión de Mantenimientos
                      </p>
                      <p className="is-size-7 has-text-centered">
                        Registra tus Mantenimientos
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="is-flex is-justify-content-space-around pt-5">
                <div className="homeCard card redContainer is-flex is-flex-direction-column is-flex-wrap-nowrap is-align-items-center">
                  <div className="" onClick={handleGoToVehicles}>
                    <div className="card-header-icon">
                      <span className="icon is-large">
                        <i className="fas fa-3x fa-car"></i>
                      </span>
                    </div>
                    <div className="card-content">
                      <p className="has-text-weight-bold has-text-centered">
                        Consulta de Vehículos
                      </p>
                      <p className="is-size-7 has-text-centered">
                        Accede a los Datos del Vehículo
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="homeCard card redContainer is-flex is-flex-direction-column is-flex-wrap-nowrap is-align-items-center"
                  onClick={handleGoToPartsManager}
                >
                  <div className="">
                    <div className="card-header-icon">
                      <span className="icon is-large">
                        <i className="fas fa-3x fa-cogs"></i>
                      </span>
                    </div>
                    <div className="card-content">
                      <p className="has-text-weight-bold has-text-centered">
                        Solicitud de Recambios
                      </p>
                      <p className="is-size-7 has-text-centered">
                        Comunica tus necesidades
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="is-flex is-justify-content-space-around pt-5">
                <div
                  className="homeCard card redContainer is-flex is-flex-direction-column is-flex-wrap-nowrap is-align-items-center"
                  onClick={handleGoToRoutesManager}
                >
                  <div className="">
                    <div className="card-header-icon">
                      <span className="icon is-large">
                        <i className="fas fa-3x fa-map-marker-alt"></i>
                      </span>
                    </div>
                    <div className="card-content">
                      <p className="has-text-weight-bold has-text-centered">
                        Gestión de Rutas
                      </p>
                      <p className="is-size-7 has-text-centered">
                        Consulta tus Rutas
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </animated.div>
      </animated.div>
    </>
  );
};

export default HomeComponent;
