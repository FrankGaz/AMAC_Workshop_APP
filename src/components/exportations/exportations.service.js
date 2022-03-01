import logic from '../../logic/logic'

const EXPORTATIONS_LIST = 'job_notifiers/exports'

const exportationsListService = {
  /** 
    * @returns {Promise} Fetch to API
    */
  getAll(params) {
    const method = "GET";
    return logic._call(EXPORTATIONS_LIST, method, params)
  },

};

export default exportationsListService
