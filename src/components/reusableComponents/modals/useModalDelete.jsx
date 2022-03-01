import { useState } from "react";

const useModalDelete = () => {
  const [isShowingModalDelete, setIsShowing] = useState(false);

  function toggleDelete() {
    setIsShowing(!isShowingModalDelete);
  }

  return {
    isShowingModalDelete,
    toggleDelete,
  };
};

export default useModalDelete;