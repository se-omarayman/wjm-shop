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
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// axios
import axios from "utils/axios";

// redux
import { useDispatch } from "react-redux";
import { update } from "store/actions/socialMediaTasks";
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
import FileField from "components/Forms/FileField";

// constants
import { API_SOCIAL_MEDIA_PLATFORMS_LIST_ROUTE_PATH } from "constants/socialMediaPlatforms.api";
import { API_SOCIAL_MEDIA_TASKS_SHOW_ROUTE_PATH } from "constants/socialMediaTasks.api";

// ------------------------------------------------------------------------------

SocialMediaTasksEditPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

function SocialMediaTasksEditPage({ intl }) {
  // state
  const [socialMediaTask, setSocialMediaTask] = useState({
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

  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState({
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

  const handleUpdateSuccessNoticeClose = () => {
    setIsUpdateSuccessNoticeOpen(false);
    closeSuccessApiNotification();
  };

  function fetchSocialMediaTask() {
    setSocialMediaTask({
      ...socialMediaTask,
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    axios
      .get(API_SOCIAL_MEDIA_TASKS_SHOW_ROUTE_PATH.replace(":slug", slug))
      .then((res) => {
        document.title = intl.formatMessage(
          {
            id: "socialMediaTasks.pages.edit.title",
          },
          {
            title: res.data.data.title,
          }
        );

        setSocialMediaTask({
          ...socialMediaTask,
          isLoading: false,
          isLoaded: true,
          data: { ...socialMediaTask.data, ...res.data.data },
        });
      })
      .catch(() => {
        setSocialMediaTask({
          ...socialMediaTask,
          isLoading: false,
          isLoaded: false,
          hasError: true,
        });
      });
  }

  function fetchSocialMediaPlatforms() {
    setSocialMediaPlatforms({
      ...socialMediaPlatforms,
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    axios
      .get(API_SOCIAL_MEDIA_PLATFORMS_LIST_ROUTE_PATH)
      .then((res) => {
        const response = res.data;

        setSocialMediaPlatforms({
          ...socialMediaPlatforms,
          isLoading: false,
          isLoaded: true,
          hasError: false,
          data: [...response.data],
        });
      })
      .catch(() => {
        setSocialMediaPlatforms({
          ...socialMediaPlatforms,
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
      social_media_platform_id: data.social_media_platform_id.id,
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

      setSocialMediaTask({
        ...socialMediaTask,
        data: { ...socialMediaTask.data, ...response.data },
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
      fetchSocialMediaTask();

      fetchSocialMediaPlatforms();
    }
  }, [isUserAuthenticated]);

  if (!authContext.can("tasks.socialMedia.browse")) {
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
                  <FormattedMessage id="socialMediaTasks.forms.edit.success.messageBody" />
                </Alert>
              </SoftBox>
            )}

            <Form
              keepDirtyOnReinitialize
              initialValues={{
                social_media_platform_id: _isEmpty(socialMediaTask.data)
                  ? null
                  : {
                      id: socialMediaTask.data.social_media_platform.id,
                      label: trans(socialMediaTask.data.social_media_platform.name, intl.locale),
                    },
                title: socialMediaTask.data?.title,
                url: socialMediaTask.data?.url,
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
                        <FormattedMessage id="forms.input.socialMediaTasks.platform.labelText" />{" "}
                        (&#42;)
                      </SoftTypography>

                      <Field
                        name="social_media_platform_id"
                        validateFields={[]}
                        validate={(value) =>
                          validateFormInput(value, {
                            requiredSelect: {
                              error: intl.formatMessage({
                                id: "forms.input.socialMediaTasks.platform.errorMessages.required",
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
                              socialMediaPlatforms.isLoading ||
                              !socialMediaPlatforms.isLoaded ||
                              socialMediaPlatforms.hasError
                            }
                            placeholder={intl.formatMessage({
                              id: "forms.input.socialMediaTasks.platform.placeholder",
                            })}
                            options={socialMediaPlatforms.data.map((platform) => ({
                              label: trans(platform.name, intl.locale),
                              id: platform.id,
                            }))}
                            disabled={
                              submitting ||
                              updateForm.isSubmitting ||
                              socialMediaPlatforms.isLoading ||
                              !socialMediaPlatforms.isLoaded ||
                              socialMediaPlatforms.hasError ||
                              !authContext.can("tasks.socialMedia.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.title.labelText" /> (&#42;)
                      </SoftTypography>

                      <Field
                        name="title"
                        validateFields={[]}
                        validate={async (value) =>
                          await validateFormInput(value, {
                            required: {
                              error: intl.formatMessage({
                                id: "forms.input.title.errorMessages.required",
                              }),
                            },
                            max: {
                              length: 200,
                              error: intl.formatMessage({
                                id: "forms.input.title.errorMessages.max",
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
                              !authContext.can("tasks.socialMedia.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.socialMediaTasks.image.labelText" />{" "}
                        (&#42;)
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
                              !authContext.can("tasks.socialMedia.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>

                    <SoftBox mb={1} ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold">
                        <FormattedMessage id="forms.input.socialMediaTasks.url.labelText" />
                      </SoftTypography>

                      <Field
                        name="url"
                        validateFields={[]}
                        validate={async (value) =>
                          await validateFormInput(value, {
                            nullable: {},
                            max: {
                              length: 1000,
                              error: intl.formatMessage({
                                id: "forms.input.socialMediaTasks.url.errorMessages.max",
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
                              !authContext.can("tasks.socialMedia.update")
                            }
                            hasUnprocessableEntities={updateForm.hasUnprocessableEntities}
                          />
                        )}
                      </Field>
                    </SoftBox>
                  </SoftBox>

                  {authContext.can("tasks.socialMedia.update") && (
                    <SoftBox mb={2}>
                      <SoftBox mt={4} mb={1}>
                        <Divider />
                        <SoftButton
                          type="submit"
                          color="warning"
                          disabled={
                            submitting ||
                            updateForm.isSubmitting ||
                            socialMediaTask.hasError ||
                            socialMediaTask.isLoading
                          }
                        >
                          <FormattedMessage id="socialMediaTasks.forms.edit.updateButtonText" />
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

export default injectIntl(SocialMediaTasksEditPage);
