import { useState } from "react";

const useModalServiceDone = () => {
  const [isShowingModalServiceDone, setIsShowing] = useState(false);

  function toggleServiceDone() {
    setIsShowing(!isShowingModalServiceDone);
  }

  return {
    isShowingModalServiceDone,
    toggleServiceDone,
  };
};

export default useModalServiceDone;
