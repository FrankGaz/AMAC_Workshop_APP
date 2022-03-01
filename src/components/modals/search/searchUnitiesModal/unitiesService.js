import logic from '../../../../logic/logic'

const UNITIES_QUERY = 'unities'

const unitiesModalApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getUnities() {
    const method = "GET"
    return logic._call(UNITIES_QUERY, method);
  },

  getUnity(name) {
    const method = "GET"
    logic.configureQueryParameters({
      searchNameEquals: name,
    })
    return logic._call(UNITIES_QUERY, method)
  }
}
export default unitiesModalApiService
