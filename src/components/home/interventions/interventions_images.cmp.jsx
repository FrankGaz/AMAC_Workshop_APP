import React, { useState, useEffect } from "react";
import ShowImage from "./interventions_image_preview.cmp";

const ShowImagesComponent = ({ images }) => {

  const [imagesArray, setImagesArray] = useState([]);

  useEffect(() => {
    images && setImagesArray(images);
  }, [images]);

  return (
    <div>
      {imagesArray &&
        imagesArray[0] &&
        imagesArray[0].file_url &&
        imagesArray[0].file_url !== null &&
        imagesArray[0].file_url.length > 0 &&
        imagesArray.map((element, index) => (
          <ShowImage
            key={index}
            showImage={element}
            // doDelete={handleShowDeleteModal}
          />
        ))}
    </div>
  );
};

export default ShowImagesComponent;
