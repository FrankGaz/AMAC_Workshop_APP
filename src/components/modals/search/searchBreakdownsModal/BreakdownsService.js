import logic from '../../../../logic/logic'

const FLEETS_QUERY = 'fleets'

const BREAKDOWNS_QUERY = 'breakdown_kinds'


const breakdownsModalService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getBreakdowns() {
    const method = "GET"
    return logic._call(BREAKDOWNS_QUERY, method);
  }

}
export default breakdownsModalService
