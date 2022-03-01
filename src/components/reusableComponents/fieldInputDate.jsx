import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import moment from "moment";
import DayPicker from "react-day-picker";

const FieldInputDate = ({
  input,
  name,
  label,
  isRequired,
  withLabel,
  isValid,
  columnSize,
  doInputCheck,
  isDisabled,
  isSearch,
  fromDate,
  toDate,
}) => {
  const { t } = useTranslation();
  const [field, setField] = useState("");
  const [display, setDisplay] = useState("");
  const [isRequiredInput, setIsRequiredInput] = useState(false);
  const [isAfter, setIsAfter] = useState(false);
  const [isBefore, setIsBefore] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isValidInput, setIsValidInput] = useState(null);
  const [hasLabel, setHasLabel] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [month, setMonth] = useState(null);
  const inputEl = useRef();
  const wrapperRef = useRef();

  const MONTHS = [
    t("January"),
    t("February"),
    t("March"),
    t("April"),
    t("May"),
    t("June"),
    t("July"),
    t("August"),
    t("September"),
    t("October"),
    t("November"),
    t("December"),
  ];

  const DAYS = [
    t("Sun"),
    t("Mon"),
    t("Tue"),
    t("Wed"),
    t("Thu"),
    t("Fri"),
    t("Sat"),
  ];

  // CSS classes that are used to declare the class that hides error icons in the input
  const collapseElementClass = "collapse";
  const showElementClass = "";
  const columnWidth = columnSize ? `col-md-${columnSize}` : "col-md-12";

  // state that controls required input error icon
  const [showRequiredError, setShowRequiredError] = useState(
    collapseElementClass
  );

  useEffect(() => {
    if (withLabel === false) {
      setHasLabel(withLabel);
    }
    // set default input to null to show today date
    if (_.isNull(input) || input === "") {
      // resetDate();
      setField(null);
      setDisplay("");
      setIsTouched(false);
      setIsValidInput(isSearch ? !isSearch : true);
    } else {
      const fecha = moment(input).format("DD/MM/YYYY");
      setField(input);
      setDisplay(fecha);
      setIsTouched(true);
      setIsValidInput(true);
    }
    if (isRequired && !isTouched) {
      setIsValidInput(false);
    }

    document.addEventListener("keydown", handleReturnPress);
    return () => {
      document.removeEventListener("keydown", handleReturnPress);
    };
  }, [input]);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  const handleReturnPress = (e) => {
    if (e.keyCode === 13) {
      e.target.blur();
      setShowCalendar(false);
    } else {
      if (e.target.name === "date_file" && e.keyCode === 8) {
        setShowCalendar(false);
        setField("");
      }
    }
  };

  const validations = (value) => {
    setIsValidInput(true);

    const validDate = moment(value, "YYYY-MM-DD", true).isValid();

    // Validations
    if (validDate || _.isNull(value) || value === "") {
      setIsValidInput(true);
    } else {
      setIsValidInput(false);
    }

    if (isRequired && _.isNull(value)) {
      setShowRequiredError(showElementClass);
      setIsRequiredInput(false);
      setIsValidInput(false);
    } else {
      setIsRequiredInput(true);
      setShowRequiredError(collapseElementClass);
      setIsValidInput(true);
    }
    if (!value) {
      if (isRequired) {
        setShowRequiredError(showElementClass);
        setIsRequiredInput(true);
        setIsValidInput(false);
      } else {
        setIsRequiredInput(false);
        setIsValidInput(true);
      }
      setIsBefore(true);
      setIsAfter(true);
    }
    if (value && fromDate) {
      let normalValue = value;
      /* if (value.contains('/')) {
const dd = value.split('/');
normalValue = `${dd[2]}-${dd[1]}-${dd[0]}`;
} */
      const validFrom = moment(normalValue).isSameOrAfter(fromDate);
      if (!validFrom) {
        setShowRequiredError(showElementClass);
        setIsValidInput(false);
        setIsAfter(false);
        setIsBefore(true);
      }
    }
    if (value && toDate) {
      let normalValue = value;
      /*  if (value.contains('/')) {
const dd = value.split('/');
normalValue = `${dd[2]}-${dd[1]}-${dd[0]}`;
} */
      const validFrom = moment(normalValue).isSameOrBefore(toDate);
      if (!validFrom) {
        setShowRequiredError(showElementClass);
        setIsValidInput(false);
        setIsAfter(true);
        setIsBefore(false);
      }
    }
  };

  const handleInputBlur = (event) => {
    const valor = event.target.value;

    if (valor !== "") {
      setShowCalendar(false);
      //
      //const hasSlash = valor && valor.contains("/");
      const slashedString = valor.indexOf("/");
      if (slashedString !== -1) {
        const separa = valor.split("/");
        const fecha = `${separa[2]}-${separa[1]}-${separa[0]}`;
        setField((prev) => fecha);
        if (!_.isUndefined(fecha) && !_.isNull(fecha) && fecha !== "") {
          validations(fecha);

          doInputCheck({
            target: {
              name,
              value: fecha,
            },
          });
        }
      } else {
        setField((prev) => valor);
        //
        if (!_.isNull(valor) && valor !== "") {
          validations(valor);

          doInputCheck({
            target: {
              name,
              value: valor,
            },
          });
        }
      }
    }
  };

  const handleDateChange = (e) => {

    setShowCalendar(false);
    if (!_.isNull(e.target.value)) {
      if (e.target.value !== "") {
        setField(e.target.value);
        setDisplay(e.target.value);
        setIsTouched(true);
      } else {
        setField("");
        setDisplay("");
      }
    }
  };

  const handleCalendarDateChange = (value) => {
    setShowCalendar(false);
    if (!_.isNull(value)) {
      if (value !== "") {
        const fecha = moment(value).format("YYYY-MM-DD");
        setField((prev) => fecha);
        setField((prev) => value);
        //
        setIsTouched(true);
        validations(fecha);
        if (!_.isNull(fecha) && fecha !== "") {
          doInputCheck({
            target: {
              name,
              value: fecha,
            },
          });
        }
      } else {
        setField("");
      }
    }
  };

  const handleYearMonthChange = (value) => {
    setMonth(value);
  };

  const openCalendar = (e) => {
    if (field && field !== "") {
      setMonth(input && new Date(field));
    }
    setShowCalendar(true);
  };

  useEffect(() => {
    isValid(name, isValidInput);
  }, [isValidInput]);

  useEffect(() => {
    if (isTouched) {
      validations(field);
    }
  }, [field, isTouched]);

  const formatDateLocal = (value) => {
    let fecha = value;
    if (value !== "") {
      const dt = value.split("-");
      fecha = `${dt[2]}/${dt[1]}/${dt[0]}`;
    }
    return fecha;
  };

  const resetDate = () => {
    setField(null);
    setDisplay(null);
    inputEl.current.focus();
    doInputCheck({
      target: {
        name,
        value: null,
      },
    });
  };

  const today = () => {
    setField((prev) => moment().format("YYYY-MM-DD"));
    setDisplay(moment().format("DD/MM/YYYY"));
    setMonth(new Date());
    validations(moment().format("YYYY-MM-DD"));
    inputEl.current.focus();
    doInputCheck({
      target: {
        name,
        value: moment().format("YYYY-MM-DD"),
      },
    });
  };

  return (
    <div style={{ marginTop: hasLabel ? "-14px" : "0px" }}>
      <div
        className={
          isValidInput === true
            ? `${columnWidth} form-group has-feedback `
            : isValidInput === false
            ? `${columnWidth} form-group has-error has-feedback `
            : `${columnWidth} form-group has-feedback `
        }
        style={{ position: "relative", marginTop: hasLabel ? "-14px" : "0px" }}
      >
        {hasLabel ? (
          <label className="control-label show-hide" htmlFor={label || name}>
            {t(label || name)}
            {isRequired ? " *" : ""}
          </label>
        ) : (
          ""
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div flex="1">
            <span className="block input-icon">
              <input
                ref={inputEl}
                onChange={handleDateChange}
                onBlur={handleInputBlur}
                type="text"
                id={name}
                name={name}
                value={display || ""}
                className="form-control"
                placeholder={t(label || name)}
                disabled={isDisabled}
                required={isRequired}
                autoComplete="off"
              />
              <i
                className="ace-icon fa fa-calendar bigger-110"
                onClick={openCalendar}
              ></i>
            </span>
          </div>
          {!_.isNull(isValidInput) ? (
            <div style={{ padding: "0px 0px 0px 10px" }}>
              <span style={{ marginRight: "10px" }}>
                <i
                  className="ace-icon fa fa-caret-square-o-down bigger-110"
                  onClick={today}
                ></i>
              </span>
              <span onClick={() => resetDate()}>
                {isValidInput === true ? (
                  <i className="ace-icon has-success fa fa-times-circle"></i>
                ) : isValidInput === false ? (
                  <i className="ace-icon fa fa-times-circle"></i>
                ) : null}
              </span>
            </div>
          ) : null}
        </div>

        {!isRequiredInput && (
          <p className={`help-block form-error ${showRequiredError}`}>
            <i className="fa fa-warning"></i> {t("field_required_message")}
          </p>
        )}
        {!isAfter && (
          <p className={`help-block form-error ${showRequiredError}`}>
            <i className="fa fa-warning"></i> {t("date_should_be_after")}
          </p>
        )}
        {!isBefore && (
          <p className={`help-block form-error ${showRequiredError}`}>
            <i className="fa fa-warning"></i> {t("date_should_be_before")}
          </p>
        )}
        {isValidInput === "f" && (
          <p className={`help-block form-error`}>
            <i className="fa fa-warning"></i>
            {t("invalid_date")}
          </p>
        )}

        {showCalendar && (
          <div
            ref={wrapperRef}
            style={{
              zIndex: "10",
              top: hasLabel ? "60px" : "35px",
              position: "absolute",
              backgroundColor: "white",
              width: "215px",
              padding: "5px",
              textAlign: "center",
              borderRadius: "5px",
              MozBoxShadow: "0px 2px 5px 0px rgba(0,0,0,0.4)",
              WebkitBoxShadow: "0px 2px 5px 0px rgba(0,0,0,0.4)",
              boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.4)",
            }}
          >
            <DayPicker
              locale={"es"}
              onDayFocus={handleCalendarDateChange}
              firstDayOfWeek={1}
              month={month}
              canChangeMonth={false}
              selectedDays={new Date(field)}
              firstDayOfWeek={1}
              weekdaysShort={DAYS}
              months={MONTHS}
              captionElement={({ date, localeUtils }) => {
                return (
                  <YearMonthForm
                    date={date}
                    localeUtils={localeUtils}
                    onChange={handleYearMonthChange}
                  />
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear - 10, 0);
const toMonth = new Date(currentYear + 10, 11);

const YearMonthForm = ({ date, localeUtils, onChange }) => {
  const { t } = useTranslation();

  const MONTHS = [
    t("January"),
    t("February"),
    t("March"),
    t("April"),
    t("May"),
    t("June"),
    t("July"),
    t("August"),
    t("September"),
    t("October"),
    t("November"),
    t("December"),
  ];

  const DAYS = [
    t("Sun"),
    t("Mon"),
    t("Tue"),
    t("Wed"),
    t("Thu"),
    t("Fri"),
    t("Sat"),
  ];
  const [ano, setAno] = useState(date.getFullYear());
  const [mes, setMes] = useState();
  const months = MONTHS;

  useEffect(() => {
    setAno(date.getFullYear());
    setMes(date.getMonth());
  }, [date]);

  useEffect(() => {
    setMes(date.getMonth());
  }, []);

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleAnoChange = (cambio) => {
    setAno(ano + cambio);
    onChange(new Date(ano + cambio, mes));
  };

  const handleChange = (e) => {
    const month = e.target.value;
    setMes(month);
    onChange(new Date(ano, month));
  };

  return (
    <div style={{ padding: "10 px 20px" }} className="DayPicker-Caption">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          borderRadius: "5px",
        }}
      >
        <div
          style={{ padding: "10px", fontWeight: "bold" }}
          onClick={() => handleAnoChange(-10)}
        >
          {" "}
          {"<<"}{" "}
        </div>
        <div
          style={{ padding: "10px", fontWeight: "bold" }}
          onClick={() => handleAnoChange(-1)}
        >
          {" "}
          {"<"}{" "}
        </div>
        <span style={{ flex: "1", textAlign: "center", fontWeight: "bold" }}>
          {ano}
        </span>
        <div
          style={{ padding: "10px", fontWeight: "bold" }}
          onClick={() => handleAnoChange(1)}
        >
          {" "}
          {">"}{" "}
        </div>
        <div
          style={{ padding: "10px", fontWeight: "bold" }}
          onClick={() => handleAnoChange(10)}
        >
          {" "}
          {">>"}{" "}
        </div>
      </div>
      <select
        style={{ width: "100%" }}
        name="month"
        onChange={handleChange}
        value={date.getMonth()}
      >
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};
export default FieldInputDate;
