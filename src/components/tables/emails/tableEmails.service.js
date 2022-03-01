import logic from '../../../logic/logic'

const WORKSHOPS_EMAILS_QUERY = 'emails'
const WORKSHOPS_EMAIL_KINDS_QUERY = 'emails_kinds'

const tableEmailsService = {
  /** 
    * @returns {Promise} Fetch to API
    */
  getEmailsKinds() {
    const method = "GET";
    return logic._call(WORKSHOPS_EMAIL_KINDS_QUERY, method)
  },


};

export default tableEmailsService;