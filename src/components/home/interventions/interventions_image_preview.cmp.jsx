import React, { useState, useEffect } from "react";

const ShowImage = ({ showImage }) => {

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (showImage && showImage.file_url && showImage.file_url !== null) {
      setImageUrl(showImage.file_url);
    }
  }, [showImage]);

  return (
    <div>
      <div>
        <span>
          <img
            src={imageUrl}
            style={{ paddingTop: "10px" }}
          />
        </span>
      </div>
    </div>
  );
};

export default ShowImage;
