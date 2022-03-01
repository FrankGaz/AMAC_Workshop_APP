import logic from '../logic'

const EXPEDIENT_KINDS_QUERY = 'expedient_kinds'

 const expedient_kinds = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getExpedientKinds() {  
    const method = "GET"
    return logic._call(EXPEDIENT_KINDS_QUERY, method);
  }
}

export default expedient_kinds
