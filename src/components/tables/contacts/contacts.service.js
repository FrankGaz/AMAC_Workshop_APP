/* This file manages all the API calls. It has a private function called logic._call() is a generic function that makes the actual API call.
It recieves the _XXXXXquery, the method, and the body.
All other functions are to configure how the logic._call() function will be executed.
*/
import logic from '../../../logic/logic'
import { UNITS_QUERY } from '../../home/unity/unity.service'
import { FRECUENCIES_QUERY } from '../../../logic/apiServices/frecuencies.service'

const ENTITY_JOB_EMPLOYEE_JOBS_QUERY = 'entity_job_employee_jobs'


const COMPANY_PHONE_ID = 6
const COMPANY_MOBILE_ID = 8

const EmployeeContactsApiService = {
  /**
   *
   * @returns {Promise} Fetch to API
   *
   */
  getContacts(unityId) {
    const method = 'GET'
    return logic._call(
      `${UNITS_QUERY}/${unityId}/${ENTITY_JOB_EMPLOYEE_JOBS_QUERY}`,
      method
    )
  },
  getPhoneNumbers(employee) {
    const {
      person: { id }
    } = employee.employee
    const method = 'GET'
    return logic._call(`people/${id}/phones`, method)
  },
  getEmails(employee) {
    const {
      person: { id }
    } = employee.employee
    const method = 'GET'
    return logic._call(`people/${id}/emails`, method)
  },

  addEmployee(employee, unityId) {
    const employeeJobs = employee.employee_jobs
    const jobResult = employeeJobs.find(employeeJob => {
      if (employeeJob) {
        return employeeJob.job && employeeJob.job.name === 'Driver'
      }
    })
    const { id } = jobResult

    if (typeof id !== 'number') throw TypeError(id + ' is not a number')
    if (typeof unityId !== 'number')
      throw TypeError(unityId + ' is not a number')

    const method = 'POST'

    const body = {
      entity_job_employee_job: {
        employee_job_id: id
      }
    }

    return logic._call(
      `${UNITS_QUERY}/${unityId}/${ENTITY_JOB_EMPLOYEE_JOBS_QUERY}`,
      method,
      body
    )
  },
  /**
   *
   * @param {object} network to delete
   *
   * @throws {Error} in case of empty, blank, or non-string name
   *
   * @throws {Error} in case of non-number id
   *
   * @throws {Error} in case of non-object company
   *
   * @returns {Promise} fetch to API
   * */
  deleteEmployee(employee, unityId) {
    const { id } = employee

    if (typeof id !== 'number') throw TypeError(id + ' is not a number')
    if (typeof unityId !== 'number')
      throw TypeError(unityId + ' is not a number')

    const method = 'DELETE'
    return logic._call(
      `${UNITS_QUERY}/${unityId}/${ENTITY_JOB_EMPLOYEE_JOBS_QUERY}/${id}`,
      method
    )
  },
  /**
   *
   * @param {string} networkName to add
   *
   * @throws {Error} in case of empty, blank, or non-string name
   *
   * @returns {Promise} fetch to API
   */

  addFrecuencies(frecuencies) {
    if (typeof frecuencies.frecuency !== 'string')
      throw TypeError(frecuencies.frecuency + ' is not a string')
    if (!frecuencies.frecuency.trim().length)
      throw Error('frecuencies.frecuency is empty or blank')

    const method = 'POST'

    const body = {
      frecuency: {
        name: frecuencies.frecuency,
        expirations: frecuencies.expirations,
        days_interval: frecuencies.days_interval
      }
    }

    return logic._call(`${FRECUENCIES_QUERY}`, method, body)
  },

  /**
   *
   * @param {string} newNetworkName to change to
   * @param {Object} network network to change name to
   *
   * @throws {Error} if NewNetworkName is non-string or empty
   *
   * @throws {Error} if network is a non-object
   *
   * @throws {Error} if network id inside object is a non-integer
   */

  updateFrecuencies(frecuencies) {
    if (typeof frecuencies.frecuency !== 'string')
      throw TypeError(frecuencies.frecuency + ' is not a string')

    if (!frecuencies.frecuency.trim().length)
      throw Error('frecuencies.frecuency is empty or blank')

    if (typeof frecuencies.id !== 'number')
      throw TypeError(frecuencies.frecuency + ' is not a number')

    if (typeof frecuencies !== 'object')
      throw TypeError(frecuencies + ' is not an object')

    const method = 'PATCH'
    const body = {
      frecuency: frecuencies
    }

    return logic._call(`${FRECUENCIES_QUERY}/${frecuencies.id}`, method, body)
  },

  async getFullContacts(unityId) {
    if (!unityId) {
      return null
    }

    const method = 'GET'

    const contactsRaw = await logic._call(
      `${UNITS_QUERY}/${unityId}/${ENTITY_JOB_EMPLOYEE_JOBS_QUERY}`,
      method
    )
    const contacts = contactsRaw.json.entity_job_employee_jobs

    for (const contact of contacts) {
      const phonesRaw = await this.getPhoneNumbers(contact)
      const phones = phonesRaw.json.phones
      const companyPhone = phones.find(
        number =>
          number &&
          number.phone_kind &&
          number.phone_kind.id === COMPANY_PHONE_ID
      )
      const companyMobile = phones.find(
        number =>
          number &&
          number.phone_kind &&
          number.phone_kind.id === COMPANY_MOBILE_ID
      )

      const emailsRaw = await this.getEmails(contact)
      const mails = emailsRaw.json.emails
      const email = mails[0]

      contact.companyPhone = companyPhone
      contact.companyMobile = companyMobile
      contact.email = email

      contact.employee.person.fullName = `${
        contact.employee.person.first_name
      } ${contact.employee.person.last_name}`
    }
    return await contacts
  }
}

export default EmployeeContactsApiService
