import logic from "../../../../logic/logic";

const VEHICLES_QUERY = "vehicles";

const reactVehiclesService = {
  /**
   *
   * @returns {Promise} Fetch to API
   *
   */

  getVehicles(searchParams) {
    const method = "POST";
    return logic._call(`${VEHICLES_QUERY}/search`, method, searchParams);
  },

  getVehicle(id) {
    const method = "GET";
    return logic._call(`${VEHICLES_QUERY}/${id}`, method);
  },
};

export default reactVehiclesService;
