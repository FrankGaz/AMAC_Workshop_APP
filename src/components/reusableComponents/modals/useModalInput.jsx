import { useState } from "react";

const useModalInput = () => {
  const [isShowingModalInput, setIsShowing] = useState(false);

  function toggleInput() {
    setIsShowing(!isShowingModalInput);
  }

  return {
    isShowingModalInput,
    toggleInput,
  };
};

export default useModalInput;