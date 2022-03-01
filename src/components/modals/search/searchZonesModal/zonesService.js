import logic from '../../../../logic/logic'

const ZONES_QUERY = 'zones'

const zonesApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getZones() {  
    const method = "GET"
    return logic._call(ZONES_QUERY, method);
  }
}

export default zonesApiService
