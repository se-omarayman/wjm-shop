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

// @mui
// -- components
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// axios
import axios from "utils/axios";

// redux
import { useDispatch } from "react-redux";
import { update } from "store/actions/saleTasks";
import { closeSuccessApiNotification } from "store/actions/notifications";

// contexts
import { AuthContext } from "contexts/AuthContext";

// i18n
import { injectIntl, FormattedMessage } from "react-intl";

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
import FileField from "components/Forms/FileField";

// constants
import { API_SALE_TASKS_SHOW_ROUTE_PATH } from "constants/saleTasks.api";

// ------------------------------------------------------------------------------

SaleTasksEditPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

function SaleTasksEditPage({ intl }) {
  // state
  const [saleTask, setSaleTask] = useState({
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

  const handleUpdateSuccessNoticeClose = () => {
    setIsUpdateSuccessNoticeOpen(false);
    closeSuccessApiNotification();
  };

  function fetchSaleTask() {
    setSaleTask({
      ...saleTask,
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    axios
      .get(API_SALE_TASKS_SHOW_ROUTE_PATH.replace(":slug", slug))
      .then((res) => {
        document.title = intl.formatMessage(
          {
            id: "saleTasks.pages.edit.title",
          },
          {
            title: res.data.data.title,
          }
        );

        setSaleTask({
          ...saleTask,
          isLoading: false,
          isLoaded: true,
          data: { ...saleTask.data, ...res.data.data },
        });
      })
      .catch(() => {
        setSaleTask({
          ...saleTask,
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

      setSaleTask({
        ...saleTask,
        data: { ...saleTask.data, ...response.data },
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
      fetchSaleTask();
    }
  }, [isUserAuthenticated]);

  if (!authContext.can("tasks.sale.browse")) {
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
                  <FormattedMessage id="saleTasks.forms.edit.success.messageBody" />
                </Alert>
              </SoftBox>
            )}

            <Form
              keepDirtyOnReinitialize
              initialValues={{
                name: saleTask.data?.name,
                url: saleTask.data?.url,
                serial_number: saleTask.data?.serial_number,
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
                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.name.labelText" /> (&#42;)
                      </SoftTypography>

                      <Field
                        name="name"
                        validateFields={[]}
                        validate={async (value) =>
                          await validateFormInput(value, {
                            required: {
                              error: intl.formatMessage({
                                id: "forms.input.name.errorMessages.required",
                              }),
                            },
                            max: {
                              length: 200,
                              error: intl.formatMessage({
                                id: "forms.input.name.errorMessages.max",
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
                              !authContext.can("tasks.sale.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.saleTasks.image.labelText" /> (&#42;)
                      </SoftTypography>

                      <Field name="image" validateFields={[]}>
                        {(fieldProps) => (
                          <FileField
                            errors={errors}
                            touched={touched}
                            meta={fieldProps.meta}
                            input={fieldProps.input}
                            disabled={
                              submitting ||
                              updateForm.isSubmitting ||
                              !authContext.can("tasks.sale.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.saleTasks.url.labelText" /> (&#42;)
                      </SoftTypography>

                      <Field
                        name="url"
                        validateFields={[]}
                        validate={async (value) =>
                          await validateFormInput(value, {
                            required: {
                              error: intl.formatMessage({
                                id: "forms.input.saleTasks.url.errorMessages.required",
                              }),
                            },
                            max: {
                              length: 1000,
                              error: intl.formatMessage({
                                id: "forms.input.saleTasks.url.errorMessages.max",
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
                              !authContext.can("tasks.sale.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.saleTasks.serialNumber.labelText" />{" "}
                        (&#42;)
                      </SoftTypography>

                      <Field
                        name="serial_number"
                        validateFields={[]}
                        validate={async (value) =>
                          await validateFormInput(value, {
                            required: {
                              error: intl.formatMessage({
                                id: "forms.input.saleTasks.serialNumber.errorMessages.required",
                              }),
                            },
                            max: {
                              length: 200,
                              error: intl.formatMessage({
                                id: "forms.input.saleTasks.serialNumber.errorMessages.max",
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
                              !authContext.can("tasks.sale.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>
                  </SoftBox>

                  {authContext.can("tasks.sale.update") && (
                    <SoftBox mb={2}>
                      <SoftBox mt={4} mb={1}>
                        <Divider />
                        <SoftButton
                          type="submit"
                          color="warning"
                          disabled={
                            submitting ||
                            updateForm.isSubmitting ||
                            saleTask.hasError ||
                            saleTask.isLoading
                          }
                        >
                          <FormattedMessage id="saleTasks.forms.edit.updateButtonText" />
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

export default injectIntl(SaleTasksEditPage);
