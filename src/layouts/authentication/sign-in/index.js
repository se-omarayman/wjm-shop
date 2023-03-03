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

import { useNavigate, Link } from "react-router-dom";

import { IntlContext } from "contexts/LocalizationContext";

import PropTypes from "prop-types";

// @mui material components
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Redux
import { useDispatch } from "react-redux";
import { authenticate } from "store/actions/authentication";

// Contexts
import { AuthContext } from "contexts/AuthContext";

// I18n
import { injectIntl, FormattedMessage } from "react-intl";

// Form
import { Form, Field } from "react-final-form";
import validateFormInput from "utils/validateFormInput";

// Components
import TextField from "components/Forms/TextField";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { Checkbox } from "@mui/material";
import Footer from "components/Footer";

function SignInPage({ intl }) {
  document.title = intl.formatMessage({ id: "authentication.login.page.title" });

  const [displayPage, setDisplayPage] = useState(false);

  const [loginForm, setLoginForm] = useState({
    error: false,
    invalidAttempts: false,
    authenticating: false,
  });

  const [rememberMe, setRememberMe] = useState(true);

  // hooks
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // redux
  const dispatch = useDispatch();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const onSubmit = async (credentials) => {
    setLoginForm({
      ...loginForm,
      error: false,
      invalidAttempts: false,
      authenticating: true,
    });

    const request = await dispatch(
      authenticate({
        ...credentials,
        remember_me: rememberMe,
      })
    );

    if (!request.failed) {
      authContext.login(request.response.data.data.permissions);

      navigate("/configuration");

      return;
    }

    if (request.failed) {
      if (request.hasResponse) {
        if (401 === request.error.response.status) {
          // Invalid credentials
          return setLoginForm({
            ...loginForm,
            error: false,
            invalidAttempts: true,
            authenticating: false,
          });
        }
      }

      return setLoginForm({
        ...loginForm,
        error: true,
        invalidAttempts: false,
        authenticating: false,
      });
    }

    return setLoginForm({
      ...loginForm,
      error: false,
      invalidAttempts: false,
      authenticating: false,
    });
  };

  useEffect(() => {
    if (authContext.isUserAuthenticated()) {
      navigate("/tasks-feed");
    } else {
      setDisplayPage(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!displayPage) {
    return null;
  }

  const intlContext = useContext(IntlContext);

  const changeLangEn = () => {
    intlContext.switchLanguage("en-US");
  };
  const changeLangAr = () => {
    intlContext.switchLanguage("ar-SA");
  };

  return (
    <CoverLayout
      title={intl.formatMessage({ id: "authentication.login.form.headerText" })}
      description={intl.formatMessage({ id: "authentication.login.form.subHeaderText" })}
      image={curved9}
    >
      <button onClick={changeLangEn}>change lang</button>
      <button onClick={changeLangAr}>change lang</button>
      <Form
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        render={({ handleSubmit, submitting, errors, touched }) => (
          <div>
            {!loginForm.authenticating && loginForm.invalidAttempts && (
              <Alert variant="filled" severity="warning" icon={false} sx={{ mb: 1.5, mt: -1 }}>
                <FormattedMessage id="authentication.login.messages.invalidCredentials" />
              </Alert>
            )}

            {!loginForm.authenticating && loginForm.error && (
              <Alert variant="filled" severity="error" icon={false} sx={{ mb: 1.5, mt: -1 }}>
                <FormattedMessage id="global.errors.api.remoteServerFailed" />
              </Alert>
            )}

            <SoftBox component="form" role="form" onSubmit={handleSubmit}>
              <SoftBox mb={2}>
                <SoftBox mb={1} ml={0.5}>
                  <Field
                    name="email"
                    validateFields={[]}
                    validate={async (value) =>
                      await validateFormInput(value, {
                        required: {
                          error: intl.formatMessage({
                            id: "forms.input.email.errorMessages.required",
                          }),
                        },
                        email: {
                          error: intl.formatMessage({
                            id: "forms.input.email.errorMessages.email",
                          }),
                        },
                      })
                    }
                  >
                    {(fieldProps) => (
                      <TextField
                        errors={errors}
                        placeholder="email@provider.com"
                        fullWidth={true}
                        touched={touched}
                        meta={fieldProps.meta}
                        input={fieldProps.input}
                        noErrorHelperText={true}
                        hasUnprocessableEntities={false}
                        disabled={submitting || loginForm.authenticating}
                      />
                    )}
                  </Field>
                </SoftBox>
              </SoftBox>

              <SoftBox mb={2}>
                <SoftBox mb={1} ml={0.5}>
                  <Field
                    name="password"
                    validate={async (value) =>
                      await validateFormInput(value, {
                        required: {
                          error: intl.formatMessage({
                            id: "forms.input.password.errorMessages.required",
                          }),
                        },
                      })
                    }
                  >
                    {(fieldProps) => (
                      <TextField
                        errors={errors}
                        fullWidth={true}
                        placeholder="*********"
                        touched={touched}
                        meta={fieldProps.meta}
                        input={fieldProps.input}
                        noErrorHelperText={true}
                        hasUnprocessableEntities={false}
                        type="password"
                        disabled={submitting || loginForm.authenticating}
                      />
                    )}
                  </Field>

                  <Stack
                    style={{ marginTop: "15px" }}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <SoftBox display="flex" alignItems="center">
                      <Checkbox
                        checked={rememberMe}
                        onChange={handleSetRememberMe}
                        disabled={submitting || loginForm.authenticating}
                      />
                      <SoftTypography
                        variant="button"
                        fontWeight="regular"
                        onClick={handleSetRememberMe}
                        sx={{ cursor: "pointer", userSelect: "none" }}
                      >
                        &nbsp;&nbsp;
                        <FormattedMessage id="forms.input.rememberMe.labelText" />
                      </SoftTypography>
                    </SoftBox>

                    <SoftTypography
                      component={Link}
                      to="/forgot-password"
                      variant="button"
                      color="dark"
                      fontWeight="medium"
                    >
                      <FormattedMessage id="authentication.login.links.forgotPassword" />
                    </SoftTypography>
                  </Stack>
                </SoftBox>

                <SoftBox mt={2} mb={1}>
                  <SoftButton
                    // variant="gradient"
                    color="dark"
                    fullWidth={true}
                    type="submit"
                    disabled={submitting || loginForm.authenticating}
                  >
                    <FormattedMessage id="authentication.login.loginButtonText" />
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </div>
        )}
      />
    </CoverLayout>
  );
}

SignInPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SignInPage);
