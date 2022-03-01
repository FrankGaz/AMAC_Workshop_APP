import logic from '../../../../logic/logic'
const MAINTENANCE_KINDS_QUERY = 'maintenance_kinds'

const maintenanceKindsService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getMaintenanceKinds() {
    const method = "GET"
    return logic._call(MAINTENANCE_KINDS_QUERY, method);
  }
}

export default maintenanceKindsService