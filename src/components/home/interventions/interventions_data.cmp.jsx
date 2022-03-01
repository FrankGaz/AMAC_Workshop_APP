import React, { useEffect, useState } from "react";
import appServices from "../../appServices.service";
import defaults from "../../reusableComponents/defaults";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import ModalNotification from "../../reusableComponents/modals/modalNotification.cmp";
import useModal from "../../reusableComponents/modals/useModal";
import ModalConfirm from "../../reusableComponents/modals/modalConfirm.cmp";
import useModalConfirm from "../../reusableComponents/modals/useModalConfirm";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import ShowImagesComponent from "./interventions_images.cmp";
import ShowDocumentsComponent from "./interventions_documents.cmp";
import { useSpring, animated } from "react-spring";
import logic from "../../../logic/logic";
import ModalCalendar from "../../reusableComponents/modals/modalCalendar.cmp";
import useModalCalendar from "../../reusableComponents/modals/useModalCalendar";
import useModalNotification from "../../reusableComponents/modals/useModalNotification";

const InterventionDataComponent = (props) => {
  const [currentInterventionData, setCurrentInterventionData] = useState(null);
  const [currentInterventionDataII, setCurrentInterventionDataII] =
    useState(null);
  const [currentInterventionDataIILock, setCurrentInterventionDataIILock] =
    useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [modalKind, setModalKind] = useState("Error");
  const { isShowing, toggle } = useModal();
  const [isloading, setIsloading] = useState(false);
  const [newKilometers, setNewKilometers] = useState(null);
  const [imagesArray, setImagesArray] = useState([]);
  const [documentsArray, setDocumentsArray] = useState([]);
  const [isloadingPdf, setIsloadingPdf] = useState(false);
  const [currentInterventionServices, setCurrentInterventionServices] =
    useState(null);
  const [showServicesList, setShowServicesList] = useState(false);
  const [totalServicesAmount, setTotalServicesAmount] = useState("");
  const [calendarUse, setCalendarUse] = useState(null);
  const { t } = useTranslation();
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const interventionId = sessionStorage.getItem("currentInterventionId");
  const { isShowingModalCalendar, toggleCalendar } = useModalCalendar();
  const { isShowingModalConfirm, toggleConfirm } = useModalConfirm();
  const [initialExpEntryMM, setInitialExpEntryMM] = useState("");
  const [initialEntryMM, setInitialEntryMM] = useState("");
  const [initialExpRemovalMM, setInitialExpRemovalMM] = useState("");
  const [initialRemovalMM, setInitialRemovalMM] = useState("");
  const [initialExpEntryHH, setInitialExpEntryHH] = useState("");
  const [initialEntryHH, setInitialEntryHH] = useState("");
  const [initialExpRemovalHH, setInitialExpRemovalHH] = useState("");
  const [initialRemovalHH, setInitialRemovalHH] = useState("");
  const [interventionStatus, setInterventionStatus] = useState("");
  const [removalDate, setRemovalDate] = useState(null);
  const [lockBudget, setLockBudget] = useState(false);
  const [dateOutput, setDateOutput] = useState(true);
  const { isShowingModalNotification, toggleNotification } =
    useModalNotification();
  //const [modalConfirmAction, setModalConfirmAction] = useState(null);

  //const shortFlow = sessionStorage.getItem("workshopLock");
  const [shortFlow, setShortFlow] = useState(
    sessionStorage.getItem("workshopLock")
  );

  useEffect(() => {
    sessionStorage.removeItem("currentServiceId");
    sessionStorage.removeItem("currentLockBudget");
    //const ntvId = sessionStorage.getItem("currentInterventionId");
    const ntvId = JSON.parse(sessionStorage.getItem("currentInterventionData"));
    const _id = ntvId && ntvId.id;
    getInitialData(_id);
    if (
      ntvId &&
      ntvId.vehicle_removal_date != null &&
      ntvId.vehicle_removal_date >= ntvId.vehicle_entry_date
    ) {
      setDateOutput(false);
    }

    // getInitialData(ntvId);
  }, []);

  useEffect(() => {
    // listener for sum all "total_workshop_cost" of services array
    currentInterventionServices &&
      currentInterventionServices.length > 0 &&
      calculateTotal();
  }, [currentInterventionServices]);

  const getInterventionFiles = (idForFiles) => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    appServices.getInterventionFiles(idForFiles).then((res) => {
      const resultsArray = res.json.intervention_files;
      const onlyDocuments = resultsArray.filter(
        (element) =>
          element.file_url.includes("pdf") || element.file_url.includes("xls")
      );
      const onlyImages = resultsArray.filter(
        (element) =>
          element.file_url.includes("png") ||
          element.file_url.includes("jpg") ||
          element.file_url.includes("jpeg")
      );
      setImagesArray(onlyImages);
      setDocumentsArray(onlyDocuments);
    });
  };

  const onChangeHandlerPdf = (e) => {
    e.preventDefault();
    setIsloadingPdf(true);
    let data = new FormData();
    let documentName = interventionId.toString();
    const date = new Date();
    const today =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    data.append(
      "intervention_file[name]",
      `PDF ${documentName} - ${today} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    );
    data.append("intervention_file[date_file]", `${today}`);
    data.append("intervention_file[file]", e.target.files[0]);

    appServices
      .fileUploader(data, interventionId)
      .then((res) => {
        setIsloadingPdf(false);
        setModalKind("Success");
        toggle(setModalMessage("upload_file_success"));
        getInterventionFiles(interventionId);
      })
      .catch(() => {
        setModalKind("Error");
        toggle(setModalMessage("upload_file_error"));
        setIsloadingPdf(false);
        getInterventionFiles(interventionId);
      });
  };

  const onChangeHandlerImage = (e) => {
    e.preventDefault();
    setIsloading(true);
    let data = new FormData();
    let documentName = interventionId.toString();
    const date = new Date();
    const today =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    data.append(
      "intervention_file[name]",
      `Image ${documentName} - ${today} -${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    );
    data.append("intervention_file[date_file]", `${today}`);
    data.append("intervention_file[file]", e.target.files[0]);

    appServices
      .fileUploader(data, interventionId)
      .then((res) => {
        setIsloading(false);
        setModalKind("Success");
        toggle(setModalMessage("upload_image_success"));
        getInterventionFiles(interventionId);
      })
      .catch((err) => {
        setModalKind("Error");
        toggle(setModalMessage("upload_image_error"));
        setIsloading(false);
      });
  };

  const getInitialData = (interventionId) => {
    interventionId &&
      appServices
        .getIntervention(interventionId)
        .then((res) => {
          if (res && res.json && res.json.intervention) {
            setCurrentInterventionData(res.json.intervention);
            getServices(interventionId);
            getInterventionFiles(interventionId);
            formatTimesToShow(res.json.intervention);
            handleInterventionLockBudget(res.json.intervention);
            setRemovalDate(res.json.intervention.vehicle_removal_date);
            getInterventionStatus(res.json.intervention);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const handleInterventionLockBudget = (data) => {
    if (data && data.lock_budget && data.lock_budget == true) {
      setLockBudget(true);
    } else {
      setLockBudget(false);
    }
  };

  //FUNCTION TO KNOW IF INTERVENTION IS "AUTORIZADO TALLER"

  const getInterventionStatus = (data) => {
    const currentInterventionData = JSON.parse(
      sessionStorage.getItem("currentInterventionData")
    );
    if (data && data.status && data.status == "Autorizado taller") {
      if (shortFlow == "true") {
        setDateOutput(true);
      }
      if (
        shortFlow == "true" &&
        data &&
        data.status &&
        data.status == "Autorizado taller" &&
        currentInterventionData &&
        currentInterventionData.vehicle_removal_date != null
      ) {
        setDateOutput(false);
      }
      if (
        shortFlow == "false" &&
        currentInterventionData &&
        currentInterventionData.vehicle_removal_date == null
      ) {
        setDateOutput(true);
      }

      setLockBudget(true);
    } else {
      setDateOutput(false);
    }
  };

  const getServices = (interventionId) => {
    const query = {
      method: "GET",
      page: 1,
      per_page: 9999,
    };

    logic.configureQueryParameters({ ...query });

    interventionId &&
      appServices
        .getInterventionServices(interventionId)
        .then((res) => {
          res &&
            res.json &&
            res.json.services &&
            setCurrentInterventionServices(res.json.services);
          res &&
            res.json &&
            res.json.services &&
            res.json.services.length > 0 &&
            setShowServicesList(true);
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const formatTimesToShow = (data) => {
    if (
      data &&
      data.expected_vehicle_entry_date &&
      data.expected_vehicle_entry_date !== null &&
      data.expected_vehicle_entry_date.includes("T")
    ) {
      const timeToSet = data.expected_vehicle_entry_date.substr(11, 8);
      const splittedTime = timeToSet.split(":");
      setInitialExpEntryMM(Number(splittedTime[1]).toString());
      setInitialExpEntryHH(Number(splittedTime[0]).toString());
    }
    if (
      data &&
      data.expected_vehicle_removal_date &&
      data.expected_vehicle_removal_date !== null &&
      data.expected_vehicle_removal_date.includes("T")
    ) {
      const timeToSet = data.expected_vehicle_removal_date.substr(11, 8);
      const splittedTime = timeToSet.split(":");
      setInitialExpRemovalMM(Number(splittedTime[1]).toString());
      setInitialExpRemovalHH(Number(splittedTime[0]).toString());
    }
    if (
      data &&
      data.vehicle_entry_date &&
      data.vehicle_entry_date !== null &&
      data.vehicle_entry_date.includes("T")
    ) {
      const timeToSet = data.vehicle_entry_date.substr(11, 8);
      const splittedTime = timeToSet.split(":");
      setInitialEntryMM(Number(splittedTime[1]).toString());
      setInitialEntryHH(Number(splittedTime[0]).toString());
    }
    if (
      data &&
      data.vehicle_removal_date &&
      data.vehicle_removal_date !== null &&
      data.vehicle_removal_date.includes("T")
    ) {
      const timeToSet = data.vehicle_removal_date.substr(11, 8);
      const splittedTime = timeToSet.split(":");
      setInitialRemovalMM(Number(splittedTime[1]).toString());
      setInitialRemovalHH(Number(splittedTime[0]).toString());
    }
  };

  const calculateTotal = () => {
    // const total = servicesData.map(element => element.total_workshop_cost);
    const totalServices = _.sum(
      currentInterventionServices.map((element) => element.total_workshop_cost)
    );
    setTotalServicesAmount(totalServices.toString());
  };

  const updateIntervention = () => {
    console.log("entra en UPDATEINTERVENTION");
    const interventionId = sessionStorage.getItem("currentInterventionId");
    const interventionIdStorage = sessionStorage.getItem("newInterventionId");
    const addZero = (number) => {
      if (Number(number).toString() >= 10) return number;
      if (Number(number).toString() < 10) return `0${number}`;
    };
    const oneToZeroZero = (number) => {
      if (Number(number).toString() === "1") return "00";
      if (Number(number).toString() !== "1") return number;
    };

    let expected_vehicle_entry_date;
    let vehicle_entry_date;
    let expected_vehicle_removal_date;
    let vehicle_removal_date;

    if (
      currentInterventionData &&
      currentInterventionData.expected_vehicle_entry_date &&
      currentInterventionData.expected_vehicle_entry_date !== null
    ) {
      expected_vehicle_entry_date = `${defaults.formatDateUS(
        currentInterventionData.expected_vehicle_entry_date
      )}T${addZero(initialExpEntryHH) || "00"}:${
        oneToZeroZero(initialExpEntryMM) || "00"
      }:00.000Z`;
    } else {
      expected_vehicle_entry_date = null;
    }
    if (
      currentInterventionData &&
      currentInterventionData.vehicle_entry_date &&
      currentInterventionData.vehicle_entry_date !== null
    ) {
      vehicle_entry_date = `${defaults.formatDateUS(
        currentInterventionData.vehicle_entry_date
      )}T${addZero(initialEntryHH) || "00"}:${
        oneToZeroZero(initialEntryMM) || "00"
      }:00.000Z`;
    } else {
      vehicle_entry_date = null;
    }
    if (
      currentInterventionData &&
      currentInterventionData.expected_vehicle_removal_date &&
      currentInterventionData.expected_vehicle_removal_date !== null
    ) {
      expected_vehicle_removal_date = `${defaults.formatDateUS(
        currentInterventionData.expected_vehicle_removal_date
      )}T${addZero(initialExpRemovalHH) || "00"}:${
        oneToZeroZero(initialExpRemovalMM) || "00"
      }:00.000Z`;
    } else {
      expected_vehicle_removal_date = null;
    }
    if (
      currentInterventionData &&
      currentInterventionData.vehicle_removal_date &&
      currentInterventionData.vehicle_removal_date !== null
    ) {
      vehicle_removal_date = `${defaults.formatDateUS(
        currentInterventionData.vehicle_removal_date
      )}T${addZero(initialRemovalHH) || "00"}:${
        oneToZeroZero(initialRemovalMM) || "00"
      }:00.000Z`;
      setRemovalDate(currentInterventionData.vehicle_removal_date);
    } else {
      vehicle_removal_date = null;
    }

    const workshop_budget_date =
      (currentInterventionData &&
        currentInterventionData.workshop_budget_date &&
        defaults.formatDate(currentInterventionData.workshop_budget_date)) ||
      null;

    const intervention = {
      vehicle_kilometers:
        (newKilometers && newKilometers !== null && newKilometers) || null,
      workshop_description:
        (currentInterventionData &&
          currentInterventionData.workshop_description) ||
        null,
      workshop_budget_number:
        (currentInterventionData &&
          currentInterventionData.workshop_budget_number) ||
        null,
      workshop_budget_date: workshop_budget_date || null,
      expected_vehicle_entry_date: expected_vehicle_entry_date || null,
      vehicle_entry_date: vehicle_entry_date || null,
      expected_vehicle_removal_date: expected_vehicle_removal_date || null,
      vehicle_removal_date: vehicle_removal_date || null,
    };

    let IdToSend;

    if (interventionId !== null) {
      IdToSend = interventionId;
    } else {
      IdToSend = interventionIdStorage;
    }
    console.log("IdToSend :>> ", interventionIdStorage);

    appServices
      .updateIntervention(IdToSend, intervention)
      .then((res) => {
        if (res && res.json && res.json.intervention) {
          setModalKind("Success");
          setModalMessage("update_intervention_success");
          toggle();
          setCurrentInterventionData(res.json.intervention);
        }
      })
      .catch((err) => {
        setModalKind("Error");
        err &&
          err.message &&
          toggle(setModalMessage(_.capitalize(err.message)));
        err &&
          !err.message &&
          toggle(setModalMessage("update_intervention_error"));
        toggle();
      });
  };

  const updateInterventionFinished = () => {
    const interventionData = JSON.parse(
      sessionStorage.getItem("currentInterventionData")
    );
    const interventionId = interventionData && interventionData.id;

    const addZero = (number) => {
      if (Number(number).toString() >= 10) return number;
      if (Number(number).toString() < 10) return `0${number}`;
    };
    const oneToZeroZero = (number) => {
      if (Number(number).toString() === "1") return "00";
      if (Number(number).toString() !== "1") return number;
    };

    let expected_vehicle_entry_date;
    let vehicle_entry_date;
    let expected_vehicle_removal_date;
    let vehicle_removal_date;

    if (
      currentInterventionData &&
      currentInterventionData.expected_vehicle_entry_date &&
      currentInterventionData.expected_vehicle_entry_date !== null
    ) {
      expected_vehicle_entry_date = `${defaults.formatDateUS(
        currentInterventionData.expected_vehicle_entry_date
      )}T${addZero(initialExpEntryHH) || "00"}:${
        oneToZeroZero(initialExpEntryMM) || "00"
      }:00.000Z`;
    } else {
      expected_vehicle_entry_date = null;
    }
    if (
      currentInterventionData &&
      currentInterventionData.vehicle_entry_date &&
      currentInterventionData.vehicle_entry_date !== null
    ) {
      vehicle_entry_date = `${defaults.formatDateUS(
        currentInterventionData.vehicle_entry_date
      )}T${addZero(initialEntryHH) || "00"}:${
        oneToZeroZero(initialEntryMM) || "00"
      }:00.000Z`;
    } else {
      vehicle_entry_date = null;
    }
    if (
      currentInterventionData &&
      currentInterventionData.expected_vehicle_removal_date &&
      currentInterventionData.expected_vehicle_removal_date !== null
    ) {
      expected_vehicle_removal_date = `${defaults.formatDateUS(
        currentInterventionData.expected_vehicle_removal_date
      )}T${addZero(initialExpRemovalHH) || "00"}:${
        oneToZeroZero(initialExpRemovalMM) || "00"
      }:00.000Z`;
    } else {
      expected_vehicle_removal_date = null;
    }
    if (
      currentInterventionData &&
      currentInterventionData.vehicle_removal_date &&
      currentInterventionData.vehicle_removal_date !== null
    ) {
      vehicle_removal_date = `${defaults.formatDateUS(
        currentInterventionData.vehicle_removal_date
      )}T${addZero(initialRemovalHH) || "00"}:${
        oneToZeroZero(initialRemovalMM) || "00"
      }:00.000Z`;
      setRemovalDate(currentInterventionData.vehicle_removal_date);
    } else {
      vehicle_removal_date = null;
    }

    const workshop_budget_date =
      (currentInterventionData &&
        currentInterventionData.workshop_budget_date &&
        defaults.formatDate(currentInterventionData.workshop_budget_date)) ||
      null;

    const intervention = {
      vehicle_kilometers:
        (newKilometers && newKilometers !== null && newKilometers) || null,
      workshop_description:
        (currentInterventionData &&
          currentInterventionData.workshop_description) ||
        null,
      workshop_budget_number:
        (currentInterventionData &&
          currentInterventionData.workshop_budget_number) ||
        null,
      workshop_budget_date: workshop_budget_date || null,
      expected_vehicle_entry_date: expected_vehicle_entry_date || null,
      vehicle_entry_date: vehicle_entry_date || null,
      expected_vehicle_removal_date: expected_vehicle_removal_date || null,
      vehicle_removal_date: vehicle_removal_date || null,
    };

    appServices
      .updateIntervention(interventionId, intervention)
      .then((res) => {
        if (res && res.json && res.json.intervention) {
          setModalKind("Success");
          setModalMessage("update_intervention_success");
          toggle();
          setCurrentInterventionData(res.json.intervention);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((err) => {
        setModalKind("Error");
        err &&
          err.message &&
          toggle(setModalMessage(_.capitalize(err.message)));
        err &&
          !err.message &&
          toggle(setModalMessage("update_intervention_error"));
        toggle();
      });
  };

  const checkFieldsBeforeLockIntervention = () => {
    //toggleConfirm();
    if (currentInterventionData.vehicle_entry_date == null) {
      setModalKind("Error");
      setModalMessage("empty_entry_date");
      toggle();
    } else if (
      currentInterventionData.expected_vehicle_removal_date <
      currentInterventionData.expected_vehicle_entry_date
    ) {
      setModalKind("Error");
      setModalMessage("wrong_expect_removal_date");
      toggle();
    } else if (
      currentInterventionData.vehicle_entry_date != null &&
      currentInterventionData.workshop_budget_number != null
    ) {
      toggleConfirm();
    } else {
      setModalKind("Error");
      setModalMessage("empty_budget_number");
      toggle();
    }
  };

  const checkFieldsBeforeEndIntervention = () => {
    if (
      currentInterventionData.vehicle_removal_date != null &&
      initialRemovalHH != "" &&
      initialRemovalMM != "" &&
      currentInterventionData.vehicle_removal_date <
        currentInterventionData.vehicle_entry_date
    ) {
      setModalKind("Error");
      setModalMessage("wrong_removal_date");
      toggle();
    } else if (!currentInterventionData.vehicle_removal_date) {
      setModalKind("Error");
      setModalMessage("wrong_removal_date");
      toggle();
    } else if (
      currentInterventionData.expected_vehicle_removal_date != null &&
      currentInterventionData.expected_vehicle_removal_date <
        currentInterventionData.expected_vehicle_entry_date
    ) {
      setModalKind("Error");
      setModalMessage("wrong_expect_removal_date");
      toggle();
    } else if (
      currentInterventionData.vehicle_removal_date != null &&
      currentInterventionData.vehicle_removal_date >=
        currentInterventionData.vehicle_entry_date
    ) {
      updateInterventionFinished();
      sessionStorage.setItem(
        "currentInterventionData",
        JSON.stringify(currentInterventionData)
      );
      setDateOutput(false);
    }
  };

  const lockIntervention = () => {
    toggleConfirm();
    updateIntervention();

    const interventionId = sessionStorage.getItem("currentInterventionId");
    const interventionIdStorage = sessionStorage.getItem("newInterventionId");

    let IdToSend;

    if (interventionId !== null) {
      IdToSend = interventionId;
    } else {
      IdToSend = interventionIdStorage;
    }

    appServices
      .closeBudgetIntervention(IdToSend)
      .then((res) => {
        if (res && res.json && res.json.intervention) {
          //setModalKind("Success");
          //setModalMessage("finish_intervention_success");
          //toggle();
          setCurrentInterventionData(res.json.intervention);
          const currentInterventionDataStatus = JSON.stringify(
            currentInterventionData.status
          );
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((err) => {
        setModalKind("Error");
        err &&
          err.message &&
          toggle(setModalMessage(_.capitalize(err.message)));
        err &&
          !err.message &&
          toggle(setModalMessage("update_intervention_error"));
        toggle();
      });
  };

  const goToService = (id) => {
    sessionStorage.setItem("currentServiceId", id);
    sessionStorage.setItem(
      "currentLockBudget",
      currentInterventionData && currentInterventionData.lock_budget
    );
    sessionStorage.setItem(
      "currentFleetData",
      currentInterventionData && currentInterventionData.vehicle_fleet_id
    );
    const interventionId = sessionStorage.getItem("currentInterventionId");
    // currentInterventionData
    const interventionDataStorage = JSON.parse(
      sessionStorage.getItem("currentInterventionData")
    );
    if (
      interventionId !== null &&
      interventionId !== undefined &&
      interventionId > 0
    ) {
      props.history.push({
        pathname: `/home/interventions/data/${interventionId}/services`,
      });
    } else {
      sessionStorage.setItem(
        "currentInterventionId",
        interventionDataStorage.id
      );
      props.history.push({
        pathname: `/home/interventions/data/${interventionDataStorage.id}/services`,
      });
    }
  };

  const getInitialInterventionData = () => {
    const interventionId =
      currentInterventionData && currentInterventionData.id;
    interventionId &&
      appServices
        .getIntervention(interventionId)
        .then((res) => {
          if (res && res.json && res.json.intervention) {
            setCurrentInterventionDataII(res.json.intervention);
            setCurrentInterventionDataIILock(res.json.intervention.lock_budget);
            const interventionCurrentData = res.json.intervention;
            const currentLockBudget = res.json.intervention.lock_budget;
            goToAddService(interventionCurrentData);
          }
        })
        .catch((err) => {
          setModalKind("Error");
          err && err.message && toggle(setModalMessage(err.message));
          err && !err.message && toggle(setModalMessage("error_data_fetch"));
        });
  };

  const goToAddService = (currentInterventionDataII) => {
    if (currentInterventionDataII) {
      if (currentInterventionDataII.lock_budget == false) {
        props.history.push({
          pathname: `/home/interventions/newservice`,
        });
      } else {
        setModalKind("Error");
        toggleNotification(setModalMessage("intervention_blocked"));
      }
    } else {
      setTimeout(() => {
        console.log("Some problem found...");
      }, 10);
    }
  };

  const handleDescription = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    setCurrentInterventionData({
      ...currentInterventionData,
      workshop_description: value,
    });
  };

  const handleChangeWorkshopBudgetNumber = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    setCurrentInterventionData({
      ...currentInterventionData,
      workshop_budget_number: value,
    });
  };

  const handleWorkshopDate = (day) => {
    setCurrentInterventionData({
      ...currentInterventionData,
      workshop_budget_date: day,
    });
  };

  const handleKilometers = (event, e) => {
    let value = null;
    let name = null;
    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    if (value != 0 && value != null) {
      setNewKilometers(value);
    }
  };

  const springPropsContent = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });

  const openCalendar = (event, use) => {
    event.preventDefault();
    if (use && use.length > 0 && use !== undefined && use !== null) {
      setCalendarUse(use);
      toggleCalendar();
    }
  };

  const dateSelectedOutput = (dateSelected) => {
    const dateKey = Object.keys(dateSelected);
    const dateValue = Object.values(dateSelected);
    setCurrentInterventionData({
      ...currentInterventionData,
      [dateKey]: dateValue,
    });
    toggleCalendar();
  };

  const handleHoursAndMinutes = (event, e) => {
    let value = null;
    let name = null;

    if (_.isNull(e) || _.isUndefined(e)) {
      name = event.target.name;
      value = event.target.value;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    if (name === "expected_vehicle_entry_hours") {
      if (value === 0) {
        setInitialExpEntryHH("00");
      } else {
        setInitialExpEntryHH(value);
      }
    }
    if (name === "expected_vehicle_entry_minutes") {
      if (value === 1) {
        setInitialExpEntryMM("00");
      } else {
        setInitialExpEntryMM(value);
      }
    }
    if (name === "vehicle_entry_hours") {
      if (value == 0) {
        setInitialEntryHH("00");
      } else {
        setInitialEntryHH(value);
      }
    }
    if (name === "vehicle_entry_minutes") {
      if (value === 1) {
        setInitialEntryMM("00");
      } else {
        setInitialEntryMM(value);
      }
    }
    if (name === "expected_vehicle_removal_hours") {
      if (value === 0) {
        setInitialExpRemovalHH("00");
      } else {
        setInitialExpRemovalHH(value);
      }
    }
    if (name === "expected_vehicle_removal_minutes") {
      if (value === 1) {
        setInitialExpRemovalMM("00");
      } else {
        setInitialExpRemovalMM(value);
      }
    }
    if (name === "vehicle_removal_hours") {
      if (value === 0) {
        setInitialRemovalHH("00");
      } else {
        setInitialRemovalHH(value);
      }
    }
    if (name === "vehicle_removal_minutes") {
      if (value === 1) {
        setInitialRemovalMM("00");
      } else {
        setInitialRemovalMM(value);
      }
    }
  };

  return (
    <>
      <ModalNotification
        isShowingModalNotification={isShowing}
        hide={toggle}
        modalTitle={modalMessage}
        modalKind={modalKind}
      />
      <ModalNotification
        isShowingModalNotification={isShowingModalNotification}
        hide={toggleNotification}
        modalTitle={modalMessage || "Error"}
        modalKind={modalKind}
      />
      <ModalCalendar
        isShowingModalCalendar={isShowingModalCalendar}
        hide={toggleCalendar}
        dateInputName={calendarUse}
        dateSelectedOutput={dateSelectedOutput}
      />
      <ModalConfirm
        isShowingModalConfirm={isShowingModalConfirm}
        hide={toggleConfirm}
        isSaveData={true}
        //itemToConfirm={itemForDeleteModal}
        confirmAction={lockIntervention}
        //confirmAction={modalConfirmAction}
        //textToShow="Al finalizar no podrá editar más datos de la intervención."
        textToShowBold="Al confirmar, no podrá editar más datos de la intervención."
      />
      <animated.div style={springPropsContent}>
        <div>
          <div
            className={
              windowSize && windowSize <= 640
                ? "box budgetDataBox is-justify-content-space-between is-flex is-flex-wrap-wrap"
                : "box budgetDataBox is-flex is-flex-wrap-wrap"
            }
          >
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field fullWidth mb-3"
                  : "field mb-3 fullWidth px-3"
              }
            >
              <div className="minW250 fullWidth statusTag is-flex is-justify-content-end">
                <span
                  className={_.camelCase(
                    currentInterventionData && currentInterventionData.status
                  ) + ' bigLabel'}
                >
                  {currentInterventionData && currentInterventionData.status}
                </span>
              </div>
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Núm. Intervención
              </p>
              <input
                readOnly
                disabled
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                value={
                  currentInterventionData &&
                  currentInterventionData.intervention_code
                }
                type="text"
                //onChange={handleChangeWorkshopBudgetNumber}
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Fecha
              </p>
              <input
                readOnly
                disabled
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                value={
                  currentInterventionData && currentInterventionData.start_date
                }
                type="text"
                //onChange={handleChangeWorkshopBudgetNumber}
              />
            </div>

            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Marca
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_brand
                }
                type="text"
                readOnly
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Modelo
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_model
                }
                type="text"
                readOnly
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Matrícula
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_license_plate
                }
                type="text"
                readOnly
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                {t("chassis")}
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_chassis
                }
                type="text"
                readOnly
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Flota
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_fleet
                }
                type="text"
                readOnly
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Unidad
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_unity
                }
                type="text"
                readOnly
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Zona
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_zone
                }
                type="text"
                readOnly
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Subzona
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_subzone
                }
                type="text"
                readOnly
              />
            </div>
          </div>

          <div
            className={
              windowSize && windowSize <= 640
                ? "box budgetDataBox is-justify-content-space-between is-flex is-flex-wrap-wrap"
                : "box budgetDataBox is-flex is-flex-wrap-wrap"
            }
          >
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Núm. Presupuesto
              </p>

              {lockBudget == false ? (
                <input
                  className={
                    windowSize && windowSize <= 640 ? "input is-small" : "input"
                  }
                  value={
                    currentInterventionData &&
                    currentInterventionData.workshop_budget_number
                  }
                  type="text"
                  onChange={handleChangeWorkshopBudgetNumber}
                />
              ) : (
                <input
                  disabled
                  readOnly
                  className={
                    windowSize && windowSize <= 640 ? "input is-small" : "input"
                  }
                  value={
                    currentInterventionData &&
                    currentInterventionData.workshop_budget_number
                  }
                  type="text"
                  //onChange={handleChangeWorkshopBudgetNumber}
                />
              )}
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Fecha
              </p>

              {currentInterventionData &&
                currentInterventionData.workshop_budget_date &&
                lockBudget == false && (
                  <input
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    onClick={(event) =>
                      openCalendar(event, "workshop_budget_date")
                    }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.workshop_budget_date
                    )}
                    type="text"
                  ></input>
                )}
              {!currentInterventionData ||
                (!currentInterventionData.workshop_budget_date &&
                  lockBudget == false && (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) =>
                        openCalendar(event, "workshop_budget_date")
                      }
                    ></input>
                  ))}
              {lockBudget == true && (
                <input
                  disabled
                  readOnly
                  className={
                    windowSize && windowSize <= 640 ? "input is-small" : "input"
                  }
                  //onClick={(event) =>
                  // openCalendar(event, "workshop_budget_date")
                  //}
                  value={defaults.formatDate(
                    currentInterventionData &&
                      currentInterventionData.workshop_budget_date
                  )}
                  type="text"
                ></input>
              )}
            </div>

            <div
              className={
                windowSize && windowSize <= 640
                  ? "field mb-2 fullWidth mt-2"
                  : "field mb-2 fullWidth px-3 mt-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Descripción
              </p>
              {lockBudget == false ? (
                <textarea
                  className="textarea is-size-7"
                  value={
                    currentInterventionData &&
                    currentInterventionData.workshop_description
                  }
                  onChange={handleDescription}
                />
              ) : (
                <textarea
                  disabled
                  readOnly
                  className="textarea is-size-7"
                  value={
                    currentInterventionData &&
                    currentInterventionData.workshop_description
                  }
                  //onChange={handleDescription}
                />
              )}
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Kilómetros AFM
              </p>
              <input
                className={
                  windowSize && windowSize <= 640 ? "input is-small" : "input"
                }
                disabled
                value={
                  currentInterventionData &&
                  currentInterventionData.vehicle_kilometers
                }
                type="text"
                readOnly
                // onChange={handleChangeWorkshopBudgetNumber}
              />
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                Kilómetros APP
              </p>
              {lockBudget == false ? (
                <input
                  className={
                    windowSize && windowSize <= 640 ? "input is-small" : "input"
                  }
                  value={newKilometers && newKilometers}
                  type="text"
                  onChange={handleKilometers}
                />
              ) : (
                <input
                  disabled
                  readOnly
                  className={
                    windowSize && windowSize <= 640 ? "input is-small" : "input"
                  }
                  value={newKilometers && newKilometers}
                  type="text"
                  //onChange={handleKilometers}
                />
              )}
            </div>

            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox text Grey"
                    : "label textGrey"
                }
              >
                {t("expect_entry_date")}
              </p>

              {currentInterventionData &&
                currentInterventionData.expected_vehicle_entry_date &&
                lockBudget == false && (
                  <input
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    onClick={(event) =>
                      openCalendar(event, "expected_vehicle_entry_date")
                    }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.expected_vehicle_entry_date
                    )}
                  ></input>
                )}
              {currentInterventionData &&
                currentInterventionData.expected_vehicle_entry_date &&
                lockBudget == true && (
                  <input
                    disabled
                    readOnly
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    // onClick={(event) =>
                    //   openCalendar(event, "expected_vehicle_entry_date")
                    // }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.expected_vehicle_entry_date
                    )}
                  ></input>
                )}
              {!currentInterventionData ||
                (!currentInterventionData.expected_vehicle_entry_date &&
                  lockBudget == false && (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) =>
                        openCalendar(event, "expected_vehicle_entry_date")
                      }
                    ></input>
                  ))}
              {!currentInterventionData ||
                (!currentInterventionData.expected_vehicle_entry_date &&
                  lockBudget == true && (
                    <input
                      disabled
                      readOnly
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      // onClick={(event) =>
                      //   openCalendar(event, "expected_vehicle_entry_date")
                      // }
                    ></input>
                  ))}
              {/* {lockBudget == true && (
                <input
                  disabled
                  readOnly
                  className={
                    windowSize && windowSize <= 640 ? "input is-small" : "input"
                  }
                  onClick={(event) =>
                    openCalendar(event, "expected_vehicle_entry_date")
                  }
                  value={defaults.formatDate(
                    currentInterventionData &&
                      currentInterventionData.expected_vehicle_entry_date
                  )}
                ></input>
              )} */}
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                {t("expect_entry_time")}
              </p>
              <div className="is-flex">
                <div
                  className={
                    windowSize && windowSize <= 640
                      ? "select fullWidth is-small"
                      : "select fullWidth"
                  }
                >
                  {lockBudget == false ? (
                    <select
                      onChange={handleHoursAndMinutes}
                      name={"expected_vehicle_entry_hours"}
                      className="form-control fullWidth"
                      value={initialExpEntryHH && initialExpEntryHH}
                    >
                      <option>{`${t("HH")}`}</option>
                      {defaults && defaults.hours
                        ? defaults.hours.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  ) : (
                    <select
                      disabled
                      readOnly
                      // onChange={handleHoursAndMinutes}
                      name={"expected_vehicle_entry_hours"}
                      className="form-control fullWidth"
                      value={initialExpEntryHH && initialExpEntryHH}
                    >
                      <option>{`${t("HH")}`}</option>
                      {defaults && defaults.hours
                        ? defaults.hours.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  )}
                </div>
                <div
                  className={
                    windowSize && windowSize <= 640
                      ? "select fullWidth is-small"
                      : "select fullWidth"
                  }
                >
                  {lockBudget == false ? (
                    <select
                      onChange={handleHoursAndMinutes}
                      name={"expected_vehicle_entry_minutes"}
                      className="form-control fullWidth"
                      value={initialExpEntryMM && initialExpEntryMM}
                    >
                      <option>{`${t("MM")}`}</option>
                      {defaults && defaults.minutes
                        ? defaults.minutes.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  ) : (
                    <select
                      disabled
                      readOnly
                      // onChange={handleHoursAndMinutes}
                      name={"expected_vehicle_entry_minutes"}
                      className="form-control fullWidth"
                      value={initialExpEntryMM && initialExpEntryMM}
                    >
                      <option>{`${t("MM")}`}</option>
                      {defaults && defaults.minutes
                        ? defaults.minutes.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                {t("date_reception")}
              </p>
              {currentInterventionData &&
                currentInterventionData.vehicle_entry_date &&
                lockBudget == false && (
                  <input
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    onClick={(event) =>
                      openCalendar(event, "vehicle_entry_date")
                    }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.vehicle_entry_date
                    )}
                  ></input>
                )}
              {currentInterventionData &&
                currentInterventionData.vehicle_entry_date &&
                lockBudget == true && (
                  <input
                    disabled
                    readOnly
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    // onClick={(event) =>
                    //   openCalendar(event, "vehicle_entry_date")
                    // }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.vehicle_entry_date
                    )}
                  ></input>
                )}

              {!currentInterventionData ||
                (!currentInterventionData.vehicle_entry_date &&
                  lockBudget == false && (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) =>
                        openCalendar(event, "vehicle_entry_date")
                      }
                    ></input>
                  ))}
              {!currentInterventionData ||
                (!currentInterventionData.vehicle_entry_date &&
                  lockBudget == true && (
                    <input
                      disabled
                      readOnly
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      // onClick={(event) =>
                      //   openCalendar(event, "vehicle_entry_date")
                      // }
                    ></input>
                  ))}
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                {t("time_reception_hour")}
              </p>
              <div className="is-flex">
                <div
                  className={
                    windowSize && windowSize <= 640
                      ? "select fullWidth is-small"
                      : "select fullWidth"
                  }
                >
                  {lockBudget == false ? (
                    <select
                      onChange={handleHoursAndMinutes}
                      name={"vehicle_entry_hours"}
                      className="form-control fullWidth"
                      value={initialEntryHH && initialEntryHH}
                    >
                      <option>{`${t("HH")}`}</option>
                      {defaults && defaults.hours
                        ? defaults.hours.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  ) : (
                    <select
                      disabled
                      readOnly
                      // onChange={handleHoursAndMinutes}
                      name={"vehicle_entry_hours"}
                      className="form-control fullWidth"
                      value={initialEntryHH && initialEntryHH}
                    >
                      <option>{`${t("HH")}`}</option>
                      {defaults && defaults.hours
                        ? defaults.hours.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  )}
                </div>
                <div
                  className={
                    windowSize && windowSize <= 640
                      ? "select fullWidth is-small"
                      : "select fullWidth"
                  }
                >
                  {lockBudget == false ? (
                    <select
                      onChange={handleHoursAndMinutes}
                      name={"vehicle_entry_minutes"}
                      className="form-control fullWidth"
                      value={initialEntryMM && initialEntryMM}
                    >
                      <option>{`${t("MM")}`}</option>
                      {defaults && defaults.minutes
                        ? defaults.minutes.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  ) : (
                    <select
                      disabled
                      readOnly
                      // onChange={handleHoursAndMinutes}
                      name={"vehicle_entry_minutes"}
                      className="form-control fullWidth"
                      value={initialEntryMM && initialEntryMM}
                    >
                      <option>{`${t("MM")}`}</option>
                      {defaults && defaults.minutes
                        ? defaults.minutes.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                {t("date_planned_output")}
              </p>
              {currentInterventionData &&
                currentInterventionData.expected_vehicle_removal_date &&
                lockBudget == false && (
                  <input
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    onClick={(event) =>
                      openCalendar(event, "expected_vehicle_removal_date")
                    }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.expected_vehicle_removal_date
                    )}
                  ></input>
                )}
              {currentInterventionData &&
                currentInterventionData.expected_vehicle_removal_date &&
                lockBudget == true && (
                  <input
                    disabled
                    readOnly
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    // onClick={(event) =>
                    //   openCalendar(event, "expected_vehicle_removal_date")
                    // }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.expected_vehicle_removal_date
                    )}
                  ></input>
                )}

              {!currentInterventionData ||
                (!currentInterventionData.expected_vehicle_removal_date &&
                  lockBudget == false && (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) =>
                        openCalendar(event, "expected_vehicle_removal_date")
                      }
                    ></input>
                  ))}
              {!currentInterventionData ||
                (!currentInterventionData.expected_vehicle_removal_date &&
                  lockBudget == true && (
                    <input
                      disabled
                      readOnly
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      // onClick={(event) =>
                      //   openCalendar(event, "expected_vehicle_removal_date")
                      // }
                    ></input>
                  ))}
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                {t("time_planned_output_hour")}
              </p>
              <div className="is-flex">
                <div
                  className={
                    windowSize && windowSize <= 640
                      ? "select fullWidth is-small"
                      : "select fullWidth"
                  }
                >
                  {lockBudget == false ? (
                    <select
                      onChange={handleHoursAndMinutes}
                      name={"expected_vehicle_removal_hours"}
                      className="form-control fullWidth"
                      value={initialExpRemovalHH && initialExpRemovalHH}
                    >
                      <option>{`${t("HH")}`}</option>
                      {defaults && defaults.hours
                        ? defaults.hours.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  ) : (
                    <select
                      disabled
                      readOnly
                      // onChange={handleHoursAndMinutes}
                      name={"expected_vehicle_removal_hours"}
                      className="form-control fullWidth"
                      value={initialExpRemovalHH && initialExpRemovalHH}
                    >
                      <option>{`${t("HH")}`}</option>
                      {defaults && defaults.hours
                        ? defaults.hours.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  )}
                </div>
                <div
                  className={
                    windowSize && windowSize <= 640
                      ? "select fullWidth is-small"
                      : "select fullWidth"
                  }
                >
                  {lockBudget == false ? (
                    <select
                      onChange={handleHoursAndMinutes}
                      name={"expected_vehicle_removal_minutes"}
                      className="form-control fullWidth"
                      value={initialExpRemovalMM && initialExpRemovalMM}
                    >
                      <option>{`${t("MM")}`}</option>
                      {defaults && defaults.minutes
                        ? defaults.minutes.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  ) : (
                    <select
                      disabled
                      readOnly
                      // onChange={handleHoursAndMinutes}
                      name={"expected_vehicle_removal_minutes"}
                      className="form-control fullWidth"
                      value={initialExpRemovalMM && initialExpRemovalMM}
                    >
                      <option>{`${t("MM")}`}</option>
                      {defaults && defaults.minutes
                        ? defaults.minutes.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                {t("date_output")}
              </p>
              {currentInterventionData &&
                currentInterventionData.vehicle_removal_date &&
                dateOutput == true && (
                  <input
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    onClick={(event) =>
                      openCalendar(event, "vehicle_removal_date")
                    }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.vehicle_removal_date
                    )}
                  ></input>
                )}
              {currentInterventionData &&
                currentInterventionData.vehicle_removal_date &&
                dateOutput == false && (
                  <input
                    disabled
                    readOnly
                    className={
                      windowSize && windowSize <= 640
                        ? "input is-small"
                        : "input"
                    }
                    value={defaults.formatDate(
                      currentInterventionData &&
                        currentInterventionData.vehicle_removal_date
                    )}
                  ></input>
                )}
              {!currentInterventionData ||
                (!currentInterventionData.vehicle_removal_date &&
                  dateOutput == true && (
                    <input
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                      onClick={(event) =>
                        openCalendar(event, "vehicle_removal_date")
                      }
                    ></input>
                  ))}
              {!currentInterventionData ||
                (!currentInterventionData.vehicle_removal_date &&
                  dateOutput == false && (
                    <input
                      disabled
                      readOnly
                      className={
                        windowSize && windowSize <= 640
                          ? "input is-small"
                          : "input"
                      }
                    ></input>
                  ))}
            </div>

            <div
              className={
                windowSize && windowSize <= 640
                  ? "field width45 mb-2"
                  : "field mb-2 width50 px-3"
              }
            >
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "label isSearchBox textGrey"
                    : "label textGrey"
                }
              >
                {t("time_output_hour")}
              </p>
              <div className="is-flex">
                <div
                  className={
                    windowSize && windowSize <= 640
                      ? "select fullWidth is-small"
                      : "select fullWidth"
                  }
                >
                  {dateOutput == true ? (
                    <select
                      onChange={handleHoursAndMinutes}
                      name={"vehicle_removal_hours"}
                      className="form-control fullWidth"
                      value={initialRemovalHH && initialRemovalHH}
                    >
                      <option>{`${t("HH")}`}</option>
                      {defaults && defaults.hours
                        ? defaults.hours.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  ) : (
                    <select
                      disabled
                      readOnly
                      // onChange={handleHoursAndMinutes}
                      name={"vehicle_removal_hours"}
                      className="form-control fullWidth"
                      value={initialRemovalHH && initialRemovalHH}
                    >
                      <option>{`${t("HH")}`}</option>
                      {defaults && defaults.hours
                        ? defaults.hours.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  )}
                </div>
                <div
                  className={
                    windowSize && windowSize <= 640
                      ? "select fullWidth is-small"
                      : "select fullWidth"
                  }
                >
                  {dateOutput == true ? (
                    <select
                      onChange={handleHoursAndMinutes}
                      name={"vehicle_removal_minutes"}
                      className="form-control fullWidth"
                      value={initialRemovalMM && initialRemovalMM}
                    >
                      <option>{`${t("MM")}`}</option>
                      {defaults && defaults.minutes
                        ? defaults.minutes.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  ) : (
                    <select
                      disabled
                      readOnly
                      // onChange={handleHoursAndMinutes}
                      name={"vehicle_removal_minutes"}
                      className="form-control fullWidth"
                      value={initialRemovalMM && initialRemovalMM}
                    >
                      <option>{`${t("MM")}`}</option>
                      {defaults && defaults.minutes
                        ? defaults.minutes.map((element, index) => {
                            return (
                              <option key={index} value={element.id}>
                                {" "}
                                {t(element && element.name)}{" "}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  )}
                </div>
              </div>
            </div>
            {lockBudget == false && (
              <div
                className={
                  windowSize && windowSize <= 640
                    ? "fullWidth is-flex is-justify-content-flex-end mt-2 field"
                    : "fullWidth is-flex is-justify-content-flex-end mt-2 field px-3"
                }
              >
                <button
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-small is-success mr-3"
                      : "button is-success mr-3"
                  }
                  onClick={updateIntervention}
                >
                  <i className="fas fa-save"></i>&nbsp;{t("save")}
                </button>
                <button
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-small is-info"
                      : "button is-info"
                  }
                  onClick={checkFieldsBeforeLockIntervention}
                >
                  <i className="fas fa-check"></i>&nbsp;{t("close")}
                </button>
              </div>
            )}
            {dateOutput == true && (
              <div
                className={
                  windowSize && windowSize <= 640
                    ? "fullWidth is-flex is-justify-content-flex-end mt-2 field"
                    : "fullWidth is-flex is-justify-content-flex-end mt-2 field px-3"
                }
              >
                <button
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-small is-info"
                      : "button is-info"
                  }
                  onClick={checkFieldsBeforeEndIntervention}
                >
                  {t("finalize_action")}
                </button>
              </div>
            )}
          </div>
        </div>
        {/*  -------------------  LISTA DE SERVICIOS  -------------------  */}
        {showServicesList && showServicesList === true ? (
          <div className="box mt-5">
            <div className="field is-flex is-justify-content-space-between">
              <p
                className={
                  windowSize && windowSize <= 640
                    ? "is-size-6 textGrey"
                    : "is-size-5 textGrey"
                }
              >
                <b>Lista de Servicios</b>
              </p>
              {lockBudget == false && shortFlow == "true" && (
                <button
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-info button is-small"
                      : "button is-info button "
                  }
                  onClick={getInitialInterventionData}
                >
                  <i className="fas fa-plus"></i>
                </button>
              )}
              {lockBudget == true && shortFlow == "true" && (
                <button
                  disabled
                  className={
                    windowSize && windowSize <= 640
                      ? "button is-info button is-small"
                      : "button is-info button "
                  }
                  onClick={getInitialInterventionData}
                >
                  <i className="fas fa-plus"></i>
                </button>
              )}
            </div>
            <div className="field mt-5">
              {windowSize && windowSize <= 640 ? (
                currentInterventionServices &&
                currentInterventionServices.map((item, index) => {
                  return (
                    <div
                      key={index}
                      item={item}
                      className={"box mb-1 is-flex is-align-items-center"}
                    >
                      <a
                        className="container"
                        onClick={() => item && item.id && goToService(item.id)}
                      >
                        <div className="is-flex is-justify-content-space-between is-align-items-center">
                          <div className="width80 is-flex is-align-items-center is-justify-content-space-between is-flex-wrap-wrap fullWidth">
                            <div>
                              <p className="is-size-7 textGrey">
                              <i class="fas fa-info-circle"></i> &nbsp;
                                {item && item.incidence_kind}
                              </p>
                              <p className="is-size-7 textGrey">
                              <i class="fas fa-wrench"></i> &nbsp;

                                {item && item.service_kind}
                              </p>
                              <p className="is-size-7 textGrey">
                              <i class="fas fa-wallet"></i> &nbsp;

                                {item &&
                                  item.total_workshop_cost &&
                                  defaults.formatNumberDecimalsCommaMiles(
                                    item.total_workshop_cost
                                  )}
                                €
                              </p>
                              {/* <p className="is-size-9 textGrey">Estado: {item.status}</p> */}
                            </div>
                            <div className="minW250">
                              <span className={_.camelCase(item.status)}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                          <div className="icon width20 is-pulled-right">
                            <i className="fas fa-2x fa-angle-double-right textRedAmac"></i>
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })
              ) : (
                <table
                  className={
                    windowSize && windowSize <= 640
                      ? "table table-hover-select table-striped maxW100"
                      : "table fullWidth table-hover-select table-striped"
                  }
                >
                  <thead className="ng-scope"></thead>
                  <tbody>
                    {currentInterventionServices &&
                      currentInterventionServices.map((item, index) => (
                        <tr
                          key={index}
                          onClick={() =>
                            item && item.id && goToService(item.id)
                          }
                        >
                          <td><i class="fas fa-wrench"></i>&nbsp;{item && item.incidence_kind}</td>
                          <td>{item && item.service_kind}</td>
                          <td style={{ textAlign: 'right' }}>
                            {item &&
                              item.total_workshop_cost &&
                              defaults.formatNumberDecimalsCommaMiles(
                                item.total_workshop_cost
                              )}
                            €
                          </td>
                          <td>
                            <i
                              className="fa fa-pencil-square-o"
                              aria-hidden="true"
                            ></i>
                          </td>
                          {/* <td>
                            <i className="fa fa-angle-double-right"></i>
                          </td> */}
                        </tr>
                      ))}
                  </tbody>
                  {totalServicesAmount && totalServicesAmount.length > 1 ? (
                    <tfoot>
                      <tr
                        style={{
                          borderTop: "1px solid black",
                          backgroundColor: "white",
                        }}
                      >
                        <td></td>
                        <td
                          style={{
                            textAlign: 'right'
                          }}
                        >
                          Total:</td>
                        <td
                          style={{
                            backgroundColor: "rgba(144, 156, 194, 0.6)",
                            textAlign: 'right'
                          }}
                        >
                          {totalServicesAmount &&
                            defaults.formatNumberDecimalsCommaMiles(
                              totalServicesAmount
                            )}
                          €
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  ) : (
                    <tfoot></tfoot>
                  )}
                </table>
              )}
              {windowSize &&
                windowSize <= 640 &&
                totalServicesAmount &&
                totalServicesAmount.length > 1 && (
                  <div className="is-flex is-flex-wrap-nowrap is-justify-content-flex-end is-align-items-center pt-3 pr-2">
                    <div>
                      <p className="is-size-7 mr-2">
                        <b>Total:</b>
                      </p>
                    </div>
                    <div>
                      <p className="is-size-7">
                        {totalServicesAmount &&
                          defaults.formatNumberDecimalsCommaMiles(
                            totalServicesAmount
                          )}
                      </p>
                    </div>
                    <div>
                      <p className="is-size-7">€</p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="box mt-5">
            <div
              className={
                windowSize && windowSize <= 640
                  ? "field is-flex is-flex-wrap-wrap"
                  : "field is-flex is-justify-content-space-between is-align-items-center"
              }
            >
              <p className="label textGrey">No hay servicios para mostrar</p>
              {windowSize &&
                windowSize <= 640 &&
                lockBudget == false &&
                shortFlow == "true" && (
                  <button
                    className="button is-info is-small button"
                    onClick={getInitialInterventionData}
                  >
                    {t("add_service")}
                  </button>
                )}
              {windowSize &&
                windowSize <= 640 &&
                lockBudget == true &&
                shortFlow == "true" && (
                  <button
                    disabled
                    className="button is-info is-small button"
                    onClick={getInitialInterventionData}
                  >
                    {t("add_service")}
                  </button>
                )}
              {windowSize &&
                windowSize > 640 &&
                lockBudget == false &&
                shortFlow == "true" && (
                  <button
                    className="button is-info button"
                    onClick={getInitialInterventionData}
                  >
                    {t("add_service")}
                  </button>
                )}
              {windowSize &&
                windowSize > 640 &&
                lockBudget == true &&
                shortFlow == "true" && (
                  <button
                    disabled
                    className="button is-info button"
                    onClick={getInitialInterventionData}
                  >
                    {t("add_service")}
                  </button>
                )}
            </div>
          </div>
        )}
        {/*  -------------------  DOCUMENTS  ------------------- */}
        <div className="box">
          <div className="field">
            <p className="textGrey label">{t("documents")}</p>
          </div>

          <div className="field">
            {isloadingPdf && isloadingPdf === true ? (
              <p>Cargando...</p>
            ) : (
              <input
                type="file"
                name="import[imported_file]"
                id="imported_image"
                onChange={onChangeHandlerPdf}
                className="form-control-file fullWidth"
                accept="application/pdf, .xls, .xlsx, application/vnd.ms-excel application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            )}
          </div>

          <div className="field">
            <ShowDocumentsComponent
              documentsList={documentsArray}
              // interventionId={interventionData && interventionData.id}
              // doReload={handleReloadFiles}
            />
          </div>
        </div>
        {/*  -------------------  IMAGES  ------------------- */}
        <div className="box">
          <div className="field">
            <p className="label textGrey">{t("images")}</p>
          </div>
          <div className="field">
            {isloading && isloading === true ? (
              <p>Cargando...</p>
            ) : (
              <input
                type="file"
                name="import[imported_file]"
                id="imported_image"
                onChange={onChangeHandlerImage}
                className="form-control-file  fullWidth"
                accept="image/*"
              />
            )}
          </div>

          <div className="field">
            <ShowImagesComponent
              images={imagesArray}
              // interventionId={interventionId}
              // doReload={handleReloadFiles}
            />
          </div>
        </div>
      </animated.div>
      <FooterNavBar />
    </>
  );
};

export default InterventionDataComponent;
