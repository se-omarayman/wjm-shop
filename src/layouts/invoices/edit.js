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

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import _isEmpty from "lodash/isEmpty";

// @mui
// -- components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

// axios
import axios from "utils/axios";

// redux
import { useDispatch } from "react-redux";
import { update } from "store/actions/invoices";
import { closeSuccessApiNotification } from "store/actions/notifications";

// contexts
import { AuthContext } from "contexts/AuthContext";

// i18n
import { injectIntl, FormattedMessage } from "react-intl";
import { trans } from "utils/i18n";

// forms
import { Form, Field } from "react-final-form";
import validateFormInput from "utils/validateFormInput";

// soft ui dashboard react
import DashboardLayout from "containers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Footer from "components/Footer";
import SoftButton from "components/SoftButton";
//
import TextField from "components/Forms/TextField";
import SelectField from "components/Forms/SelectField";
import NumberField from "components/Forms/NumberField";
import MobileDatePickerField from "components/Forms/MobileDatePickerField";

// constants
import { API_MERCHANT_PLATFORMS_LIST_ROUTE_PATH } from "constants/merchantPlatforms.api";
import { API_PAYMENT_GATEWAYS_LIST_ROUTE_PATH } from "constants/paymentGateways.api";
import { API_INVOICES_SHOW_ROUTE_PATH } from "constants/invoices.api";

// ------------------------------------------------------------------------------

InvoicesEditPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

