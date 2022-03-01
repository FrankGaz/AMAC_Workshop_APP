import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logic from "../../../logic/logic";
import unityApiService from "../../home/unity/unity.service";
import ConfirmActionMessage from "../../reusableComponents/confirmActionMessage";
import ConfirmDeleteModal from "../../modals/confirmDeleteModal";
import UnityPhoneNumbersModal from "./unityPhoneNumbersModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PHONE_NUMBER_FIELDS = ["phone_kind", "country_code", "number"];

const UnityPhoneNumbers = ({ id }) => {
  // translation hook from the ReactI18next library
  const { t } = useTranslation();

  // State that handles Add or Update functions that are given to the modal.
  // Is a copy of the selected entity
  // Flag to show or hide the add/upadte modal
  const [showModal, setShowModal] = useState(false);
  // Flag to show or hide delete confirm modal
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  // Controls the total number of items that were recieved
  const [totalItems, setTotalItems] = useState(0);
  // Controls error handling
  const [errorMessage, setErrorMessage] = useState("");
  // Controls the given confirm message
  const [confirmActionMessage, setConfirmActionMessage] = useState("");
  // Controls whether message should be seen or not
  const [showConfirmActionMessage, setShowConfirmActionMessage] = useState(
    false
  );
  // flag that controls whether an API call is being made
  const [isLoading, setIsLoading] = useState(true);

  // CRUD ITEMS
  // All Services loaded in ComponentDidMount
  const [phoneNumbers, setPhones] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState(null);

  const handleUpdate = queryParameters => {
    if (!queryParameters) {
      queryParameters = {
        method: "GET"
      };
    }
    logic.configureQueryParameters(queryParameters);
    unityApiService
      .getPhoneNumbers(id)
      .then(data => {
        setTotalItems(data && data.total);
        setPhones(data && data.json && data.json.phones);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err.message);
        setIsLoading(false);
      });
  };

  // ComponentDidMount
  useEffect(() => {
    handleUpdate({
      pagination: true
    });
  }, []);

  // Function that reloads the page with a new get request the moment we click the reload button
  const handleReloadPhoneNumbers = () => {
    handleUpdate({
      refresh: true
    });
  };

  const handleCloseModal = () => {
    setNewPhoneNumber(null);
    setErrorMessage("");
    setShowModal(false);
  };

  // Deletes row when clicked on the delete button
  const handleDeleteClick = phoneNumber => {
    unityApiService
      .deletePhoneNumber(id, phoneNumber)
      .then(() => handleReloadPhoneNumbers())
      .then(() => setShowConfirmDeleteModal(false))
      .then(() => {
        setShowConfirmActionMessage(true);
        return setConfirmActionMessage("delete_phone_success");
      })
      .catch(() => {
        setShowConfirmActionMessage(true);
        return setConfirmActionMessage("delete_phone_error");
      });
  };

  //Shows modal and sends incidence information if should update
  const handleShowModal = (value, event) => {
    if (event) {
      event.preventDefault();
    }
    setErrorMessage("");
    setNewPhoneNumber(value);
    setShowModal(true);
  };

  // Shows the modal onclick on the delete icon
  const handleShowDeleteModal = value => {
    setNewPhoneNumber(value);
    setShowConfirmDeleteModal(true);
  };

  // Closes the modal.
  const handleCloseDeleteModal = () => {
    setShowConfirmDeleteModal(false);
  };

  // Function that adds or updates a service. Hides modal afterwards
  const handleActionContact = phoneNumber => {
    setErrorMessage("");
    setNewPhoneNumber(phoneNumber);
    if (phoneNumber.id) {
      unityApiService
        .updatePhoneNumber(id, phoneNumber)
        .then(data => {
          if (
            data &&
            data.json &&
            data.json.errors &&
            data.json.errors.name &&
            data.json.errors.name[0] === "ya ha sido usado"
          ) {
            throw Error("ya ha sido usado");
          }
          return handleReloadPhoneNumbers();
        })
        .then(() => setShowModal(false))
        .then(() => {
          setShowConfirmActionMessage(true);
          return setConfirmActionMessage("update_phone_success");
        })
        .catch(err => {
          if (err && err.message === "ya ha sido usado") {
            setErrorMessage("ya ha sido usado");
          }
          setShowConfirmActionMessage(true);
          return setConfirmActionMessage("update_phone_error");
        }); //the message that is given will be translated by the component, so the message should be in the form of the keys
    } else {
      unityApiService
        .addPhoneNumber(id, phoneNumber)
        .then(data => {
          if (
            data &&
            data.json &&
            data.json.errors &&
            data.json.errors.name &&
            data.json.errors.name[0] === "ya ha sido usado"
          ) {
            throw Error("ya ha sido usado");
          }
          return handleReloadPhoneNumbers();
        })
        .then(() => setShowModal(false))
        .then(() => {
          setShowConfirmActionMessage(true);
          return setConfirmActionMessage("add_phone_success");
        })
        .catch(err => {
          if (err && err.message === "ya ha sido usado") {
            setErrorMessage("ya ha sido usado");
          }
          setShowConfirmActionMessage(true);
          return setConfirmActionMessage("add_phone_error");
        });
    }
  };

  const handleCloseConfirmActionMessage = () => {
    return setShowConfirmActionMessage(false);
  };

  return (
    <div className="col-md-12 sec-table-wrapper">
      <ConfirmActionMessage
        message={confirmActionMessage}
        showMessage={showConfirmActionMessage}
        closeMessage={handleCloseConfirmActionMessage}
      ></ConfirmActionMessage>

      <ConfirmDeleteModal
        action={handleDeleteClick}
        itemValue={newPhoneNumber}
        closeModal={handleCloseDeleteModal}
        showDeleteModal={showConfirmDeleteModal}
      ></ConfirmDeleteModal>

      <UnityPhoneNumbersModal
        action={handleActionContact}
        initialValues={PHONE_NUMBER_FIELDS}
        phoneNumberValue={newPhoneNumber}
        closeModal={handleCloseModal}
        showModal={showModal}
        errorMessage={errorMessage}
      ></UnityPhoneNumbersModal>
      <div className="row">
        <div className="col-md-8">
          <h3 className="smaller lighter blue title-margins ng-binding">
            {t("phones")}
          </h3>
        </div>
        <ReactModalPhoneNumbers doShowModal={handleShowModal} />
      </div>

      <div className="row table-responsive-row">
        <div className="col-md-12 table-responsive table-list"></div>

        <table className="table table-hover-select table-striped">
          <thead className="ng-scope">
            <tr className="ng-table-sort-header">
              {PHONE_NUMBER_FIELDS.map((item, index) => (
                <ReactHeaderPhoneNumbers key={index} item={item} />
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {phoneNumbers &&
              phoneNumbers.map((contact, index) => (
                <ReactRowsPhoneNumbers
                  key={index}
                  item={contact}
                  doShowModal={handleShowModal}
                  doShowDeleteModal={handleShowDeleteModal}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReactHeaderPhoneNumbers = ({ item }) => {
  const { t } = useTranslation();

  return (
    <th title="" className="header  sortable">
      <div className=" ng-scope">
        <span className="ng-binding sort-indicator">{t(item)}</span>
      </div>
    </th>
  );
};

const ReactRowsPhoneNumbers = ({ item, doShowModal, doShowDeleteModal }) => {
  return (
    <tr onDoubleClick={() => doShowModal(item)} className="pointer">
      <td>{item && item.phone_kind && item.phone_kind.name}</td>
      <td>{item && item.country_code}</td>
      <td>{item && item.number}</td>

      <td className="col-md-1 options-column center">
        <div className="ng-isolate-scope">
          <i
            onClick={() => doShowModal(item)}
            className="blue ace-icon fas fa-pencil-alt bigger-130 faa-pulse animated-hover hover-select-icon"
            alt="Ver / Modificar"
            title="Ver / Modificar"
          ></i>
          <i
            onClick={() => doShowDeleteModal(item)}
            className="red ace-icon fas fa-trash-alt bigger-130 faa-pulse animated-hover hover-select-icon"
            alt="Eliminar"
            title="Eliminar"
          ></i>
        </div>
      </td>
    </tr>
  );
};

const ReactModalPhoneNumbers = ({ doShowModal }) => {
  const { t } = useTranslation();

  return (
    <div className="col-md-4 sec-add-btn-wrapper">
      <button
        type="button"
        onClick={event => doShowModal({}, event)}
        className="btn btn-success block btn-sm full btn-top ng-binding"
      >
        <FontAwesomeIcon icon="plus" />
        {t("add_new")}
      </button>
    </div>
  );
};

export default UnityPhoneNumbers;
