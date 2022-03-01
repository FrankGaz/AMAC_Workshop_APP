import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logic from '../../../logic/logic'
import _ from 'lodash';
import FieldInput from "../../reusableComponents/fieldInput";
import useIsValid from "../../../hooks/useIsValid.hook";
import FieldInputDate from '../../reusableComponents/fieldInputDate';
import expedient_kinds from '../../../logic/apiServices/expedientKinds.service'



const TableFilesSearchFields = ({ doRequestSearch }) => {
    // translation API from reactI18next
    const { t } = useTranslation();
  
    const initialState = {
      name: "",
      file_type: null,
      from: null,
      to: null
    };
  
    // state values
    const [newServiceData, setNewServiceData] = useState(initialState);
  
    // API call template data (for example: serviceTypes corresponds to the expedient_kinds from the api call {{url}})/expedient_kinds
    // eslint-disable-next-line no-unused-vars
    const [serviceTypes, setServiceTypes] = useState([]);

  
    // cwm
    useEffect(() => {
      logic.configureQueryParameters({});
      expedient_kinds
        .getExpedientKinds()
        .then(data => setServiceTypes(data.json.expedient_kinds))
        .catch(err => {
          console.error(err.message);
        });
    }, []);
  
    const handleSearchInputChange = (event, e) => {
      let value = null;
      let name = null;
      if (_.isNull(e) || _.isUndefined(e)) {
        name = event.target.name;
        value = event.target.value;
      } else {
        name = e.target.name;
        value = e.target.value;
      }
  
      setNewServiceData({
        ...newServiceData,
        [name]: value
      });
    };
  
    // Function that handles the search box
    const handleSearchClick = event => {
      doRequestSearch(newServiceData);
    };
  
    const handleClearSearch = event => {
      logic.configureQueryParameters({});
      setNewServiceData(initialState);
      doRequestSearch(null);
    };
  
    useEffect(() => {
    }, [newServiceData]);
  

  
    // modal hooks
    // eslint-disable-next-line no-unused-vars
    const { handleIsValid, activateActionButton } = useIsValid();
  
    return (
      <div>
        <div className="col-md-10 widget-search" style={{ paddingLeft: "0px" }}>
          <div className="widget-box">
            <div
              className="row widget-header"
              style={{ paddingLeft: "0px", marginLeft: "0px" }}
            >
              <div className="only-padding-top10">
                <div className="col-md-6" style={{ paddingLeft: "0px" }}>
                  <FieldInput
                    input={(newServiceData && newServiceData.name) || ""}
                    name="name"
                    maxLength={76}
                    isRequired={false}
                    isValid={handleIsValid}
                    doInputCheck={handleSearchInputChange}
                    withLabel={false}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <button
                  onClick={e => handleSearchClick(e)}
                  className="btn btn-purple btn-sm block full"
                  alt={t("search")}
                  title={t("search")}
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
  
              <div className="col-md-2">
                <button
                  onClick={e => handleClearSearch(e)}
                  className="btn btn-default btn-sm block full"
                  alt={t("clear_search")}
                  title={t("clear_search")}
                >
                  <i className="fa fa-eraser"></i>
                </button>
              </div>
  
              
            </div>
            <br></br>
            {/* view hidden search fields */}
            <div className="row">
              <div className="col-gray-bg">
                <div className="col-md-4 widget-search widget-container-col ui-sortable">
                  <FieldInput
                    input={(newServiceData && newServiceData.file_type) || ""}
                    name="file_type"
                    maxLength={76}
                    isRequired={false}
                    isValid={handleIsValid}
                    columnSize={12}
                    hasActivator={false}
                    activator={false}
                    doModalClick={null}
                    doInputCheck={handleSearchInputChange}
                    withLabel={false}
                  ></FieldInput>
                </div>
  
                <div className="col-md-4 widget-search widget-container-col ui-sortable">
                  <FieldInputDate
                    input={(newServiceData && newServiceData.from) || ""}
                    name={"from"}
                    isRequired={false}
                    isValid={handleIsValid}
                    columnSize={12}
                    doInputCheck={e => handleSearchInputChange(undefined, e)}
                    withLabel={false}
                  />
                </div>
                <div className="col-md-4 widget-search widget-container-col ui-sortable">
                  <FieldInputDate
                    input={(newServiceData && newServiceData.to) || ""}
                    name={"to"}
                    isRequired={false}
                    isValid={handleIsValid}
                    columnSize={12}
                    doInputCheck={e => handleSearchInputChange(undefined, e)}
                    withLabel={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default TableFilesSearchFields;
  