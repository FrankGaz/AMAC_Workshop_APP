import { useState } from "react";

const useModalInterventionDone = () => {
  const [isShowingModalInterventionDone, setIsShowing] = useState(false);

  function toggleInterventionDone() {
    setIsShowing(!isShowingModalInterventionDone);
  }

  return {
    isShowingModalInterventionDone,
    toggleInterventionDone,
  };
};

export default useModalInterventionDone;
