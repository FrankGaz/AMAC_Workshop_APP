import logic from '../logic'
/* This file manages all the API calls. 
It has a private function called _call() is a generic function that makes the actual API call.
It recieves the _XXXXXquery, the method, and the body.
All other functions are to configure how the _call() function will be executed.
*/
const SERVICE_KINDS_QUERY = 'service_kinds'



const service_kinds = {
  /** 
    * @returns {Promise} Fetch to API
    */
  getService_kinds() {
    const method = "GET";
    return logic._call(SERVICE_KINDS_QUERY, method);
  },

  /**
   * @param {object} service to delete
   *
   * @throws {Error} in case of empty, blank, or non-string name
   * @throws {Error} in case of non-number id
   * @throws {Error} in case of non-object company 
   * 
   * @returns {Promise} fetch to API
   * */
  deleteService(service) {
    const { name, company, id } = service

    /*
    NOTE: por que controlas todo esto?
    Ya se que nunca esta de mas añadir seguridad, pero...
    quizas no veo el motivo
    Lo mismo vale para el resto de los metodos
    
    Response: Aunque en las pantallas ya se controla, es posible que esta lógica la queramos transladar a por ejemplo otra aplicacón donde 
    cabe la posibilidad de que no se controle. Además, es posible que en una pantalla no controlemos los datos y así nos ahorramos una llamada fallida a la API.
    NOTE: OK
    */

    if (typeof name !== "string") throw TypeError(name + " is not a string");
    if (!name.trim().length) throw Error("name is empty or blank");
    if (typeof id !== "number") throw TypeError(id + " is not a number");
    if (typeof company !== "object") throw TypeError(company + " is not an object");

    const method = 'DELETE'

    return logic._call(`${SERVICE_KINDS_QUERY}/${id}`, method)
  },

  /**
      * 
      * @param {object} service to add
      * 
      * @throws {Error} in case of empty, blank, or non-string name
      * 
      * @returns {Promise} fetch to API
      */
  addService(service) {
    /*
    NOTE: que significa esta compnayId = 1 harcoded aqui?
    Response: Cierto en la API a la hora de crear el campo company no puede estar en blanco y corresponde a compañias predeterminadas. 
    1 corresponde a la compañia gestora por defecto. Injeccion AMAC - DEMO
    NOTE: OK
    */

    if (typeof service.name !== "string") throw TypeError(service.name + " is not a string");
    if (!service.name.trim().length) throw Error("service.name is empty or blank");

    const method = 'POST'

    const body = {
      service_kind: {
        name: service.name,
        fleet_id: service.fleet_id,
        incidence_kind_id: service.incidence_kind_id,
        company_id: logic.getCompany().id
      }
    }

    return logic._call(`${SERVICE_KINDS_QUERY}`, method, body)
  },

  /**
      * @param {Object} service to update
      * 
      * @throws {Error} if service is a non-object
      * @throws {Error} if service id inside object is a non-integer
      */

  updateService(service) {
    if (typeof service.name !== "string") throw TypeError(service.name + " is not a string");
    if (!service.name.trim().length) throw Error("service.name is empty or blank");
    if (typeof service.id !== "number") throw TypeError(service.id + " is not a number");
    if (typeof service !== "object") throw TypeError(service + " is not an object");

    const method = 'PATCH'
  
    const body = {
      service_kind: service
    }

    return logic._call(`${SERVICE_KINDS_QUERY}/${service.id}`, method, body)
  }

  /*
  NOTE: valdria la pena hacer siempre el "get" (get one) dtodos los servicios?
  Response: De momento no es necesario, la ruta a la API está. No se tardaría mucho en implementarlo.
  NOTE: pues mejor hacerla por defecto, no?
  */
};

export default service_kinds
