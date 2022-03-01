import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useModal from "../../../../hooks/useModal.hook";
import SearchFleetsModal from "../searchFleetModal/searchFleetsModal";
import SearchZonesModal from "../searchZonesModal/searchZonesModal";
import FieldInput from "../../../reusableComponents/fieldInput";

const SearchModalVehiclesSearchBox = ({ requestSearch }) => {
  // hook that manages translations
  const { t } = useTranslation();

  // state that manages the inputs

  // manages the name input to search for
  const [registrationInput, setRegistrationInput] = useState("");
  const [identificationCodeInput, setIdentificationCodeInput] = useState("");

  const [fleetInput, setFleetInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [zoneInput, setZoneInput] = useState("");
  const [subzoneInput, setSubzoneInput] = useState("");
  const [unityInput, setUnityInput] = useState("");

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "registration") {
      setRegistrationInput(value);
    }

    if (name === "identification_code") {
      setIdentificationCodeInput(value);
    }

    if (name === "fleet") {
      setFleetInput(value);
    }
    if (name === "brand") {
      setBrandInput(value);
    }
    if (name === "model") {
      setModelInput(value);
    }
    if (name === "zone") {
      setZoneInput(value);
    }
    if (name === "subzone") {
      setSubzoneInput(value);
    }
    if (name === "unity") {
      setUnityInput(value);
    }

    // name === "registration" ? setRegistrationInput(value) : null;
    // name === "identification_code" ? setIdentificationCodeInput(value) : null;
    // name === "fleet" ? setFleetInput(value) : null;
    // name === "brand" ? setBrandInput(value) : null;
    // name === "model" ? setModelInput(value) : null;
    // name === "zone" ? setZoneInput(value) : null;
    // name === "subzone" ? setSubzoneInput(value) : null;
    // name === "unity" ? setUnityInput(value) : null;
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    requestSearch({
      searchRegistration: registrationInput,
      searchIdentificationCode: identificationCodeInput,
      searchFleet: fleetInput,
      searchBrand: brandInput,
      searchModel: modelInput,
      searchZone: zoneInput,
      searchSubzone: subzoneInput,
      searchUnity: unityInput,
    });
  };

  const handleClearSearch = (event) => {
    event.preventDefault();
    setRegistrationInput("");
    setIdentificationCodeInput("");
    setFleetInput("");
    setBrandInput("");
    setModelInput("");
    setZoneInput("");
    setSubzoneInput("");
    setUnityInput("");
    //
    requestSearch();
  };

  const handleSelectFleet = (item) => {
    setFleetInput(item.name);
  };
  const handleSelectBrand = (item) => {
    setBrandInput(item.name);
  };
  const handleSelectModel = (item) => {
    setModelInput(item.name);
  };
  const handleSelectZone = (item) => {
    setZoneInput(item.name);
  };
  const handleSelectSubzone = (item) => {
    setSubzoneInput(item.name);
  };
  const handleSelectUnity = (item) => {
    setUnityInput(item.name);
  };

  const handleIsValid = () => true;

  const fleetsModal = useModal(handleSelectFleet);
  const brandsModal = useModal(handleSelectBrand);
  const modelModal = useModal(handleSelectModel);
  const zonesModal = useModal(handleSelectZone);
  const subzonesModal = useModal(handleSelectSubzone);
  const unitiesModal = useModal(handleSelectUnity);

  return (
    <div>
      {fleetsModal.showModal && <SearchFleetsModal {...fleetsModal} />}
      {/* {brandsModal.showModal && <SearchBrandsModal {...brandsModal} />} */}
      {/* {modelModal.showModal && <SearchModelsModal {...modelModal} />} */}
      {zonesModal.showModal && <SearchZonesModal {...zonesModal} />}
      {/* {subzonesModal.showModal && <SearchSubzonesModal {...subzonesModal} />}
      {unitiesModal.showModal && <SearchUnitiesModal {...unitiesModal} />} */}

      <div className="col-md-11 widget-container">
        <div className="widget-box">
          <div className="widget-header widget-header-large row widget-header-btns">
            <div className="col-gray-bg only-padding-top10">
              <form noValidate>
                <div className="col-md-6">
                  <input
                    onChange={handleInputChange}
                    value={registrationInput || ""}
                    type="text"
                    className="form-control"
                    name="registration"
                    id="registration"
                    placeholder={t("registration")}
                    maxLength="76"
                  />
                </div>
                <div className="col-md-2">
                  <button
                    onClick={handleSearchClick}
                    className="btn btn-purple btn-sm block full"
                  >
                    <i className="fa fa-search"></i> {t("search")}
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    onClick={(e) => handleClearSearch(e)}
                    className="btn btn-default btn-sm block full"
                    alt={t("clear_search")}
                    title={t("clear_search")}
                  >
                    <i className="fa fa-eraser"></i>
                  </button>
                </div>
              </form>
              <a
                className="col-md-2 no-padding-right faa-parent animated-hover"
                data-action="collapse"
              >
                <div className="widget-toolbar widget-toolbar-clr">
                  <i className="ace-icon fa fa-chevron-down bigger-125 faa-pulse"></i>
                </div>
              </a>
            </div>
          </div>
          <div className="widget-body">
            <div className="widget-main search-box">
              <div className="col-gray-bg">
                <form className="padding-left12" noValidate>
                  <div className="col-md-12"></div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      onChange={handleInputChange}
                      value={identificationCodeInput || ""}
                      className="form-control"
                      name="identification_code"
                      id="identification_code"
                      placeholder={t("identification_code")}
                      maxLength="76"
                    />
                  </div>
                  <div className="col-md-4">
                    <FieldInput
                      input={fleetInput || ""}
                      name={"fleet"}
                      withLabel={false}
                      maxLength={76}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={10}
                      hasActivator={true}
                      activator={true}
                      doModalClick={() => fleetsModal.openModal()}
                      doInputCheck={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <FieldInput
                      input={brandInput || ""}
                      name={"brand"}
                      withLabel={false}
                      maxLength={76}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={10}
                      hasActivator={true}
                      activator={true}
                      doModalClick={() => brandsModal.openModal()}
                      doInputCheck={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <FieldInput
                      input={modelInput || ""}
                      name={"model"}
                      withLabel={false}
                      maxLength={76}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={10}
                      hasActivator={true}
                      activator={true}
                      doModalClick={() => modelModal.openModal()}
                      doInputCheck={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <FieldInput
                      input={zoneInput || ""}
                      name={"zone"}
                      withLabel={false}
                      maxLength={76}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={10}
                      hasActivator={true}
                      activator={true}
                      doModalClick={() => zonesModal.openModal()}
                      doInputCheck={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <FieldInput
                      input={subzoneInput || ""}
                      name={"subzone"}
                      withLabel={false}
                      maxLength={76}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={10}
                      hasActivator={true}
                      activator={true}
                      doModalClick={() => subzonesModal.openModal()}
                      doInputCheck={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <FieldInput
                      input={unityInput || ""}
                      name={"unity"}
                      withLabel={false}
                      maxLength={76}
                      isRequired={false}
                      isValid={handleIsValid}
                      columnSize={10}
                      hasActivator={true}
                      activator={true}
                      doModalClick={() => unitiesModal.openModal()}
                      doInputCheck={handleInputChange}
                    />
                  </div>
                </form>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModalVehiclesSearchBox;
