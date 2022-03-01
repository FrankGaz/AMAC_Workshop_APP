import logic from '../../../../logic/logic'

const COST_CENTER_QUERY = 'cecos'

const costCentersApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getCostCenters() {  
    const method = "GET"
    return logic._call(COST_CENTER_QUERY, method);
  }
}

export default costCentersApiService
