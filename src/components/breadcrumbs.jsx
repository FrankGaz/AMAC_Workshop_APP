import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BreadCrumbs = (props) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState([]);
  // ComponentDidMount
  useEffect(() => {
    // This is meant to use the location react router object to extract the path and extracts it to an array to later use for the breadcrumbs.
    // slice(1) is used to eliminate the first element as it is blank after doing split {example url: /services/example   after split ["",services,example]}
    const path = props && props.location && props.location.pathname.split("/");
    const pathName = path && path.slice(1);
    setUrl(pathName);
  }, [props]);

  return (
    <></>
    // <div>
    //     <div className="flex-containerInlineBetween mb-3">
    //       <div className="flex-content-blockLeft">
    //         <nav
    //           className="breadcrumb has-bullet-separator is-small"
    //           aria-label="breadcrumbs"
    //         >
    //           <ul>
    //             <li>
    //               <span className="icon is-small">
    //                 <a href="/home" aria-current="page" className="textGreyIMP">
    //                   <i className="fas fa-home" aria-hidden="true"></i>
    //                 </a>
    //               </span>
    //             </li>
    //             {url &&
    //               url.map((path, index) => {
    //                 return (
    //                   <li key={index}>
    //                     <span></span>
    //                     <a
    //                       href={"/" + path}
    //                       aria-current="page"
    //                       className="textGreyIMP"
    //                     >
    //                       {t(path)}
    //                     </a>
    //                   </li>
    //                 );
    //               })}
    //           </ul>
    //         </nav>
    //       </div>
    //     </div>
    //   </div>
  );
};

export default BreadCrumbs;
