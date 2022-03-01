import logic from '../../../../logic/logic'
const CUSTOMERS_QUERY = 'customers'

const customersApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getCustomers() {  
    const method = "GET"
    return logic._call(CUSTOMERS_QUERY, method);
  }
}

export default customersApiService
