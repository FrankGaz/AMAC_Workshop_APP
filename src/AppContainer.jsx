import React from "react";

import { useSpring, animated } from "react-spring";
import NavBar from "./components/WalletAppComponents/navBar";
import { withRouter } from "react-router-dom";
import BreadCrumbs from "./components/breadcrumbs";

const AppContainer = (props) => {
  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 500,
  });
  return (
    <>
      <animated.div style={springProps}>
        <div className="container appContainer is-fluid mt-xl mb-6 pb-6">
          <NavBar {...props} />   
          <div className="pt-3">
            <div>
              <BreadCrumbs {...props} />
              {props.children}
            </div>
          </div>
        </div>
      </animated.div>
    </>
  );
};

export default withRouter(AppContainer);
