import { useState } from "react";

const useModalSendDate = () => {
  const [isShowingModalSendDate, setIsShowing] = useState(false);

  function toggleConfirm() {
    setIsShowing(!isShowingModalSendDate);
  }

  return {
    isShowingModalSendDate,
    toggleConfirm,
  };
};

export default useModalSendDate;