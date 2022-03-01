import logic from '../../../logic/logic'

const WORKSHOPS_PHONES_QUERY = 'phones'
const WORKSHOPS_PHONE_KINDS_QUERY = 'phone_kinds'

const tablePhonesService = {
  /** 
    * @returns {Promise} Fetch to API
    */
  getPhoneKinds() {
    const method = "GET";
    return logic._call(WORKSHOPS_PHONE_KINDS_QUERY, method)
  },


};

export default tablePhonesService;