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
import { Link, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import _isEmpty from "lodash/isEmpty";

// @mui
// -- styles
import { useTheme } from "@mui/material/styles";
// -- data tables
import { DataGrid, enUS, arSD } from "@mui/x-data-grid";
// -- components
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
// -- icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";

// axios
import axios from "utils/axios";

// redux
import { useDispatch } from "react-redux";
import { create, destroy } from "store/actions/socialMediaTasks";
import { closeSuccessApiNotification } from "store/actions/notifications";

// contexts
import { AuthContext } from "contexts/AuthContext";

// i18n
import { injectIntl, FormattedMessage } from "react-intl";
import { trans } from "utils/i18n";

// moment
import Moment from "react-moment";

// sweet alert
import { swalSuccess, swalError, swalDanger } from "utils/swal";

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
import { API_SOCIAL_MEDIA_TASKS_LIST_ROUTE_PATH } from "constants/socialMediaTasks.api";

// ----------------------------------------------------------------------

function CustomLinearProgress() {
  return <LinearProgress color="warning" variant="indeterminate" />;
}

// ----------------------------------------------------------------------

SocialMediaTasksIndexPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

function SocialMediaTasksIndexPage({ intl }) {
  // state
  const [socialMediaTaskModalOperation, setSocialMediaTaskModalOperation] = useState({
    operation: "create",
    task: {},
  });

  const [isSocialMediaTaskModalOpen, setIsSocialMediaTaskModalOpen] = useState(false);

  const [isSocialMediaTaskToastOpen, setIsSocialMediaTaskToastOpen] = useState(false);

  const [socialMediaTaskForm, setSocialMediaTaskForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [datatableSocialMediaTasks, setDatatableSocialMediaTasks] = useState({
    perPage: 15,
    currentPage: 1,
    lastPage: 1,
    isLoading: false,
    data: [],
    from: 0,
    to: 0,
    total: 0,
  });

  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    data: [],
  });

  // hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // contexts
  // -- auth
  const authContext = useContext(AuthContext);
  const isUserAuthenticated = authContext.isUserAuthenticated();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const toggleSocialMediaTaskModal = () => {
    setIsSocialMediaTaskModalOpen(!isSocialMediaTaskModalOpen);
  };

  const handleSocialMediaTaskToastClose = () => {
    setIsSocialMediaTaskToastOpen(false);
    closeSuccessApiNotification();
  };

  function fetchDatatableSocialMediaTasks(pageNumber, pageSize, options = {}) {
    setDatatableSocialMediaTasks({ ...datatableSocialMediaTasks, isLoading: true });

    axios
      .get(API_SOCIAL_MEDIA_TASKS_LIST_ROUTE_PATH, {
        params: {
          paginate: true,
          page: pageNumber,
          per_page: pageSize,
          search: options.globalSearch ?? "",
          sort_column: options.sortColumn ?? "",
          sort_order: options.sortDirection ?? "",
        },
      })
      .then((res) => {
        const response = res.data;

        setDatatableSocialMediaTasks({
          ...datatableSocialMediaTasks,
          isLoading: false,
          perPage: response.data.per_page,
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          data: [...response.data.data],
          from: response.data.from ?? 0,
          to: response.data.to ?? 0,
          total: response.data.total,
        });
      })
      .catch(() => {
        //
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

  async function handleSocialMediaTaskCreate(data) {
    setSocialMediaTaskForm({
      hasUnprocessableEntities: false,
      isSubmitting: true,
      hasError: false,
    });

    const payload = {
      ...data,
      social_media_platform_id: data.social_media_platform_id.id,
    };

    const request = await dispatch(create(payload));

    if (!request.failed) {
      const response = request.response.data;

      setSocialMediaTaskForm({
        ...socialMediaTaskForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setDatatableSocialMediaTasks({
        ...datatableSocialMediaTasks,
        data: [...datatableSocialMediaTasks.data, response.data],
      });

      setIsSocialMediaTaskToastOpen(true);
      toggleSocialMediaTaskModal();

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // unprocessable entities
        setSocialMediaTaskForm({
          ...socialMediaTaskForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setSocialMediaTaskForm({ ...socialMediaTaskForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handleSocialMediaTaskDestroy(slug) {
    const request = await dispatch(destroy(slug));

    if (!request.failed) {
      return swalSuccess.fire({
        icon: "success",
        title: intl.formatMessage({
          id: "socialMediaTasks.list.dataTable.actions.destroy.messages.success.messageHeader",
        }),
        text: intl.formatMessage({
          id: "socialMediaTasks.list.dataTable.actions.destroy.messages.success.messageBody",
        }),
        willClose: () => {
          closeSuccessApiNotification();
        },
      });
    }

    if (request.failed) {
      return swalError.fire({
        icon: "error",
        title: request.error.message,
      });
    }
  }

  function QuickSearchToolbar() {
    return (
      <Grid container>
        <Grid item xs={6}>
          {authContext.can("tasks.socialMedia.store") && (
            <SoftButton
              color="warning"
              disabled={isSocialMediaTaskModalOpen}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ mx: 1, my: 3, display: "flex" }}
              onClick={(e) => {
                e.preventDefault();

                setSocialMediaTaskModalOperation({
                  ...socialMediaTaskModalOperation,
                  operation: "create",
                  customer: {},
                });
                toggleSocialMediaTaskModal();
              }}
            >
              <FormattedMessage id="socialMediaTasks.list.dataTable.header.createButtonText" />
            </SoftButton>
          )}
        </Grid>
      </Grid>
    );
  }

  const columns = [
    {
      field: "title",
      headerName: intl.formatMessage({
        id: "socialMediaTasks.list.dataTable.header.titleColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <SoftTypography>{params.row.title}</SoftTypography>

          {!_isEmpty(params.row.url) && (
            <MuiLink target="_blank" href={params.row.url}>
              <LaunchOutlinedIcon color="info" sx={{ mt: 0.8, height: 18, width: 18 }} />
            </MuiLink>
          )}
        </Stack>
      ),
    },
    {
      field: "social_media_platform",
      headerName: intl.formatMessage({
        id: "socialMediaTasks.list.dataTable.header.platformColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params) => trans(params.row.social_media_platform.name, intl.locale),
    },
    {
      field: "created_at",
      headerName: intl.formatMessage({
        id: "socialMediaTasks.list.dataTable.header.createdAtColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params) => <Moment format="YYYY/MM/DD">{params.row.date}</Moment>,
    },
    {
      field: "actions",
      headerName: intl.formatMessage({
        id: "socialMediaTasks.list.dataTable.header.actionsColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <Stack direction="row">
            {authContext.can("tasks.socialMedia.update") && (
              <Link color="info" to={`/social-media-tasks/${params.row.slug}`}>
                <EditIcon sx={{ height: 22, width: 22, mr: 1, mt: 1 }} color="info" />
              </Link>
            )}

            <MuiLink
              color="info"
              target="_blank"
              href={`http://localhost:8000/modules/socialmediatasks/images/${params.row.image}`}
            >
              <DownloadForOfflineOutlinedIcon sx={{ height: 22, width: 22, mt: 1 }} color="info" />
            </MuiLink>

            {authContext.can("tasks.socialMedia.destroy") && (
              <IconButton
                color="error"
                onClick={(e) => {
                  e.preventDefault();

                  swalDanger.fire({
                    icon: "question",
                    title: intl.formatMessage({
                      id: "socialMediaTasks.list.dataTable.actions.destroy.headerText",
                    }),
                    text: intl.formatMessage({
                      id: "socialMediaTasks.list.dataTable.actions.destroy.bodyText",
                    }),
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                    confirmButtonText: intl.formatMessage({
                      id: "socialMediaTasks.list.dataTable.actions.destroy.confirmText",
                    }),
                    cancelButtonText: intl.formatMessage({
                      id: "socialMediaTasks.list.dataTable.actions.destroy.cancelText",
                    }),
                    preConfirm: async () => {
                      await handleSocialMediaTaskDestroy(params.row.slug);

                      const parsedSocialMedias = datatableSocialMediaTasks.data.filter(
                        (service) => params.row.id !== service.id
                      );

                      setDatatableSocialMediaTasks({
                        ...datatableSocialMediaTasks,
                        data: [...parsedSocialMedias],
                      });
                    },
                  });
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            )}
          </Stack>
        </>
      ),
    },
  ];

  useEffect(() => {
    document.title = intl.formatMessage({ id: "socialMediaTasks.pages.list.title" });

    if (!isUserAuthenticated) {
      navigate("/");
    }

    if (isUserAuthenticated) {
      fetchDatatableSocialMediaTasks(
        datatableSocialMediaTasks.currentPage,
        datatableSocialMediaTasks.perPage,
        {
          sortColumn: "id",
          sortDirection: "desc",
        }
      );

      fetchSocialMediaPlatforms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  if (!authContext.can("tasks.socialMedia.browse")) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Snackbar
        autoHideDuration={6000}
        open={isSocialMediaTaskToastOpen}
        onClose={handleSocialMediaTaskToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert onClose={handleSocialMediaTaskToastClose} severity="success" sx={{ width: "100%" }}>
          <FormattedMessage id="socialMediaTasks.forms.create.success.messageBody" />
        </Alert>
      </Snackbar>

      <SoftBox py={3}>
        <Card>
          <SoftBox
            sx={{
              p: 1,
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                },
              },
            }}
          >
            <DataGrid
              rows={datatableSocialMediaTasks.data}
              rowCount={datatableSocialMediaTasks.total}
              logLevel={false}
              pageSize={datatableSocialMediaTasks.perPage}
              paginationMode="server"
              sortingMode="server"
              columns={columns}
              autoHeight
              stickyHeader
              disableColumnMenu
              loading={datatableSocialMediaTasks.isLoading}
              filterMode="server"
              initialState={{
                sorting: { sortModel: [{ field: "id", sort: "desc" }] },
              }}
              components={{
                Toolbar: QuickSearchToolbar,
                LoadingOverlay: CustomLinearProgress,
              }}
              localeText={
                "ar-SA" === intl.locale
                  ? arSD.components.MuiDataGrid.defaultProps.localeText
                  : enUS.components.MuiDataGrid.defaultProps.localeText
              }
              sx={{
                border: "none",
              }}
              onPageChange={(page) =>
                fetchDatatableSocialMediaTasks(page + 1, datatableSocialMediaTasks.perPage)
              }
              onSortModelChange={(model) =>
                model.length > 0
                  ? fetchDatatableSocialMediaTasks(
                      datatableSocialMediaTasks.currentPage,
                      datatableSocialMediaTasks.perPage,
                      {
                        // globalSearch: this.state.globalSearch,
                        sortColumn: model[0].field,
                        sortDirection: model[0].sort,
                      }
                    )
                  : undefined
              }
            />
          </SoftBox>
        </Card>
      </SoftBox>

      <Dialog
        maxWidth="lg"
        scroll="body"
        fullWidth
        fullScreen={fullScreen}
        open={isSocialMediaTaskModalOpen}
        onClose={toggleSocialMediaTaskModal}
      >
        <DialogContent dividers>
          <Form
            initialValues={{
              title: "",
              url: "",
            }}
            onSubmit={async (values, form) => {
              const created = await handleSocialMediaTaskCreate(values);

              if (created) {
                form.restart();
              }
            }}
            render={({ handleSubmit, submitting, errors, touched }) => (
              <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                {!socialMediaTaskForm.isSubmitting && socialMediaTaskForm.hasError && (
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <Alert variant="filled" severity="error">
                        <FormattedMessage id="global.errors.api.remoteServerFailed" />
                      </Alert>
                    </Grid>
                  </Grid>
                )}

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
                            socialMediaTaskForm.isSubmitting ||
                            socialMediaPlatforms.isLoading ||
                            !socialMediaPlatforms.isLoaded ||
                            socialMediaPlatforms.hasError
                          }
                          hasUnprocessableEntities={socialMediaTaskForm.hasUnprocessableEntities}
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
                          disabled={submitting || socialMediaTaskForm.isSubmitting}
                          hasUnprocessableEntities={socialMediaTaskForm.hasUnprocessableEntities}
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.socialMediaTasks.image.labelText" /> (&#42;)
                    </SoftTypography>

                    <Field
                      name="image"
                      validateFields={[]}
                      validate={async (value) =>
                        await validateFormInput(value, {
                          required: {
                            error: intl.formatMessage({
                              id: "forms.input.socialMediaTasks.image.errorMessages.required",
                            }),
                          },
                        })
                      }
                    >
                      {(fieldProps) => (
                        <FileField
                          errors={errors}
                          touched={touched}
                          meta={fieldProps.meta}
                          input={fieldProps.input}
                          disabled={submitting || socialMediaTaskForm.isSubmitting}
                          hasUnprocessableEntities={socialMediaTaskForm.hasUnprocessableEntities}
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
                          disabled={submitting || socialMediaTaskForm.isSubmitting}
                          hasUnprocessableEntities={socialMediaTaskForm.hasUnprocessableEntities}
                        />
                      )}
                    </Field>
                  </SoftBox>
                </SoftBox>

                <SoftBox mb={2}>
                  <SoftBox mt={4} mb={1}>
                    <Divider />

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                      <SoftButton
                        type="submit"
                        color="warning"
                        disabled={submitting || socialMediaTaskForm.isSubmitting}
                      >
                        <FormattedMessage id="socialMediaTasks.forms.create.createButtonText" />
                      </SoftButton>

                      <SoftButton
                        type="submit"
                        color="secondary"
                        onClick={toggleSocialMediaTaskModal}
                        disabled={submitting || socialMediaTaskForm.isSubmitting}
                      >
                        <FormattedMessage id="socialMediaTasks.forms.create.cancelButtonText" />
                      </SoftButton>
                    </Stack>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            )}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

// ----------------------------------------------------------------------

export default injectIntl(SocialMediaTasksIndexPage);
