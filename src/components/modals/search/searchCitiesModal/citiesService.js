import logic from '../../../../logic/logic'
const CITIES_QUERY = 'cities'

const citiesApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getCities() {  
    const method = "GET"
    return logic._call(CITIES_QUERY, method);
  },
  // code 18 refers to spain country id
  getCity(countryId,provinceId,cityName){
    const method = "GET"
      logic.configureQueryParameters({
          searchforProvinceCountryId: countryId || 18,
          searchforCityProvinceId: provinceId,
          searchCityName: cityName
      })
      return logic._call(CITIES_QUERY,method)
  }
}

export default citiesApiService