import React, { useState, useEffect } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import defaults from "./defaults";

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale });
}

const FieldInputDateMobile = ({
  selectedDateInput,
  selectedDateOutput,
  inputProps,
}) => {
  const [isSearchbox, setIsSearchBox] = useState(false);
  const [inputStyles, setInputStyles] = useState("");
  const dataPickerStyle = () => {
    return ({style :{ width: 50}});
  };
  // useEffect(() => {
  //   if (inputProps === true) {
  //     setIsSearchBox(true);
  //   }
  //   if (isSearchbox === true) {
  //     setInputStyles(dataPickerStyle);
  //   }
  // });
  const handleDateChange = (day) => {
    const current_datetime = day;
    let month = current_datetime.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    const formatted_date = `${current_datetime.getFullYear()}-${month}-${current_datetime.getDate()}`;
    selectedDateOutput(formatted_date);
  };

  const FORMAT = "DD/MM/YYYY";

  return (
    <DayPickerInput
      value={defaults.formatDateLocal(selectedDateInput)}
      selectedDays={defaults.formatDateLocal(selectedDateInput)}
      formatDate={formatDate}
      format={FORMAT}
      parseDate={parseDate}
      placeholder={(`${defaults.formatDateLocal(selectedDateInput)}`, FORMAT)}
      onDayChange={(day) => handleDateChange(day)}
      inputProps={inputStyles}
    />
  );
};

export default FieldInputDateMobile;
