import logic from "../logic/logic";
const USERS_BASE_QUERY = "users";
const EMPLOYEE_BASE_QUERY = "employees";
const EMPLOYEE_ASSIGNMENTS_QUERY = "assignments";
const VEHICLES_QUERY = "vehicles";
const VEHICLE_KM_QUERY = "vehicle_kilometers";
const VEHICLE_FUELS_QUERY = "vehicle_fuels";
const COMPANIES_QUERY = "companies";
const SUMMARY_ALARMS_QUERY = "my_summary_alarms";
const VEHICLE_FILES_QUERY = "vehicle_files";
const VEHICLE_TECHNICAL_DATA_QUERY = "vehicle_technical_data";
const WORKSHOP_QUERY = "web_taller";
const INTERVENTIONS_QUERY = "interventions";
const SERVICES_QUERY = "services";
const BUDGET_LINES_QUERY = "budget_lines";
const BUDGET_LINE_QUERY = "budget_line";
const WORKSHOPS_WORKSHOPS_QUERY = "workshops";
const VEHICLE_ITV_GROUPS_DONES_QUERY = "vehicle_itv_group_dones";
const VEHICLE_ITV_GROUPS_QUERY = "vehicle_itv_groups";
const GROUP_MAINTENANCES_DONES_QUERY = "vehicle_maintenance_dones";
const VEHICLE_MAINTENANCES_QUERY = "vehicle_maintenances";
const PREVISION_MAINTENANCES_QUERY = "prevision_maintenances";
const VEHICLES_SEARCH_QUERY = "search";
const INTERVENTION_FILES_QUERY = "intervention_files";
const INCIDENCES_KINDS_QUERY = "incidence_kinds";
const BREAKDOWN_KINDS_QUERY = "breakdown_kinds";
const SUB_BREAKDOWN_KINDS_QUERY = "sub_breakdown_kinds";
const BUDGET_DETAIL_ACTIONS_QUERY = "budget_detail_actions";
const SERVICE_KINDS_QUERY = "service_kinds";
const FLEETS_SEARCH_QUERY = "fleets";
const CLOSE_BUDGET_QUERY = "close_budget";

