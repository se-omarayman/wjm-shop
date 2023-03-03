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

import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";

import PropTypes from "prop-types";

// @mui material components
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Redux
import { useDispatch } from "react-redux";
import { resetPassword, validatePasswordResetToken } from "store/actions/authentication";

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
  // state
  const [displayPage, setDisplayPage] = useState(false);

  const [validate, setValidate] = useState({
    isInvalid: false,
    email: "",
    token: "",
    isValidating: true,
  });

  const [resetPasswordForm, setResetPasswordForm] = useState({
    tokenExpired: false,
    hasUnprocessableEntities: false,
    isSubmitting: false,
  });

  // hooks
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  // -- url segments
  const { token } = useParams();
  // -- query params
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  // redux
  const dispatch = useDispatch();

  const onSubmit = async (credentials) => {
    setResetPasswordForm({
      ...resetPasswordForm,
      hasUnprocessableEntities: false,
      isSubmitting: true,
    });

    const request = await dispatch(
      resetPassword({
        ...credentials,
        email: validate.email,
        token: validate.token,
      })
    );

    if (!request.failed) {
      navigate("/");

      return;
    }

    if (request.failed && request.hasResponse) {
      if (request.error.response.status === 404) {
        // invalid token
        setResetPasswordForm({
          ...resetPasswordForm,
          isSubmitting: false,
        });

        setValidate({
          ...validate,
          isInvalid: true,
        });

        return;
      }

      if (request.error.response.status === 422) {
        // invalid data supplied
        setResetPasswordForm({
          ...resetPasswordForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
        });
      }
    }
  };

  const renderForm = () => (
    <Form
      initialValues={{
        password: "",
        password_confirmation: "",
      }}
      onSubmit={(values) => {
        onSubmit(values);
      }}
      render={({ handleSubmit, submitting, errors, touched, values }) => (
        <>
          {!resetPasswordForm.isSubmitting && resetPasswordForm.error && (
            <Alert variant="filled" severity="error" icon={false} sx={{ mb: 3.5, mt: -1 }}>
              <FormattedMessage id="global.errors.api.remoteServerFailed" />
            </Alert>
          )}

          <SoftBox component="form" role="form" onSubmit={handleSubmit}>
            <SoftBox mb={1.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                <FormattedMessage id="forms.input.password.labelText" />
              </SoftTypography>
              <Field
                name="password"
                validate={async (value) =>
                  // eslint-disable-next-line no-return-await
                  await validateFormInput(value, {
                    required: {
                      error: intl.formatMessage({
                        id: "forms.input.password.errorMessages.required",
                      }),
                    },
                    min: {
                      length: 6,
                      error: intl.formatMessage({
                        id: "forms.input.password.errorMessages.min",
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
                    hasUnprocessableEntities={resetPasswordForm.hasUnprocessableEntities}
                    disabled={submitting || resetPasswordForm.isSubmitting}
                    type="password"
                    label={intl.formatMessage({
                      id: "forms.input.password.labelText",
                    })}
                  />
                )}
              </Field>
            </SoftBox>

            <SoftBox mb={1.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                <FormattedMessage id="forms.input.password_confirmation.labelText" />
              </SoftTypography>

              <Field
                name="password_confirmation"
                validate={async (value) =>
                  // eslint-disable-next-line no-return-await
                  await validateFormInput(
                    value,
                    {
                      required: {
                        error: intl.formatMessage({
                          id: "forms.input.password_confirmation.errorMessages.required",
                        }),
                      },
                      passwordConfirmation: {
                        error: intl.formatMessage({
                          id: "forms.input.password_confirmation.errorMessages.passwordConfirmation",
                        }),
                      },
                    },
                    values
                  )
                }
              >
                {(fieldProps) => (
                  <TextField
                    errors={errors}
                    fullWidth
                    touched={touched}
                    meta={fieldProps.meta}
                    input={fieldProps.input}
                    hasUnprocessableEntities={resetPasswordForm.hasUnprocessableEntities}
                    disabled={submitting || resetPasswordForm.isSubmitting}
                    type="password"
                    label={intl.formatMessage({
                      id: "forms.input.password_confirmation.labelText",
                    })}
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
                disabled={submitting || resetPasswordForm.isSubmitting}
              >
                <FormattedMessage id="authentication.resetPassword.resetButtonText" />
              </SoftButton>
            </SoftBox>

            <SoftBox mt={3} mb={1}>
              <SoftTypography variant="button" color="text">
                <FormattedMessage id="authentication.resetPassword.messages.haveAnAccount" />{" "}
                <SoftTypography
                  component={Link}
                  to="/"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  <FormattedMessage id="authentication.resetPassword.links.signIn" />
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </>
      )}
    />
  );

  const renderInvalidToken = () => (
    <SoftTypography>
      <FormattedMessage id="authentication.resetPassword.invalid.messageBody" />
    </SoftTypography>
  );

  useEffect(() => {
    document.title = intl.formatMessage({ id: "authentication.resetPassword.page.title" });

    if (authContext.isUserAuthenticated()) {
      navigate("/trade");
    } else {
      const validateToken = async () => {
        const request = await dispatch(validatePasswordResetToken(token, email));

        if (!request.failed) {
          setValidate({
            ...validate,
            token: request.response.data.token,
            email: request.response.data.email,
            isValidating: false,
          });
        }

        if (request.failed && request.hasResponse) {
          if (request.error.response.status === 404) {
            // invalid token
            setValidate({
              ...validate,
              isInvalid: true,
              isValidating: false,
            });
          }
        }
      };

      validateToken();

      setDisplayPage(true);
    }
  }, []);

  if (!displayPage || validate.isValidating) {
    return null;
  }

  return (
    <CoverLayout
      title={intl.formatMessage({ id: "authentication.resetPassword.form.headerText" })}
      description={intl.formatMessage({ id: "authentication.resetPassword.form.subHeaderText" })}
      image={curved9}
    >
      <SoftBox pt={4} pb={3}>
        {validate.isInvalid || resetPasswordForm.tokenExpired ? renderInvalidToken() : renderForm()}
      </SoftBox>
    </CoverLayout>
  );
}

ForgotPasswordPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ForgotPasswordPage);
