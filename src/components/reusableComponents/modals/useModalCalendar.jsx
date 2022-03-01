import { useState } from "react";

const useModalCalendar = () => {
  const [isShowingModalCalendar, setIsShowing] = useState(false);

  function toggleCalendar() {
    setIsShowing(!isShowingModalCalendar);
  }

  return {
    isShowingModalCalendar,
    toggleCalendar,
  };
};

export default useModalCalendar;
