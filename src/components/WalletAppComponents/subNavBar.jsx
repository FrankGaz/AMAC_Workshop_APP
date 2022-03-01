import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SubNavBar = () => {
  const { t } = useTranslation();
  const [haveHero, setHaveHero] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const [path, setPath] = useState(null);

  useEffect(() => {
    getPathPages();
  }, []);

  const getPathPages = () => {
    const interventions = "interventions";
    const maintenancesmanager = "maintenancesmanager";
    const vehicles = "vehicles";
    const itv = "itv";
    const maintenances = "maintenances";

    const pathRoute = window.location.href;

    if (pathRoute != null && pathRoute.includes(interventions)) {
      setPath(interventions);
      setHaveHero(true);
    }
    if (pathRoute != null && pathRoute.includes(maintenancesmanager)) {
      setPath(maintenancesmanager);
      setHaveHero(true);
    }
    if (pathRoute != null && pathRoute.includes(vehicles)) {
      setPath(vehicles);
      setHaveHero(true);
    }
    if (pathRoute != null && pathRoute.includes(itv)) {
      setPath(itv);
      setHaveHero(true);
    }
    if (pathRoute != null && pathRoute.includes(maintenances)) {
      setPath(maintenances);
      setHaveHero(true);
    } else {
      setHaveHero(false);
    }

  };

  return (
    <>
      {windowSize && windowSize < 1024 && haveHero === true && (
        <section className="hero redContainer">
          <div className="hero-body">
            <p className="subtitle is-size-7 textWhite">{t(path)}</p>
          </div>
        </section>
      )}
      {windowSize && windowSize >= 1024 && haveHero === true && (
        <div className="is-flex is-align-items-center">
          <span className="tag tag-location is-size-7 textRedAmac">{t(path)}</span>
        </div>
      )}
    </>
  );
};
export default SubNavBar;
