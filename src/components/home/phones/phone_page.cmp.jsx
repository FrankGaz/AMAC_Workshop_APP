import React from "react";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";

const PhonesComponent = (props) => {
  const GoHome = () => {
    props.history.push({
      pathname: `/home`,
    });
  };

  return (
    <>
      <div>
        <p className="title is-4 my-3">Listín de Contactos</p>
      </div>
      {/* <div className="is-fab has-content-right">
        <button
          className="button is-redAmac_GoHome is-rounded"
          onClick={GoHome}
        >
          <span className="icon">
            <i className="fas fa-home"></i>
          </span>
        </button>
      </div> */}
      <div className="box is-flex is-align-items-center">
        <a href="tel:+34600600600">
          <div className="is-flex is-align-items-center">
            <div className="icon mr-4 is-flex">
              <i className="fas fa-2x fa-phone-alt textRedAmac"></i>
            </div>
            <div>
              <p className="is-size-5 textGrey">Asistencia Carretera</p>

              <span className="">600600600</span>
            </div>
          </div>
        </a>
      </div>
      <div className="box is-flex is-align-items-center">
        <a href="tel:+34600600600">
          <div className="is-flex is-align-items-center">
            <div className="icon mr-4 is-flex">
              <i className="fas fa-2x fa-phone-alt textRedAmac"></i>
            </div>
            <div>
              <p className="is-size-5 textGrey">Compañía aseguradora</p>
              <span className="">600600600</span>
            </div>
          </div>
        </a>
      </div>
      <div className="box is-flex is-align-items-center">
        <a href="tel:+34600600600">
          <div className="is-flex is-align-items-center">
            <div className="icon mr-4 is-flex">
              <i className="fas fa-2x fa-phone-alt textRedAmac"></i>
            </div>
            <div>
              <p className="is-size-5 textGrey">Otro teléfono</p>
              <span className="">600600600</span>
            </div>
          </div>
        </a>
      </div>
      <FooterNavBar/>
    </>
  );
};

export default PhonesComponent;
