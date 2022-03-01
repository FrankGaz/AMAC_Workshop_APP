import logic from '../../../../logic/logic'

const FLEETS_QUERY = 'fleets'

const fleetsApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getFleets() {
    const method = "GET"
    return logic._call(FLEETS_QUERY, method);
  }
}
export default fleetsApiService
