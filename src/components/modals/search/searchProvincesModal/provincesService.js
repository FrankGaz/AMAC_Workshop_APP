import logic from '../../../../logic/logic'

const PROVINCES_QUERY = 'provinces'

const provincesApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getProvinces() {  
    const method = "GET"
    return logic._call(PROVINCES_QUERY, method);
  },
  getProvince(countryId,province){
      const method = "GET"
      // id 18 refers to Spain as a country.
      logic.configureQueryParameters({
          searchforProvinceCountryId: countryId || 18,
          searchProvinceName: province
      })
      return logic._call(PROVINCES_QUERY,method)
  }
}

export default provincesApiService
