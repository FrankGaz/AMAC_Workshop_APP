import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logic from '../../../logic/logic'
import ConfirmDeleteModal from '../../modals/confirmDeleteModal'
import ConfirmActionMessage from '../../reusableComponents/confirmActionMessage'
import employeeContactsApiService from './contacts.service'
import SearchEmployeesModal from '../../modals/search/searchEmployeesModal/searchEmployeesModal'
import LoadingIcon from '../../reusableComponents/loadingIcon';

const CONTACT_FIELDS = ['contact', 'email', 'telephone', 'mobile']

const ContactsTable = ({ id }) => {
  // translation hook from the ReactI18next library
  const { t } = useTranslation()

  // State that handles Add or Update functions that are given to the modal.
  // Is a copy of the selected entity
  // Flag to show or hide the add/upadte modal
  const [showModal, setShowModal] = useState(false)
  // Flag to show or hide delete confirm modal
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
  // Controls error handling
  const [errorMessage, setErrorMessage] = useState('')
  // Controls the given confirm message
  const [confirmActionMessage, setConfirmActionMessage] = useState('')
  // Controls whether message should be seen or not
  const [showConfirmActionMessage, setShowConfirmActionMessage] = useState(false)
  // Flag used to determine whether it contacts are loading
  const [isLoading, setIsLoading] = useState(true)

  // CRUD ITEMS
  // All Services loaded in ComponentDidMount
  const [contacts, setContacts] = useState([])
  const [newContact, setNewContact] = useState(null)

  // ComponentDidMount
  useEffect(() => {
    setIsLoading(true)
    const queryParameters = {
      searchIsActiveEmployee: true,
      searchEmployeePosition: 'Driver',
      searchEmployeeCompany: logic && logic.companyId && logic.companyId.id
    }
    const query = {
      method: 'GET',
      ...queryParameters
    }
    logic.configureQueryParameters(query)
    employeeContactsApiService.getFullContacts(id).then(res => {
      setContacts(res)
      setIsLoading(false)
    })
      .catch(err => {
        console.error(err.message)
        setIsLoading(false)
      })
  }, [id])

  const loadContacts = () => {
    setIsLoading(true)
    const queryParameters = {
      searchIsActiveEmployee: true,
      searchEmployeePosition: 'Driver',
      searchEmployeeCompany: logic && logic.companyId && logic.companyId.id
    }
    const query = {
      method: 'GET',
      ...queryParameters
    }
    logic.configureQueryParameters(query)
    employeeContactsApiService.getFullContacts(id).then(res => {
      setContacts(res)
      setIsLoading(false)
    })
      .catch(err => {
        console.error(err.message)
        setIsLoading(false)
      })
  }

  const handleCloseModal = () => {
    setNewContact(null)
    setErrorMessage('')
    setShowModal(false)
  }

  // Deletes row when clicked on the delete button
  const handleDeleteClick = contact => {
    employeeContactsApiService
      .deleteEmployee(contact, id)
      .then(() => loadContacts())
      .then(() => setShowConfirmDeleteModal(false))
      .then(() => {
        setShowConfirmActionMessage(true)
        return setConfirmActionMessage('delete_contact_success')
      })
      .catch(() => {
        setShowConfirmActionMessage(true)
        return setConfirmActionMessage('delete_contact_error')
      })
  }

  //Shows modal and sends incidence information if should update
  const handleShowModal = (value, event) => {
    if (event) {
      event.preventDefault()
    }
    setErrorMessage('')
    setNewContact(value)
    setShowModal(true)
  }

  // Shows the modal onclick on the delete icon
  const handleShowDeleteModal = value => {
    setNewContact(value)
    setShowConfirmDeleteModal(true)
  }

  // Closes the modal.
  const handleCloseDeleteModal = () => {
    setShowConfirmDeleteModal(false)
  }
  // Function that adds or updates a service. Hides modal afterwards
  const handleActionContact = contact => {
    setErrorMessage('')
    employeeContactsApiService
      .addEmployee(contact, id)
      .then(data => {
        if (
          data &&
          data.json &&
          data.json.errors &&
          data.json.errors.name &&
          data.json.errors.name[0] === 'ya ha sido usado'
        ) {
          throw Error('ya ha sido usado')
        }
        return loadContacts()
      })
      .then(() => setShowModal(false))
      .then(() => {
        setShowConfirmActionMessage(true)
        return setConfirmActionMessage('add_contact_success')
      })
      .catch(err => {
        if (err && err.message === 'ya ha sido usado') {
          setErrorMessage('ya ha sido usado')
        }
        setShowConfirmActionMessage(true)
        return setConfirmActionMessage('add_contact_error')
      })
    /*  }*/
    setNewContact(contact)
  }
  const handleCloseConfirmActionMessage = () => {
    return setShowConfirmActionMessage(false)
  }

  return (
    <div className="col-md-12 sec-table-wrapper">
      <ConfirmActionMessage
        message={confirmActionMessage}
        showMessage={showConfirmActionMessage}
        closeMessage={handleCloseConfirmActionMessage}
      />

      <ConfirmDeleteModal
        action={handleDeleteClick}
        itemValue={newContact}
        closeModal={handleCloseDeleteModal}
        showDeleteModal={showConfirmDeleteModal}
      />

      <SearchEmployeesModal
        closeModal={handleCloseModal}
        showModal={showModal}
        searchSelection={item => handleActionContact(item)}
        position={'Driver'}
      />
      <div className="row">
        <div className="col-md-8">
          <h3 className="smaller lighter blue title-margins ng-binding">
            {t('contact_data')}
          </h3>
        </div>
        <ReactModalContacts doShowModal={handleShowModal} />
      </div>

      <div className="row table-responsive-row">
        <div className="col-md-12 table-responsive table-list" />

        <table className="table table-hover-select table-striped">
          <thead className="ng-scope">
            <tr className="ng-table-sort-header">
              {CONTACT_FIELDS.map((item, index) => (
                <ReactHeaderContacts key={index} item={item} />
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {contacts &&
              contacts.map((contact, index) => {
                return (
                  <ReactRowsContacts
                    key={index}
                    item={contact}
                    doShowModal={handleShowModal}
                    doShowDeleteModal={handleShowDeleteModal}
                  />
                )
              })}
          </tbody>
        </table>
        <LoadingIcon loading={isLoading} />
      </div>
    </div>
  )
}

const ReactHeaderContacts = ({ item }) => {
  const { t } = useTranslation()

  return (
    <th title="" className="header  sortable">
      <div className=" ng-scope">
        <span className="ng-binding sort-indicator">{t(item)}</span>
      </div>
    </th>
  )
}

const ReactRowsContacts = ({ item, doShowModal, doShowDeleteModal }) => {
  return (
    <tr onDoubleClick={() => doShowModal(item)} className="pointer">
      <td>
        {item &&
          item.employee &&
          item.employee.person &&
          item.employee.person.fullName}
      </td>
      <td>{item && item.email && item.email.email}</td>
      <td>{item && item.companyPhone && item.companyPhone.number}</td>
      <td>{item && item.companyMobile && item.companyMobile.number}</td>
      <td className="col-md-1 options-column center">
        <div className="ng-isolate-scope">
          <i
            onClick={() => doShowDeleteModal(item)}
            className="red ace-icon fas fa-trash-alt bigger-130 faa-pulse animated-hover hover-select-icon"
            alt="Eliminar"
            title="Eliminar"
          />
        </div>
      </td>
    </tr>
  )
}

const ReactModalContacts = ({ doShowModal }) => {
  const { t } = useTranslation()

  return (
    <div className="col-md-4 sec-add-btn-wrapper">
      <button
      type="button"
        onClick={event => doShowModal({}, event)}
        className="btn btn-success block btn-sm full btn-top ng-binding">
        <i className="fa fa-plus" />
        {t('add_new')}
      </button>
    </div>
  )
}
export default ContactsTable
