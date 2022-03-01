import logic from '../../../../logic/logic'
const INCIDENCES_KINDS_QUERY = 'incidence_kinds'

const incidenceKindsService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getIncidenceKinds() {
    const method = "GET"
    return logic._call(INCIDENCES_KINDS_QUERY, method);
  }
}

export default incidenceKindsService
