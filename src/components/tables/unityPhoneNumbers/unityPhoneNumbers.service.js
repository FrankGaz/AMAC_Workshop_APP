
/* This file manages all the API calls. It has a private function called logic._call() is a generic function that makes the actual API call.
It recieves the _XXXXXquery, the method, and the body.
All other functions are to configure how the logic._call() function will be executed.
*/
import logic, { templateQueryParameters } from '../../../logic/logic'

export const FREQUENCIES_QUERY = 'frecuencies'

templateQueryParameters.searchName = 'q[name_cont]='
templateQueryParameters.searchExpirations = 'q[expirations_eq]='
templateQueryParameters.searchDaysInterval = 'q[days_interval_eq]='

const contactsApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getContacts() {
    const method = "GET";
    return logic._call(FREQUENCIES_QUERY, method);
  }
}
export default contactsApiService
