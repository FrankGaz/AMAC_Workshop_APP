import logic from '../../../../logic/logic'

const EMPLOYEES_QUERY = 'employees'

const employeesApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getEmployees(searchParams) {
    const method = "POST"
    return logic._call(`${EMPLOYEES_QUERY}/search`, method, searchParams);
  }
}
export default employeesApiService
