import { useState } from "react";

const useModalRadioThree = () => {
  const [isShowingModalRadioThree, setIsShowing] = useState(false);

  function toggleRadioThree() {
    setIsShowing(!isShowingModalRadioThree);
  }

  return {
    isShowingModalRadioThree,
    toggleRadioThree,
  };
};

export default useModalRadioThree;