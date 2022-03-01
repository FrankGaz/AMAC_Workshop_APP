import React, { useEffect, useState } from "react";
import appServices from "../../appServices.service";
import AlarmsTableItem from "./alarms_table_item.cmp";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";

const AlarmsComponent = (props) => {

  const [userData, setUserData] = useState(null);
  // const [employeeData, setEmployeeData] = useState(null);
  const [alarmsData, setAlarmsData] = useState([]);

  useEffect(() => {
    userData == null && getAlarmsData();
  }, []);

  const getAlarmsData = () => {
    const userId = sessionStorage.getItem("gloveBoxDataSet");
    userId &&
      userId !== undefined &&
      appServices
        .getUser(2103)
        // .getUser(userId)
        .then((data) => {
          setUserData(data.json.user);
          // setEmployeeData(data.json.user.employee);
          if (data &&
            data.json &&
            data.json.user &&
            data.json.user.person &&
            data.json.user.person.company &&
            data.json.user.person.company.id &&
            data.json.user.person.company.id !== null) {
              appServices
              .getAlarms(data.json.user.person.company.id)
              .then((data) => {
                data &&
                  data.json &&
                  data.json.my_alarms &&
                  data.json.my_alarms.length > 0 &&
                  data.json.my_alarms[0] &&
                  setAlarmsData(data.json.my_alarms);
              });
            }

        })
        .catch((err) => {
          console.log("APP ERROR @ getUser :>> ", err);
        });
  };

  const GoHome = () => {
    props.history.push({
      pathname: `/home`,
    });
  };

  const ALARMS_TABLE_HEAD = [ "Name", "Kind", "Ant. Kms", "Ant. Months"];

  return (
    <>
      <div>
      <p className="title is-4 my-3">Alertas y Avisos</p>
      </div>
      {/* <div className="is-fab has-content-right">
        <button className="button is-redAmac_GoHome is-rounded" onClick={GoHome}>
          <span className="icon">
            <i className="fas fa-home"></i>
          </span>
        </button>
      </div> */}
      <div className="table-container">
        {alarmsData && alarmsData !== null && (<table className="table is-striped is-bordered is-fullwidth is-narrow">
          <thead>
            <tr>
              {ALARMS_TABLE_HEAD.map((item) => {
                return (
                  <th title="" key={item}>
                    <div>
                      <span>{item}</span>
                    </div>
                  </th>
                );
              })}
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody>
            {alarmsData &&
              alarmsData !== null &&
              alarmsData.length > 0 &&
              alarmsData[0] &&
              alarmsData.map((item, index) => (
                <AlarmsTableItem key={index} item={item} />
              ))}
          </tbody>
        </table>)}
      </div>
      <FooterNavBar/>
    </>
  );
};

export default AlarmsComponent;