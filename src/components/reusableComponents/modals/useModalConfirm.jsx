import { useState } from "react";

const useModalConfirm = () => {
  const [isShowingModalConfirm, setIsShowing] = useState(false);

  function toggleConfirm() {
    setIsShowing(!isShowingModalConfirm);
  }

  return {
    isShowingModalConfirm,
    toggleConfirm,
  };
};

export default useModalConfirm;