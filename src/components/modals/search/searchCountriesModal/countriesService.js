import logic from '../../../../logic/logic';

const COUNTRIES_QUERY = 'countries'

const countriesApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getCountries() {  
    const method = "GET"
    return logic._call(COUNTRIES_QUERY, method);
  },
  getCountry(country){
    const method = "GET"
    logic.configureQueryParameters({
        searchCountryName: country
    })
    return logic._call(COUNTRIES_QUERY,method)
  }
}

export default countriesApiService 