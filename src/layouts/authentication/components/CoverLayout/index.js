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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React
// import DefaultNavbar from "components/Navbars/DefaultNavbar";
import PageLayout from "containers/PageLayout";
import bgImage from "../../../../assets/images/bg-Image.jpg";
import logo from "../../../../assets/images/logo-ct.png";

// Authentication layout components
// import Footer from "layouts/authentication/components/Footer";

function CoverLayout({ color, header, title, description, image, top, children }) {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "2300px",
        backgroundPosition: "0 -300px",
      }}
    >
      <PageLayout>
        <Grid container justifyContent="center">
          <Grid item xs={10} sm={6} md={6} xl={6}>
            <SoftBox pt={0} px={0}>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  "justify-content": "center",
                  top: "90px",
                }}
              >
                <img src={logo} width="70%" />
              </div>
            </SoftBox>
            <SoftBox mt={top}>
              <div
                style={{
                  width: "60%",
                  left: "20%",
                  // display: "flex",
                  position: "relative",
                  "justify-content": "center",
                  "align-items": "center",
                  backgroundColor: "white",
                }}
              >
                <SoftBox p={5}>
                  <div
                    // style={{
                      // position: "relative",
                      // width: "65%",
                      // left: "20%",
                    // }}
                  >
                <h2>Welcome Back</h2>
                <h6>Enter your details and pay bills easily</h6>
                    {children}
                  </div>
                </SoftBox>
              </div>
            </SoftBox>
          </Grid>
        </Grid>
      </PageLayout>
    </div>
  );
}

// Setting default values for the props of CoverLayout
CoverLayout.defaultProps = {
  header: "",
  title: "",
  description: "",
  color: "info",
  top: 20,
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  top: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
