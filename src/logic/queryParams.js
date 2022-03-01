export const templateQueryParameters = {};

// initial
templateQueryParameters.searchModalIncidenceId = "q[incidence_kind_id_eq]=";
templateQueryParameters.searchLegalIdentifier = "q[legal_identifier_eq]=";
templateQueryParameters.companyIdStartString = "q[company_id_eq]";
templateQueryParameters.sortStartString = "q[sorts]";
templateQueryParameters.sortByAscending = "asc";
templateQueryParameters.sortByDescending = "desc";
templateQueryParameters.sortByAscDesc = "desc";
templateQueryParameters.sortingByName = "name%20";
templateQueryParameters.sortingByDate = "updated_at%20";
templateQueryParameters.sortingPage = "page=";
templateQueryParameters.sortingPerPage = "per_page=";
templateQueryParameters.sortingPageQ = "q[page]=";
templateQueryParameters.sortingPerPageQ = "q[per_page]=";
templateQueryParameters.searchName = "q[name_cont]=";
templateQueryParameters.searchCodired = "q[codired_cont]=";
templateQueryParameters.searchAddress = "q[address_cont]=";
templateQueryParameters.searchZipCode = "q[zip_code_cont]=";
templateQueryParameters.searchCountry = "q[country_name_cont]=";
templateQueryParameters.searchProvince = "q[province_name_cont]=";
templateQueryParameters.searchCity = "q[city_name_cont]=";
templateQueryParameters.searchObservations = "q[observations_cont]=";
templateQueryParameters.searchCustomer = "q[customer_name_cont]=";
templateQueryParameters.searchIncidence = "q[incidence_kind_name_cont]=";
templateQueryParameters.searchFleet = "q[fleet_name_cont]=";
templateQueryParameters.searchPreventive = "q[preventive_eq]=";
templateQueryParameters.searchCountryId = "q[country_id_eq]=";
templateQueryParameters.searchNameEquals = "q[name_eq]=";
templateQueryParameters.searchProvinceId = "q[province_id_eq]=";
templateQueryParameters.searchBrandId = "q[brand_id_eq]=";
templateQueryParameters.searchZoneId = "q[zone_id_eq]=";
templateQueryParameters.searchSubzoneId = "q[subzone_id_eq]=";
templateQueryParameters.searchUnityId = "q[unity_id_eq]=";
templateQueryParameters.searchProvinceCountryId = "&q[province_country_id_eq]=";
templateQueryParameters.searchClientCustomer =
  "q[company_client_customer_id_eq]=";
templateQueryParameters.searchCompanyClient = "q[company_client_id_eq]=";

// 'frecuencies'
templateQueryParameters.searchExpirations = "q[expirations_eq]=";
templateQueryParameters.searchDaysInterval = "q[days_interval_eq]=";

// 'subzones'
templateQueryParameters.searchZones = "q[zone_name_cont]=";

// 'budget_limits'
templateQueryParameters.searchBudgetLimitNumber = "q[budget_limit_eq]=";

// 'phones'
templateQueryParameters.searchUnitsZone = "q[zone_name_cont]=";
templateQueryParameters.searchUnitsCostCenter = "q[ceco_name_cont]=";
templateQueryParameters.searchUnitsCodired = "q[codired_cont]=";
templateQueryParameters.searchName = "q[name_cont]=";
templateQueryParameters.searchExpirations = "q[expirations_eq]=";
templateQueryParameters.searchDaysInterval = "q[days_interval_eq]=";

// 'workshops'
templateQueryParameters.vehicleRegEq = "q[registration_eq]=";
templateQueryParameters.workshopKindIdEq = "q[workshop_kind_id_eq]=";
templateQueryParameters.searchWorkshopArchiveName = "q[name_cont]=";
templateQueryParameters.searchWorkshopArchiveType =
  "q[file_content_type_cont]=";
templateQueryParameters.searchWorkshopArchiveFrom = "q[date_file_gteq]=";
templateQueryParameters.searchWorkshopArchiveTo = "q[date_file_lteq]=";
templateQueryParameters.searchmaintenance = "q[maintenance_eq]=";
templateQueryParameters.searchgeneral_mechanics = "q[general_mechanics_eq]=";
templateQueryParameters.searchmoons = "q[moons_eq]=";
templateQueryParameters.searchtires = "q[tires_eq]=";
templateQueryParameters.searchcrane = "q[crane_eq]=";
templateQueryParameters.searchwashed = "q[washed_eq]=";
templateQueryParameters.searchplatform = "q[platform_eq]=";
templateQueryParameters.workshopVehicleId = "q[vehicle_id_eq]=";
templateQueryParameters.workshopKind = "q[workshop_kind_id_eq]=";

// services
templateQueryParameters.searchExpedientId = "q[expedient_id_eq]=";
templateQueryParameters.searchExpedientBrand =
  "q[expedient_vehicle_brand_name_cont]=";
templateQueryParameters.searchExpedientBudget =
  "q[expedient_vehicle_budget_limit_eq]=";
