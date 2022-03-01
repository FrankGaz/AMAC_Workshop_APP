import React from "react";

const AlarmsTableItem = ({item}) => {
  
    return (
      <tr key={item.id}>
        {/* <td>{(item && item.my_alarm && item.my_alarm.alarm && item.my_alarm.alarm.id) || ''}</td> */}
        <th>{(item && item.my_alarm && item.my_alarm.alarm && item.my_alarm.alarm.name) || ''}</th>
        <td>{(item && item.my_alarm && item.my_alarm.alarm && item.my_alarm.alarm.alarm_kind_id) || ''}</td>
        <td>{(item && item.my_alarm && item.my_alarm.alarm && item.my_alarm.alarm.anticipation_in_km) || ''}</td>
        <td>{(item && item.my_alarm && item.my_alarm.alarm && item.my_alarm.alarm.anticipation_in_months) || ''}</td>
      </tr>
    );
  };

  export default AlarmsTableItem;