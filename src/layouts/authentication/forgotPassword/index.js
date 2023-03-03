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

import PropTypes from "prop-types";

// @mui material components
import Alert from "@mui/material/Alert";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Redux
import { useDispatch } from "react-redux";
import { forgotPassword } from "store/actions/authentication";

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

function ForgotPasswordPage({ intl }) {
  document.title = intl.formatMessage({ id: "authentication.forgotPassword.page.title" });

  // state
  const [displayPage, setDisplayPage] = useState(false);

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    hasRequestError: false,
    isRequested: false,
    isSubmitting: false,
  });

  // hooks
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // redux
  const dispatch = useDispatch();

  const onSubmit = async (credentials) => {
    setForgotPasswordForm({
      ...forgotPasswordForm,
      hasRequestError: false,
      isRequested: false,
      isSubmitting: true,
    });

    const request = await dispatch(
      forgotPassword({
        ...credentials,
      })
    );

    if (!request.failed) {
      setForgotPasswordForm({
        ...forgotPasswordForm,
        hasRequestError: false,
        isRequested: true,
        isSubmitting: false,
      });

      return;
    }

    setForgotPasswordForm({
      ...forgotPasswordForm,
      hasRequestError: true,
      isRequested: false,
      isSubmitting: false,
    });
  };

  const renderForm = () => (
    <Form
      initialValues={{
        email: "",
      }}
      onSubmit={(values) => {
        onSubmit(values);
      }}
      render={({ handleSubmit, submitting, errors, touched }) => (
        <>
          {!forgotPasswordForm.isSubmitting && forgotPasswordForm.error && (
            <Alert variant="filled" severity="error" icon={false} sx={{ mb: 3.5, mt: -1 }}>
              <FormattedMessage id="global.errors.api.remoteServerFailed" />
            </Alert>
          )}

          <SoftBox component="form" role="form" onSubmit={handleSubmit}>
            <SoftBox mb={1.5}>
              <Field
                name="email"
                validateFields={[]}
                validate={async (value) =>
                  // eslint-disable-next-line no-return-await
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
                    fullWidth
                    touched={touched}
                    meta={fieldProps.meta}
                    input={fieldProps.input}
                    hasUnprocessableEntities={forgotPasswordForm.hasUnprocessableEntities}
                    disabled={submitting || forgotPasswordForm.isSubmitting}
                    label={intl.formatMessage({ id: "forms.input.email.labelText" })}
                  />
                )}
              </Field>
            </SoftBox>

            <SoftBox mt={4} mb={1}>
              <SoftButton
                variant="gradient"
                color="warning"
                fullWidth
                type="submit"
                disabled={submitting || forgotPasswordForm.isSubmitting}
              >
                <FormattedMessage id="authentication.forgotPassword.requestButtonText" />
              </SoftButton>
            </SoftBox>

            <SoftBox mt={3} mb={1}>
              <SoftTypography variant="button" color="text">
                <FormattedMessage id="authentication.forgotPassword.messages.haveAnAccount" />{" "}
                <SoftTypography
                  component={Link}
                  to="/"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  <FormattedMessage id="authentication.forgotPassword.links.signIn" />
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </>
      )}
    />
  );

  const renderRequested = () => (
    <SoftTypography>
      <FormattedMessage id="authentication.forgotPassword.success.messageBody" />
    </SoftTypography>
  );

  useEffect(() => {
    if (authContext.isUserAuthenticated()) {
      navigate("/dashboard");
    } else {
      setDisplayPage(true);
    }
  }, []);

  if (!displayPage) {
    return null;
  }

  return (
    <CoverLayout
      title={intl.formatMessage({ id: "authentication.forgotPassword.form.headerText" })}
      description={intl.formatMessage({ id: "authentication.forgotPassword.form.subHeaderText" })}
      image={curved9}
    >
      <SoftBox pt={4} pb={3}>
        {forgotPasswordForm.isRequested ? renderRequested() : renderForm()}
      </SoftBox>
    </CoverLayout>
  );
}

ForgotPasswordPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ForgotPasswordPage);
