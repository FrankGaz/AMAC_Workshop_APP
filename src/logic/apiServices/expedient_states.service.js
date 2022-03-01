import logic from "../logic";

const EXPEDIENT_STATES_QUERY = "full_expedient_states";

const expedient_states = {
  /**
   *
   * @returns {Promise} Fetch to API
   *
   */
  getExpedientStates() {
    const method = "GET";
    return logic._call(EXPEDIENT_STATES_QUERY, method);
  },
};

export default expedient_states;
