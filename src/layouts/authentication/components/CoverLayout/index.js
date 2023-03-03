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

// Authentication layout components
// import Footer from "layouts/authentication/components/Footer";

function CoverLayout({ color, header, title, description, image, top, children }) {
  return (
    <div style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "2300px",
      backgroundPosition: "0 -300px"
    }}>
    <PageLayout>
      <Grid
        container
        justifyContent="center"
        sx={{
        }}
      >
        <Grid item xs={11} sm={8} md={12} xl={12}>
          <SoftBox mt={top}>
            <SoftBox pt={3} px={3}>
              {!header ? (
                <div
                  style={{
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                  }}
                >
                  <SoftBox mb={1}>
                    <SoftTypography variant="h3" fontWeight="bold" color={color} textGradient>
                      {title}
                    </SoftTypography>
                  </SoftBox>
                  <SoftTypography variant="body2" fontWeight="regular" color="text">
                    {description}
                  </SoftTypography>
                </div>
              ) : (
                header
              )}
            </SoftBox>
            <SoftBox p={5}>{children}</SoftBox>
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