const appServices = {
  /**
   *
   * @returns {Promise} Fetch to API
   *
   */

  getInterventions() {
    const method = "GET";
    // logic.configureQueryParameters({
    //   sortingPerPageQ: 9997,
    // });
    return logic._call(`${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}`, method);
  },

  getIntervention(id) {
    const method = "GET";
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${id}`,
      method
    );
  },

  getInterventionServices(id) {
    const method = "GET";
    logic.configureQueryParameters({
      sortingPerPageQ: 9997,
    });
    const interventionId = id;
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}`,
      method
    );
  },

  getService(interventionId, serviceId) {
    const method = "GET";
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}`,
      method
    );
  },

  getServiceBudgetLines(interventionId, serviceId) {
    const method = "GET";
    logic.configureQueryParameters({
      sortingPerPageQ: 9997,
    });
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}/${BUDGET_LINES_QUERY}`,
      method
    );
  },

  getServiceBudgetLine(interventionId, serviceId, budgetId) {
    const method = "GET";
    
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}/${BUDGET_LINES_QUERY}/${budgetId}`,
      method
    );
  },

  getWorkshopData(workshopId) {
    const method = "GET";
    return logic._call(`${WORKSHOPS_WORKSHOPS_QUERY}/${workshopId}`, method);
  },

  getVehicleItvRevisionsDones(vehicleId) {
    const method = "GET";
    return logic._call(
      `${VEHICLES_QUERY}/${vehicleId}/${VEHICLE_ITV_GROUPS_DONES_QUERY}`,
      method
    );
  },

  getVehicleItvRevisions(vehicleId) {
    const method = "GET";
    return logic._call(
      `${VEHICLES_QUERY}/${vehicleId}/${VEHICLE_ITV_GROUPS_QUERY}`,
      method
    );
  },

  getVehicleMaintenancesDones(vehicleId) {
    const method = "GET";
    return logic._call(
      `${VEHICLES_QUERY}/${vehicleId}/${GROUP_MAINTENANCES_DONES_QUERY}`,
      method
    );
  },

  getVehicleMaintenances(vehicleId) {
    const method = "GET";
    return logic._call(
      `${VEHICLES_QUERY}/${vehicleId}/${VEHICLE_MAINTENANCES_QUERY}`,
      method
    );
  },

  getVehicleMaintenancesPrevision() {
    const method = "GET";
    return logic._call(
      `${GROUP_MAINTENANCES_DONES_QUERY}/${PREVISION_MAINTENANCES_QUERY}`,
      method
    );
  },

  addIntervention(intervention) {
    const method = "POST";
    const body = { intervention };
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}`,
      method,
      body
    );
  },

  updateIntervention(interventionId, intervention) {
    const method = "PUT";
    const body = { intervention };
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}`,
      method,
      body
    );
  },

  closeBudgetIntervention(interventionId) {
    const method = "POST";
    //const body = { intervention };
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${CLOSE_BUDGET_QUERY}`,
      method
     // body
    );
  },

  updateIntervention(interventionId, intervention) {
    const method = "PUT";
    const body = { intervention };
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}`,
      method,
      body
    );
  },

  getInterventionFiles(interventionId) {
    const method = "GET";
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${INTERVENTION_FILES_QUERY}`,
      method
    );
  },

  fileUploader(data, interventionId) {
    const method = "POST";
    const isFile = true;
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${INTERVENTION_FILES_QUERY}`,
      method,
      data,
      isFile
    );
  },

  addService(interventionId, service) {
    const method = "POST";
    const body = { service };
    
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}`,
      method,
      body
    );
  },

  updateService(interventionId, serviceId, service) {
    const method = "PUT";
    const body = { service };
    
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}`,
      method,
      body
    );
  },
  
  getFleets() {
    const method = "GET";
    return logic._call(
      `${FLEETS_SEARCH_QUERY}`,
      method
    );
  },
  
  deleteBudgetLine(interventionId, serviceId, budgetLineId) {
    const method = "DELETE";
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}/${BUDGET_LINES_QUERY}/${budgetLineId}`,
      method
    );
  },
    // añadir sin paginación !!!!!

  getServiceKinds() {
    const method = "GET"
    return logic._call(SERVICE_KINDS_QUERY, method);
  },

  // añadir sin paginación !!!!!

  getIncidenceKinds() {
    const method = "GET";
    return logic._call(INCIDENCES_KINDS_QUERY, method);
  },

  // añadir sin paginación !!!!!

  getBudgetDetailActions() {
    const method = "GET";
    return logic._call(
      `${BUDGET_DETAIL_ACTIONS_QUERY}/?q[company_id_eq]=${logic.companyId.id}`,
      method
    );
  },

  // añadir sin paginación !!!!!

  getBreakdownKinds() {
    const method = "GET";
    return logic._call(`${BREAKDOWN_KINDS_QUERY}`, method);
  },

  // añadir sin paginación !!!!!


  getSubBreakdownKinds() {
    const method = "GET";
    return logic._call(
      `${SUB_BREAKDOWN_KINDS_QUERY}/?q[company_id_eq]=${logic.companyId.id}`,
      method
    );
  },

  // añadir sin paginación !!!!!

  getSubBreakdownKindsActions() {
    const method = "GET";
    return logic._call(
      `${SUB_BREAKDOWN_KINDS_QUERY}/q[company_id_eq]=${logic.companyId.id}`,
      method
    );
  },

  addBudgetLine(interventionId, serviceId, budget_line) {
    const method = "POST";
    const body = { budget_line };
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}/${BUDGET_LINES_QUERY}`,
      method,
      body
    );
  },

  deleteBudgetLine(interventionId, serviceId, budgetLineId) {
    const method = "DELETE";
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}/${BUDGET_LINES_QUERY}/${budgetLineId}`,
      method
    );
  },

  updateBudgetLine(interventionId, serviceId, currentBudgetLineIdToSave, budgetLineData) {

    const method = "PUT";
    // const budget_line = budgetLineData;
    const body = { budget_line : { ...budgetLineData } };
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}/${BUDGET_LINES_QUERY}/${currentBudgetLineIdToSave}`,
      method,
      body
    );
  },

  deleteService(interventionId, serviceId) {
    const method = "DELETE";
    return logic._call(
      `${WORKSHOP_QUERY}/${INTERVENTIONS_QUERY}/${interventionId}/${SERVICES_QUERY}/${serviceId}`,
      method
    );
  },

  // old services --->
  // old services --->
  // old services --->
  // old services --->
  // old services --->
  // old services --->

  getUser(userId) {
    const method = "GET";
    return logic._call(`${USERS_BASE_QUERY}/${userId}`, method);
  },

  getEmployeeAssignments(employeeId) {
    const id = employeeId;

    const method = "GET";
    return logic._call(
      `${EMPLOYEE_BASE_QUERY}/${employeeId}/${EMPLOYEE_ASSIGNMENTS_QUERY}`,
      method
    );
  },

  getVehicleData(vehicleId) {
    const method = "GET";
    return logic._call(`${VEHICLES_QUERY}/${vehicleId}`, method);
  },

  getVehicles(searchParams) {
    const method = "POST";
    return logic._call(`${VEHICLES_QUERY}/search`, method, searchParams);
  },

  getVehicleKilometers(vehicleId) {
    const method = "GET";
    return logic._call(
      `${VEHICLES_QUERY}/${vehicleId}/${VEHICLE_KM_QUERY}`,
      method
    );
  },

  getVehicleFuels(vehicleId) {
    const method = "GET";
    return logic._call(
      `${VEHICLES_QUERY}/${vehicleId}/${VEHICLE_FUELS_QUERY}`,
      method
    );
  },

  getAlarms(companyId) {
    const method = "GET";
    return logic._call(
      `${COMPANIES_QUERY}/${companyId}/${SUMMARY_ALARMS_QUERY}`,
      method
    );
  },

  getDocumentsList(vehicleId) {
    const method = "GET";
    return logic._call(
      `${VEHICLES_QUERY}/${vehicleId}/${VEHICLE_FILES_QUERY}`,
      method
    );
  },

  getVehicleTechData(id) {
    const method = "GET";
    return logic._call(
      `${VEHICLES_QUERY}/${id}/${VEHICLE_TECHNICAL_DATA_QUERY}`,
      method
    );
  },

  searchVehicleByRegistration(registration) {
    const body = {
      page: "1",
      per_page: "99",
      q: {
        registration_cont: registration,
        vehicle_state_name_not_eq: "Cancelado"
      },
    };

    const method = "POST";
    return logic._call(
      `${VEHICLES_QUERY}/${VEHICLES_SEARCH_QUERY}`,
      method,
      body
    );
  },

  // getVehicleByRegistration(registration) {
  //   //    https://amac-flotas-staging.herokuapp.com/api/vehicles/search
  //   const method = "POST";

  //   const body = {
  //     page: "1",
  //     per_page: "25",
  //     q: {
  //       company_id_eq: logic.getCompany().id,
  //       registration_cont: registration,
  //       sorts: "id desc",
  //     },
  //   };
  //   return logic._call(EXPEDIENTS_MODULE_SEARCH_LIST, method, body);
  // },
};

export default appServices;
