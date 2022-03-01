import React, { useState, useEffect } from "react";
import InterventionsDocumentsTableComponent from "./interventions_documents_table.cmp";


const ShowDocumentsComponent = ({ documentsList }) => {

  const [documentsArray, setDocumentsArray] = useState([]);


  useEffect(() => {
    documentsList && setDocumentsArray(documentsList);
  }, [documentsList]);


  return (
    <div>
      {documentsArray &&
        documentsArray[0] &&
        documentsArray[0].file_url &&
        documentsArray[0].file_url !== null &&
        documentsArray[0].file_url.length > 0 && (
          <InterventionsDocumentsTableComponent
            documentsList={documentsArray}
          />
        )}
    </div>
  );
};

export default ShowDocumentsComponent;