templateQueryParameters.searchExpedientStateId =
  "q[full_expedient_state_id_eq]=";
templateQueryParameters.searchExpedientFleet =
  "q[full_expedient_vehicle_fleet_name_eq]=";
templateQueryParameters.searchExpedientIncidence =
  "q[incidence_kind_name_cont]=";
templateQueryParameters.searchExpedientFromDate =
  "q[expedient_start_date_date_gteq]=";
templateQueryParameters.searchExpedientClosingDate =
  "q[expedient_start_date_date_lteq]=";
templateQueryParameters.searchExpedientIsCostInvoiced =
  "q[is_cost_invoiced_id_eq]=";
templateQueryParameters.searchExpedientVehicleRegistration =
  "q[full_expedient_vehicle_registration_cont]=";
templateQueryParameters.searchExpedientCompany = "q[company_name_cont]=";
templateQueryParameters.searchExpedientVehicleModel =
  "q[expedient_vehicle_model_name_cont]=";
templateQueryParameters.searchExpedientNotReinvoice = "q[not_reinvoice_eq]=";
templateQueryParameters.searchExpedientServiceNumber = "q[expedient_id_eq]=";
templateQueryParameters.searchExpedientServiceTypeId = "q[service_kind_id_eq]=";
templateQueryParameters.searchExpedientWarrantyId =
  "q[expedient_warranty_id_eq]=";
templateQueryParameters.searchExpedientSubzone =
  "q[full_expedient_vehicle_subzone_name_cont]=";
templateQueryParameters.searchExpedientWorkshop =
  "q[workshop_description_cont]=";
templateQueryParameters.searchExpedientZone =
  "q[full_expedient_vehicle_zone_name_cont]=";
templateQueryParameters.searchExpedientAuthNumberCustomer =
  "q[full_expedient_authorization_number_eq]=";
templateQueryParameters.searchExpedientAuthNumberWorkshop =
  "q[full_expedient_authorization_number_eq]=";
templateQueryParameters.searchExpedientArchiveName = "q[name_cont]=";
templateQueryParameters.searchExpedientArchiveType =
  "q[file_content_type_cont]=";
templateQueryParameters.searchExpedientArchiveFrom = "q[date_file_gteq]=";
templateQueryParameters.searchExpedientArchiveTo = "q[date_file_lteq]=";
templateQueryParameters.searchExpedientAuthProvince = "q[province_name_cont]=";
templateQueryParameters.searchExpedientProvince =
  "q[manager_person_province_name_eq]=";
templateQueryParameters.searchExpedientUnity =
  "q[full_expedient_vehicle_unity_name_eq]=";
templateQueryParameters.searchExpedientServiceType = "q[service_kind_id_eq]=";

templateQueryParameters.searchExportationFromDate = "q[updated_at_gteq]=";
templateQueryParameters.searchExportationToDate = "q[updated_at_lteq]=";
templateQueryParameters.searchExportationType = "q[name_of_method_eq]=";
templateQueryParameters.searchExportationStatus = "q[finished_eq]=";

// 'employees'
templateQueryParameters.searchIsActiveEmployee = "q[active_eq]=";
templateQueryParameters.searchEmployeePosition =
  "q[employee_jobs_job_name_eq]=";
templateQueryParameters.searchEmployeeCompany =
  "q[employee_jobs_company_id_eq]=";

// 'full_expedients'
templateQueryParameters.searchRegistration = "q[registration_cont]=";
templateQueryParameters.searchIdentificationCode = "q[identification_code_eq]=";
templateQueryParameters.searchFleet = "q[fleet_name_cont]=";
templateQueryParameters.searchBrand = "q[brand_name_cont]=";
templateQueryParameters.searchModel = "q[model_name_cont]=";
templateQueryParameters.searchZone = "q[zone_name_cont]=";
templateQueryParameters.searchSubzone = "q[subzone_name_cont]=";
templateQueryParameters.searchUnity = "q[unity_name_cont]=";

// 'incidence_kinds'
templateQueryParameters.searchFleetId = "q[fleet_id_eq]=";
templateQueryParameters.searchFleetName = "q[fleet_name_cont]=";

// 'managers'
templateQueryParameters.searchZoneId = "q[zone_id_eq]=";
templateQueryParameters.searchIsManager = "q[user_is_manager_true]=";

templateQueryParameters.incidenceKindIdEq = "q[incidence_kind_id_eq]=";

// 'vehicles'
templateQueryParameters.searchIdentificationCode = "q[identification_code_eq]=";
templateQueryParameters.searchBrand = "q[brand_name_cont]=";
templateQueryParameters.searchModel = "q[model_name_cont]=";
templateQueryParameters.searchSubzone = "q[subzone_name_cont]=";

// 'contacts'
templateQueryParameters.searchIsActiveEmployee = "q[active_eq]=";
templateQueryParameters.searchEmployeePosition =
  "q[employee_jobs_job_name_eq]=";
