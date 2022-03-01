import React from "react";
import ReactDOM from "react-dom";
import DayPicker from 'react-day-picker/DayPicker';
import 'react-day-picker/lib/style.css';

const modalActive = "modal is-active";

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abrile',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const WEEKDAYS_LONG = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const WEEKDAYS_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

const ModalCalendar = ({
  isShowingModalCalendar,
  hide,
  dateInputName,
  dateSelectedOutput,
}) => {

  const handleDay = (day) => {
    const data = {
      [dateInputName]: day
    }
    dateSelectedOutput({
      ...data
    })
  };

  return (
    <>
      {isShowingModalCalendar
        ? ReactDOM.createPortal(
            <React.Fragment>
              <div className={isShowingModalCalendar && modalActive}>
                <div onClick={hide} className="modal-background"></div>
                <div className="modal-card px-2">
                  <section className="modal-card-body is-flex is-justify-content-center is-flex-direction-column is-align-items-center">
                    <DayPicker
                      onDayClick={(day) => handleDay(day)}
                      locale="it"
                      months={MONTHS}
                      weekdaysLong={WEEKDAYS_LONG}
                      weekdaysShort={WEEKDAYS_SHORT}
                      firstDayOfWeek={1}
                    />
                  </section>
                </div>
              </div>
            </React.Fragment>,
            document.body
          )
        : null}
    </>
  );
};
export default ModalCalendar;
