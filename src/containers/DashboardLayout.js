/**
=========================================================
* Soft UI Dashboard React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useContext, useEffect } from "react";

// react-router-dom components
import { useNavigate, useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Contexts
import { AuthContext } from "contexts/AuthContext";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React context
import { useSoftUIController, setLayout } from "contexts/softUI";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  // state
  const [displayPage, setDisplayPage] = useState(false);

  // hooks
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLayout(dispatch, "dashboard");

    if (!authContext.isUserAuthenticated()) {
      navigate("/");
    } else {
      setDisplayPage(true);
    }
  }, [pathname, authContext.isUserAuthenticated()]);

  if (!displayPage) {
    return null;
  }

  return (
    <SoftBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </SoftBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