templateQueryParameters.searchEmployeeCompany =
  "q[employee_jobs_company_id_eq]=";

templateQueryParameters.searchInvoiceFromDate = "q[date_gteq]=";
templateQueryParameters.searchInvoiceToDate = "q[date_lteq]=";
templateQueryParameters.searchInvoiceNumber = "q[number_eq]=";
templateQueryParameters.searchInvoiceNotValidated = "q[number_null]=";
templateQueryParameters.searchInvoiceValidated = "q[number_present]=";
templateQueryParameters.searchInvoiceExpedient = "q[expedient_cont]=";

// itv
templateQueryParameters.searchItvRegistration = "q[vehicle_registration_cont]=";
templateQueryParameters.searchItvZone = "q[vehicle_zone_name_eq]=";
templateQueryParameters.searchItvFleet = "q[vehicle_fleet_name_eq]=";
templateQueryParameters.searchItvUnity = "q[vehicle_unity_name_eq]=";
templateQueryParameters.searchItvToDate = "q[itv_group_date_date_lteq]=";
templateQueryParameters.searchItvFromDate = "q[itv_group_date_date_gteq]=";
templateQueryParameters.filterItvCustomer =
  "q[vehicle_departament_branch_company_client_customer_id_eq]=";

// maintenance
templateQueryParameters.searchMaintenanceRegistration =
  "q[vehicle_registration_cont]=";
templateQueryParameters.searchMaintenanceZone = "q[zone_name_cont]=";
templateQueryParameters.searchMaintenanceProvince =
  "q[vehicle_vehicle_location_province_name]=";
templateQueryParameters.searchMaintenanceFleet = "q[vehicle_fleet_name_eq]=";
templateQueryParameters.searchMaintenanceSubzone =
  "q[vehicle_subzone_name_cont]=";
templateQueryParameters.searchMaintenanceUnity = "q[vehicle_unity_name_cont]=";
templateQueryParameters.searchMaintenanceToDate =
  "q[maintenance_date_date_lteq]=";
templateQueryParameters.searchMaintenanceFromDate =
  "q[maintenance_date_date_gteq]=";
templateQueryParameters.searchMaintenanceMaintenance =
  "q[is_maintenance_true]=";
templateQueryParameters.searchMaintenanceAuthorized = "q[is_authorized_true]=";
templateQueryParameters.searchMaintenanceNotAuthorized =
  "q[is_not_authorized_true]=";
templateQueryParameters.searchMaintenanceKind = "q[maintenance_kind_id_eq]=";
templateQueryParameters.filterItvCompanyClient =
  "q[vehicle_departament_branch_company_client_id_eq]=";

// unity
templateQueryParameters.searchUnitsZone = "q[zone_name_cont]=";
templateQueryParameters.searchUnitsCostCenter = "q[ceco_name_cont]=";
templateQueryParameters.searchUnitsCodired = "q[codired_cont]=";
templateQueryParameters.searchUnitsProvince = "q[province_name_cont]=";
templateQueryParameters.filterCustomer = "q[customer_id_eq]=";

//POST parameters
templateQueryParameters.searchVehiclesRegistration = "registration_cont";
templateQueryParameters.searchVehiclesZone = "zone_name_cont";
templateQueryParameters.searchVehiclesSubZone = "subzone_name_cont";
templateQueryParameters.searchVehiclesProvince = "province_name_cont";
templateQueryParameters.searchVehiclesFleet = "fleet_name_cont";
templateQueryParameters.searchVehiclesUnity = "unity_name_cont";
templateQueryParameters.incidence_kind_id_eq = "q[incidence_kind_id_eq]";

// get parameters for invoices service
templateQueryParameters.fleet_id_eq = "q[fleet_id_eq]=";
templateQueryParameters.fleet_name_eq = "q[fleet_name_eq]=";
templateQueryParameters.expedient_vehicle_registration_eq =
  "q[expedient_vehicle_registration_eq]=";
templateQueryParameters.last_full_expedient_workshop_auths_authorization_nro_eq =
  "q[last_full_expedient_workshop_auths_authorization_nro_eq]=";

templateQueryParameters.vehicle_vehicle_state_name_not_eq =
  "q[vehicle_vehicle_state_name_not_eq]=";
templateQueryParameters.vehicle_registration_cont =
  "q[vehicle_registration_cont]=";
templateQueryParameters.vehicle_fleet_company_id_eq =
  "q[vehicle_fleet_company_id_eq]=";

templateQueryParameters.searchInterventionLicenseNumber =
  "q[vehicle_license_plate_cont]=";
templateQueryParameters.searchInterventionCodeEq = "q[intervention_code_eq]=";
templateQueryParameters.searchInterventionCodeCont =
  "q[intervention_code_cont]=";
templateQueryParameters.searchInterventionStatus = "q[status_eq]=";
templateQueryParameters.searchInterventionToDate = "q[created_at_lteq]=";
templateQueryParameters.searchInterventionFromDate = "q[created_at_gteq]=";

export default templateQueryParameters;