function InvoicesEditPage({ intl }) {
  // state
  const [invoice, setInvoice] = useState({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    data: {},
  });

  const [isUpdateSuccessNoticeOpen, setIsUpdateSuccessNoticeOpen] = useState(false);

  const [updateForm, setUpdateForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [merchantPlatforms, setMerchantPlatforms] = useState({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    data: [],
  });

  const [paymentGateways, setPaymentGateways] = useState({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    data: [],
  });

  // hooks
  // -- url params
  const { slug } = useParams();
  // -- rest
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // contexts
  // -- auth
  const authContext = useContext(AuthContext);
  const isUserAuthenticated = authContext.isUserAuthenticated();

  // INVOICE STATUS
  const invoiceStatus = [
    {
      label: intl.formatMessage({ id: "forms.input.invoices.status.options.fresh.labelText" }),
      id: "is_fresh",
    },
    {
      label: intl.formatMessage({ id: "forms.input.invoices.status.options.delivered.labelText" }),
      id: "is_delivered",
    },
    {
      label: intl.formatMessage({ id: "forms.input.invoices.status.options.cancelled.labelText" }),
      id: "is_cancelled",
    },
  ];

  const handleUpdateSuccessNoticeClose = () => {
    setIsUpdateSuccessNoticeOpen(false);
    closeSuccessApiNotification();
  };

  function fetchInvoice() {
    setInvoice({
      ...invoice,
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    axios
      .get(API_INVOICES_SHOW_ROUTE_PATH.replace(":slug", slug))
      .then((res) => {
        document.title = intl.formatMessage(
          {
            id: "invoices.pages.edit.title",
          },
          {
            customer_name: res.data.data.customer_name,
          }
        );

        setInvoice({
          ...invoice,
          isLoading: false,
          isLoaded: true,
          data: { ...invoice.data, ...res.data.data },
        });
      })
      .catch(() => {
        setInvoice({
          ...invoice,
          isLoading: false,
          isLoaded: false,
          hasError: true,
        });
      });
  }

  function fetchMerchantPlatforms() {
    setMerchantPlatforms({
      ...merchantPlatforms,
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    axios
      .get(API_MERCHANT_PLATFORMS_LIST_ROUTE_PATH)
      .then((res) => {
        const response = res.data;

        setMerchantPlatforms({
          ...merchantPlatforms,
          isLoading: false,
          isLoaded: true,
          hasError: false,
          data: [...response.data],
        });
      })
      .catch(() => {
        setMerchantPlatforms({
          ...merchantPlatforms,
          isLoading: false,
          isLoaded: false,
          hasError: true,
        });
      });
  }

  function fetchPaymentGateways() {
    setPaymentGateways({
      ...paymentGateways,
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    axios
      .get(API_PAYMENT_GATEWAYS_LIST_ROUTE_PATH)
      .then((res) => {
        const response = res.data;

        setPaymentGateways({
          ...paymentGateways,
          isLoading: false,
          isLoaded: true,
          hasError: false,
          data: [...response.data],
        });
      })
      .catch(() => {
        setPaymentGateways({
          ...paymentGateways,
          isLoading: false,
          isLoaded: false,
          hasError: true,
        });
      });
  }

  async function handleUpdate(data) {
    setUpdateForm({
      hasUnprocessableEntities: false,
      isSubmitting: true,
      hasError: false,
    });

    const payload = {
      ...data,
      status: data.status.id,
      merchant_platform_id: data.merchant_platform_id.id,
      payment_gateway_id: data.payment_gateway_id.id,
    };

    const request = await dispatch(update(slug, payload));

    if (!request.failed) {
      const response = request.response.data;

      setUpdateForm({
        ...updateForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setInvoice({
        ...invoice,
        data: { ...invoice.data, ...response.data },
      });

      setIsUpdateSuccessNoticeOpen(true);

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // unprocessable entities
        setUpdateForm({
          ...updateForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setUpdateForm({ ...updateForm, isSubmitting: false, hasError: true });

    return false;
  }

  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate("/");
    }

    if (isUserAuthenticated) {
      fetchInvoice();

      fetchMerchantPlatforms();

      fetchPaymentGateways();
    }
  }, [isUserAuthenticated]);

  if (!authContext.can("invoices.browse")) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox py={3}>
        <Card>
          <SoftBox p={3}>
            {!updateForm.isSubmitting && updateForm.hasError && (
              <SoftBox mb={1.5}>
                <Alert variant="filled" severity="error">
                  <FormattedMessage id="global.errors.api.remoteServerFailed" />
                </Alert>
              </SoftBox>
            )}

            {!updateForm.isSubmitting && !updateForm.hasError && isUpdateSuccessNoticeOpen && (
              <SoftBox mb={1.5}>
                <Alert onClose={handleUpdateSuccessNoticeClose} severity="success" variant="filled">
                  <FormattedMessage id="invoices.forms.edit.success.messageBody" />
                </Alert>
              </SoftBox>
            )}

            <Form
              keepDirtyOnReinitialize
              initialValues={{
                status: invoice.data?.is_fresh
                  ? {
                      label: intl.formatMessage({
                        id: "forms.input.invoices.status.options.fresh.labelText",
                      }),
                      id: "is_fresh",
                    }
                  : invoice.data?.is_delivered
                  ? {
                      label: intl.formatMessage({
                        id: "forms.input.invoices.status.options.delivered.labelText",
                      }),
                      id: "is_delivered",
                    }
                  : {
                      label: intl.formatMessage({
                        id: "forms.input.invoices.status.options.cancelled.labelText",
                      }),
                      id: "is_cancelled",
                    },
                merchant_platform_id: _isEmpty(invoice.data)
                  ? null
                  : {
                      id: invoice.data.merchant_platform.id,
                      label: trans(invoice.data.merchant_platform.name, intl.locale),
                    },
                payment_gateway_id: _isEmpty(invoice.data)
                  ? null
                  : {
                      id: invoice.data.payment_gateway.id,
                      label: trans(invoice.data.payment_gateway.name, intl.locale),
                    },
                customer_name: invoice.data?.customer_name,
                order_id: invoice.data?.order_id,
                date: invoice.data?.date,
                buying_price: invoice.data?.buying_price,
                selling_price: invoice.data?.selling_price,
              }}
              onSubmit={async (values, form) => {
                const updated = await handleUpdate(values);

                if (updated) {
                  form.reset();
                }
              }}
              render={({ handleSubmit, submitting, errors, touched }) => (
                <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                  <SoftBox mb={2}>
                    <Grid container>
                      <Grid item md={6} sm={12}>
                        <SoftBox mb={1} ml={0.5}>
                          <SoftTypography component="label" variant="caption" fontWeight="bold">
                            <FormattedMessage id="forms.input.invoices.status.labelText" /> (&#42;)
                          </SoftTypography>

                          <Field
                            validateFields={[]}
                            name="status"
                            validate={(value) =>
                              validateFormInput(value, {
                                requiredSelect: {
                                  error: intl.formatMessage({
                                    id: "forms.input.invoices.status.errorMessages.required",
                                  }),
                                },
                              })
                            }
                          >
                            {(fieldProps) => (
                              <SelectField
                                disableClearable
                                errors={errors}
                                touched={touched}
                                meta={fieldProps.meta}
                                input={fieldProps.input}
                                loading={
                                  merchantPlatforms.isLoading ||
                                  !merchantPlatforms.isLoaded ||
                                  merchantPlatforms.hasError ||
                                  !authContext.can("invoices.update")
                                }
                                placeholder={intl.formatMessage({
                                  id: "forms.input.invoices.status.placeholder",
                                })}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                options={invoiceStatus}
                                disabled={
                                  submitting ||
                                  updateForm.isSubmitting ||
                                  merchantPlatforms.isLoading ||
                                  !merchantPlatforms.isLoaded ||
                                  merchantPlatforms.hasError
                                }
                                hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                              />
                            )}
                          </Field>
                        </SoftBox>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item md={6} sm={12}>
                        <SoftBox mb={1} ml={0.5}>
                          <SoftTypography component="label" variant="caption" fontWeight="bold">
                            <FormattedMessage id="forms.input.invoices.merchantPlatform.labelText" />{" "}
                            (&#42;)
                          </SoftTypography>

                          <Field
                            validateFields={[]}
                            name="merchant_platform_id"
                            validate={(value) =>
                              validateFormInput(value, {
                                requiredSelect: {
                                  error: intl.formatMessage({
                                    id: "forms.input.invoices.merchantPlatform.errorMessages.required",
                                  }),
                                },
                              })
                            }
                          >
                            {(fieldProps) => (
                              <SelectField
                                disableClearable
                                errors={errors}
                                touched={touched}
                                meta={fieldProps.meta}
                                input={fieldProps.input}
                                loading={
                                  merchantPlatforms.isLoading ||
                                  !merchantPlatforms.isLoaded ||
                                  merchantPlatforms.hasError ||
                                  !authContext.can("invoices.update")
                                }
                                placeholder={intl.formatMessage({
                                  id: "forms.input.invoices.merchantPlatform.placeholder",
                                })}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                options={merchantPlatforms.data.map((platform) => ({
                                  label: trans(platform.name, intl.locale),
                                  id: platform.id,
                                }))}
                                disabled={
                                  submitting ||
                                  updateForm.isSubmitting ||
                                  merchantPlatforms.isLoading ||
                                  !merchantPlatforms.isLoaded ||
                                  merchantPlatforms.hasError
                                }
                                hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                              />
                            )}
                          </Field>
                        </SoftBox>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item md={6} sm={12}>
                        <SoftBox mb={1} ml={0.5}>
                          <SoftTypography component="label" variant="caption" fontWeight="bold">
                            <FormattedMessage id="forms.input.invoices.paymentGateway.labelText" />{" "}
                            (&#42;)
                          </SoftTypography>

                          <Field
                            validateFields={[]}
                            name="payment_gateway_id"
                            validate={(value) =>
                              validateFormInput(value, {
                                requiredSelect: {
                                  error: intl.formatMessage({
                                    id: "forms.input.invoices.paymentGateway.errorMessages.required",
                                  }),
                                },
                              })
                            }
                          >
                            {(fieldProps) => (
                              <SelectField
                                disableClearable
                                errors={errors}
                                touched={touched}
                                meta={fieldProps.meta}
                                input={fieldProps.input}
                                loading={
                                  paymentGateways.isLoading ||
                                  !paymentGateways.isLoaded ||
                                  paymentGateways.hasError
                                }
                                placeholder={intl.formatMessage({
                                  id: "forms.input.invoices.paymentGateway.placeholder",
                                })}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                options={paymentGateways.data.map((paymentGateway) => ({
                                  label: trans(paymentGateway.name, intl.locale),
                                  id: paymentGateway.id,
                                }))}
                                disabled={
                                  submitting ||
                                  updateForm.isSubmitting ||
                                  paymentGateways.isLoading ||
                                  !paymentGateways.isLoaded ||
                                  paymentGateways.hasError ||
                                  !authContext.can("invoices.update")
                                }
                                hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                              />
                            )}
                          </Field>
                        </SoftBox>
                      </Grid>
                    </Grid>

                    <SoftBox mb={1} ml={0.5}>
                      <Grid container>
                        <Grid item md={6} sm={12}>
                          <SoftTypography component="label" variant="caption" fontWeight="bold">
                            <FormattedMessage id="forms.input.invoices.date.labelText" /> (&#42;)
                          </SoftTypography>

                          <Field
                            name="date"
                            validateFields={[]}
                            validate={async (value) =>
                              await validateFormInput(value, {
                                required: {
                                  error: intl.formatMessage({
                                    id: "forms.input.invoices.date.errorMessages.required",
                                  }),
                                },
                              })
                            }
                          >
                            {(fieldProps) => (
                              <MobileDatePickerField
                                errors={errors}
                                fullWidth
                                touched={touched}
                                meta={fieldProps.meta}
                                input={fieldProps.input}
                                disabled={
                                  submitting ||
                                  updateForm.isSubmitting ||
                                  !authContext.can("invoices.update")
                                }
                                hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                              />
                            )}
                          </Field>
                        </Grid>
                      </Grid>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.invoices.customerName.labelText" />{" "}
                        (&#42;)
                      </SoftTypography>

                      <Field
                        validateFields={[]}
                        name="customer_name"
                        validate={async (value) =>
                          await validateFormInput(value, {
                            required: {
                              error: intl.formatMessage({
                                id: "forms.input.invoices.customerName.errorMessages.required",
                              }),
                            },
                            max: {
                              length: 200,
                              error: intl.formatMessage({
                                id: "forms.input.invoices.customerName.errorMessages.max",
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
                            disabled={
                              submitting ||
                              updateForm.isSubmitting ||
                              !authContext.can("invoices.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.invoices.orderId.labelText" /> (&#42;)
                      </SoftTypography>

                      <Field
                        validateFields={[]}
                        name="order_id"
                        validate={async (value) =>
                          await validateFormInput(value, {
                            required: {
                              error: intl.formatMessage({
                                id: "forms.input.invoices.orderId.errorMessages.required",
                              }),
                            },
                            max: {
                              length: 200,
                              error: intl.formatMessage({
                                id: "forms.input.invoices.orderId.errorMessages.max",
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
                            disabled={
                              submitting ||
                              updateForm.isSubmitting ||
                              !authContext.can("invoices.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.invoices.buyingPrice.labelText" /> (&#42;)
                      </SoftTypography>

                      <Field
                        validateFields={[]}
                        name="buying_price"
                        validate={(value) =>
                          validateFormInput(value, {
                            required: {
                              error: intl.formatMessage({
                                id: "forms.input.invoices.buyingPrice.errorMessages.required",
                              }),
                            },
                            positiveNumber: {
                              error: intl.formatMessage({
                                id: "forms.input.invoices.buyingPrice.errorMessages.positiveNumber",
                              }),
                            },
                          })
                        }
                      >
                        {(fieldProps) => (
                          <NumberField
                            errors={errors}
                            fullWidth
                            touched={touched}
                            allowNegative={false}
                            meta={fieldProps.meta}
                            input={fieldProps.input}
                            label={intl.formatMessage({
                              id: "forms.input.invoices.buyingPrice.labelText",
                            })}
                            disabled={
                              submitting ||
                              updateForm.isSubmitting ||
                              !authContext.can("invoices.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.invoices.sellingPrice.labelText" />{" "}
                        (&#42;)
                      </SoftTypography>

                      <Field
                        validateFields={[]}
                        name="selling_price"
                        validate={(value) =>
                          validateFormInput(value, {
                            required: {
                              error: intl.formatMessage({
                                id: "forms.input.invoices.sellingPrice.errorMessages.required",
                              }),
                            },
                            positiveNumber: {
                              error: intl.formatMessage({
                                id: "forms.input.invoices.sellingPrice.errorMessages.positiveNumber",
                              }),
                            },
                          })
                        }
                      >
                        {(fieldProps) => (
                          <NumberField
                            errors={errors}
                            fullWidth
                            touched={touched}
                            allowNegative={false}
                            meta={fieldProps.meta}
                            input={fieldProps.input}
                            label={intl.formatMessage({
                              id: "forms.input.invoices.sellingPrice.labelText",
                            })}
                            disabled={
                              submitting ||
                              updateForm.isSubmitting ||
                              !authContext.can("invoices.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>
                  </SoftBox>

                  {authContext.can("invoices.update") && (
                    <SoftBox mb={2}>
                      <SoftBox mt={4} mb={1}>
                        <Divider />
                        <SoftButton
                          type="submit"
                          color="warning"
                          disabled={
                            submitting ||
                            updateForm.isSubmitting ||
                            invoice.hasError ||
                            invoice.isLoading
                          }
                        >
                          <FormattedMessage id="invoices.forms.edit.updateButtonText" />
                        </SoftButton>
                      </SoftBox>
                    </SoftBox>
                  )}
                </SoftBox>
              )}
            />
          </SoftBox>
        </Card>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default injectIntl(InvoicesEditPage);
