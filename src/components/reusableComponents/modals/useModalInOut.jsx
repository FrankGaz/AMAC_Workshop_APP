import { useState } from "react";

const useModalInOut = () => {
  const [isShowingModalInOut, setIsShowing] = useState(false);

  function toggleInOut() {
    setIsShowing(!isShowingModalInOut);
  }

  return {
    isShowingModalInOut,
    toggleInOut,
  };
};

export default useModalInOut;