import React, { useEffect, useState } from "react";
import FooterNavBar from "../../WalletAppComponents/footerNavBar";
import { useSpring, animated } from "react-spring";
import { useTranslation } from "react-i18next";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";

// import ConfirmActionMessage from "../../reusableComponents/confirmActionMessage";
// import { templateQueryParameters } from "../../../logic/queryParams";
// import useConfirmActionMessage from "../../../hooks/useConfirmActionMessage";
// import LoadingIcon from "../../reusableComponents/loadingIcon"

const RoutesManager = (props) => {
  const { t } = useTranslation();
  //   const action = useConfirmActionMessage();
  //   const [isLoading, setIsLoading] = useState(true);

  const [workshopData, setWorkshopData] = useState(null);

  const workshopId = sessionStorage.getItem("workshopId");

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 500,
  });
  const springPropsContent = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });
  const springPropsTable = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1500,
  });

  useEffect(() => {
    if (workshopId && workshopId !== null && workshopId !== undefined) {
      setWorkshopData(workshopId);
    }
  }, [workshopId]);

  return (
    <animated.div style={springProps}>
      <div>
        <div>
          {/* <ConfirmActionMessage {...action} /> */}
          <animated.div style={springPropsContent}>
            <div>
              <section className="hero is-warning">
                <div className="hero-body">
                  <div className="is-flex mb-3">
                    <i className="fas fa-2x fa-hard-hat"></i>
                    <p className="subtitle ml-5">{t("under_construction")}</p>
                  </div>
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                  </Box>
                  {/* <p className="title">Warning subtitle</p> */}
                </div>
              </section>
              {/* <div className="mt-6">
                <img
                  style={{ borderRadius: "5%", opacity: "80%" }}
                  src="images/maproutes-image.jpg"
                />
              </div> */}
            </div>
          </animated.div>
          {/* <LoadingIcon loading={isLoading} /> */}
        </div>
        <FooterNavBar />
      </div>
    </animated.div>
  );
};

RoutesManager.displayName = RoutesManager;
export default RoutesManager;
