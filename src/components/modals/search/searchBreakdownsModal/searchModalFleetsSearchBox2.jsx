import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useModal from "../../../../hooks/useModal.hook";
import SearchCustomersModal from "../searchCustomersModal/searchCustomersModal";

// const SearchModalFleetsSearchBox = props => {
//   // translation API from reactI18next
//   const { t } = useTranslation()

//   // state that manages the inputs
//   // manages the name input to search for
//   const [items, setItems] = useState({})

//   const handleInputChange = event => {
//     const target = event.target
//     const value = target.value
//     const name = target.name
// 		/*
// 		Handles the state change
//         */
//     setItems(prevState => ({
//       ...prevState,
//       [name]: value
//     }))
//   }

//   const handleSearchClick = event => {
//     event.preventDefault()
//     props.requestSearch({
//       searchName: items && items.name,
//       searchObservations: items && items.observations,
//       searchCustomer: items && items.customer
//     })
//   }

//   const handleClearSearch = event => {
//     event.preventDefault()
//     setItems({})
//     return props.requestSearch({
//       clear: true
//     })
//   }

//   // Handles and updates data when clicked on the customer
//   const handleSearchSelectionClick = item => {
//       setItems(prevState => ({
//         ...prevState,
//         customer: item && item.name
//       }))
//   }

//   const customersModal = useModal(handleSearchSelectionClick)

//   return <div className="col-md-8 widget-search widget-container-col ui-sortable">
//     {customersModal.showModal && <SearchCustomersModal {...customersModal} />}
//     <div className="widget-box ui-sortable-handle collapsed">
//       <div className="widget-header widget-header-large">
//         <div className="col-gray-bg only-padding-top10">
//           <form noValidate>
//             <div className="col-md-6">
//               <input
//                 onChange={handleInputChange}
//                 value={(items && items.name) || ''}
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 id="search_fleets_name_cont"
//                 placeholder={t('fleet')}
//                 maxLength="76" />
//             </div>

//             <div className="col-md-3">
//               <button
//               type="button"
//                 onClick={handleSearchClick}
//                 className="btn btn-purple btn-sm block full" >
//                 <i className="fa fa-search"></i>
//                 {t('search')}</button>
//             </div>
//             <div className="col-md-2">
//               <button
//               type="button"
//                 onClick={(e) => handleClearSearch(e)}
//                 className="btn btn-default btn-sm block full"
//                 alt={t('clear_search')}
//                 title={t('clear_search')}>
//                 <i className="fa fa-eraser"></i>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <div className="widget-body">
//         <div className="widget-main search-box">
//           <div className="col-gray-bg">
//             <form className="padding-left12" noValidate>
//               <div className="col-md-4">
//                 <input
//                   type="text"
//                   onChange={handleInputChange}
//                   value={(items && items.observatins) || ""}
//                   className="form-control"
//                   name="observations"
//                   id="search_fleets_observations_cont"
//                   placeholder={t('observations')}
//                   maxLength="76" />
//               </div>

//               <div className="col-md-4 form-group widgt-input has-feedback">
//                 <span className="block input-icon input-icon-right">
//                   <input
//                     onChange={handleInputChange}
//                     value={(items && items.customer) || ""}
//                     type="text"
//                     className="form-control"
//                     name="customer"
//                     id="search_fleets_customer_name_cont"
//                     placeholder={t('customer')}
//                     maxLength="76" />
//                 </span>
//               </div>

//               <div className="col-md-1 btn-widget-input-sh">
//                 <a href="#/" onClick={customersModal.openModal} className="btn btn-primary btn-sm block auto link-input-search-ctrlwidth" ><i className="fa fa-search"></i></a>
//               </div>
//             </form>
//             <div className="clearfix"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>

// }

// export default SearchModalFleetsSearchBox

const SearchModalBreakdownsSearchBox = (props) => {
  // hook that manages translations
  const { t } = useTranslation();

  // manages the name input to search for
  const [nameInput, setNameInput] = useState("");

  const handleInputChange = (event) => {
    const {
      target: { value, name },
    } = event;
    // name === "name" ? setNameInput(value) : null;
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    props.requestSearch({
      searchName: nameInput,
    });
  };

  const handleClearSearch = (event) => {
    event.preventDefault();
    setNameInput("");
    return props.requestSearch({
      clear: true,
    });
  };

  return (
    <div className="col-md-10 widget-search widget-container-col ui-sortable">
      <div className="widget-box ui-sortable-handle collapsed">
        <div className="widget-header widget-header-large">
          <div className="col-gray-bg only-padding-top10">
            <form noValidate>
              <div className="col-md-4">
                <input
                  onChange={handleInputChange}
                  value={nameInput || ""}
                  type="text"
                  className="form-control"
                  name="name"
                  id="search_branches"
                  placeholder={t("service")}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModalBreakdownsSearchBox;
