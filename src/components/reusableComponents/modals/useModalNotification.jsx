import { useState } from "react";

const useModalNotification = () => {
  const [isShowingModalNotification, setIsShowing] = useState(false);

  function toggleNotification() {
    setIsShowing(!isShowingModalNotification);
  }

  return {
    isShowingModalNotification,
    toggleNotification,
  };
};

export default useModalNotification;
