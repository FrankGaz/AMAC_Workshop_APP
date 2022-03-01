
/* This file manages all the API calls. It has a private function called logic._call() is a generic function that makes the actual API call.
It recieves the _XXXXXquery, the method, and the body.
All other functions are to configure how the logic._call() function will be executed.
*/
import logic from '../logic'

const FRECUENCIES_QUERY = 'frecuencies'



const frecuenciesApiService = {
  /** 
    * 
    * @returns {Promise} Fetch to API
    *  
    */
  getFrecuencies() {
    const method = "GET";
    return logic._call(FRECUENCIES_QUERY, method);
  },

  /**
   * 
   * @param {object} network to delete
   * 
   * @throws {Error} in case of empty, blank, or non-string name
   * 
   * @throws {Error} in case of non-number id
   * 
   * @throws {Error} in case of non-object company 
   * 
   * @returns {Promise} fetch to API
   * */
  deleteFrequencies(frecuencies) {
    const { name, id } = frecuencies

    if (typeof name !== "string") throw TypeError(name + " is not a string");
    if (!name.trim().length) throw Error("name is empty or blank");

    if (typeof id !== "number") throw TypeError(id + " is not a number");

    const method = 'DELETE'

    return logic._call(`${FRECUENCIES_QUERY}/${id}`, method)
  },

  /**
      * 
      * @param {string} networkName to add
      * 
      * @throws {Error} in case of empty, blank, or non-string name
      * 
      * @returns {Promise} fetch to API
      */

  addFrecuencies(frecuencies) {
    const {name, expirations, days_interval} = frecuencies
    if (typeof name !== "string") throw TypeError(name + " is not a string");
    if (!name.trim().length) throw Error("name is empty or blank");

    const method = 'POST'

    const body = {
      frecuency: {
        name: name,
        expirations: expirations,
        days_interval: days_interval
      }
    }

    return logic._call(`${FRECUENCIES_QUERY}`, method, body)
  },

  /**
      * 
      * @param {string} newNetworkName to change to
      * @param {Object} network network to change name to
      * 
      * @throws {Error} if NewNetworkName is non-string or empty
      * 
      * @throws {Error} if network is a non-object
      * 
      * @throws {Error} if network id inside object is a non-integer
      */

  updateFrecuencies(frecuencies) {
    const { id, name } = frecuencies

    if (typeof name !== "string") throw TypeError(name + " is not a string");

    if (!name.trim().length) throw Error("name is empty or blank");

    if (typeof id !== "number") throw TypeError(name + " is not a number");

    if (typeof frecuencies !== "object") throw TypeError(frecuencies + " is not an object");

    const method = 'PATCH'
    const body = {
      frecuency: frecuencies
    }

    return logic._call(`${FRECUENCIES_QUERY}/${id}`, method, body)
  },



}
export default frecuenciesApiService 
