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
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

// @mui
// -- data tables
import { DataGrid, enUS, arSD } from "@mui/x-data-grid";
// -- styles
import { useTheme } from "@mui/material/styles";
// -- components
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
// -- icons
import AddLinkOutlinedIcon from "@mui/icons-material/AddLinkOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

// axios
import axios from "utils/axios";

// redux
import { useDispatch } from "react-redux";
import { create, update, archive, unarchive } from "store/actions/socialMediaPlatforms";
import { closeSuccessApiNotification } from "store/actions/notifications";

// i18n
import { injectIntl, FormattedMessage } from "react-intl";
import { trans } from "utils/i18n";

// sweet alert
import { swalSuccess, swalWarning, swalError, swalDanger } from "utils/swal";

// forms
import { Form, Field } from "react-final-form";
import validateFormInput from "utils/validateFormInput";

// contexts
import { AuthContext } from "contexts/AuthContext";

// soft ui dashboard react
import DashboardLayout from "containers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Footer from "components/Footer";
import SoftButton from "components/SoftButton";
//
import TextField from "components/Forms/TextField";

// constants
import { API_SOCIAL_MEDIA_PLATFORMS_LIST_ROUTE_PATH } from "constants/socialMediaPlatforms.api";

// ----------------------------------------------------------------------

function CustomLinearProgress() {
  return <LinearProgress color="warning" variant="indeterminate" />;
}

// ----------------------------------------------------------------------

SocialMediaPlatformsPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

function SocialMediaPlatformsPage({ intl }) {
  // state
  const [socialMediaPlatformModalOperation, setSocialMediaPlatformModalOperation] = useState({
    operation: "create",
    platform: {},
  });

  const [isSocialMediaPlatformModalOpen, setIsSocialMediaPlatformModalOpen] = useState(false);

  const [isSocialMediaPlatformToastOpen, setIsSocialMediaPlatformToastOpen] = useState(false);

  const [socialMediaPlatformForm, setSocialMediaPlatformForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [datatableSocialMediaPlatforms, setDatatableSocialMediaPlatforms] = useState({
    perPage: 15,
    currentPage: 1,
    lastPage: 1,
    isLoading: false,
    data: [],
    from: 0,
    to: 0,
    total: 0,
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

  const toggleSocialMediaPlatformModal = () => {
    setIsSocialMediaPlatformModalOpen(!isSocialMediaPlatformModalOpen);
  };

  const handleSocialMediaPlatformToastClose = () => {
    setIsSocialMediaPlatformToastOpen(false);
    closeSuccessApiNotification();
  };

  function fetchDatatableSocialMediaPlatforms(pageNumber, pageSize, options = {}) {
    setDatatableSocialMediaPlatforms({ ...datatableSocialMediaPlatforms, isLoading: true });

    axios
      .get(API_SOCIAL_MEDIA_PLATFORMS_LIST_ROUTE_PATH, {
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

        setDatatableSocialMediaPlatforms({
          ...datatableSocialMediaPlatforms,
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

  async function handleSocialMediaPlatformCreate(data) {
    setSocialMediaPlatformForm({
      hasUnprocessableEntities: false,
      isSubmitting: true,
      hasError: false,
    });

    const payload = {
      ...data,
    };

    const request = await dispatch(create(payload));

    if (!request.failed) {
      const response = request.response.data;

      setSocialMediaPlatformForm({
        ...socialMediaPlatformForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setDatatableSocialMediaPlatforms({
        ...datatableSocialMediaPlatforms,
        data: [...datatableSocialMediaPlatforms.data, response.data],
      });

      setIsSocialMediaPlatformToastOpen(true);
      toggleSocialMediaPlatformModal();

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // unprocessable entities
        setSocialMediaPlatformForm({
          ...socialMediaPlatformForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setSocialMediaPlatformForm({ ...socialMediaPlatformForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handleSocialMediaPlatformUpdate(data) {
    setSocialMediaPlatformForm({
      ...socialMediaPlatformForm,
      hasUnprocessableEntities: false,
      isSubmitting: true,
      hasError: false,
    });

    const payload = {
      ...data,
    };

    const request = await dispatch(update(socialMediaPlatformModalOperation.platform.id, payload));

    if (!request.failed) {
      const response = request.response.data;

      const parsedPlatforms = datatableSocialMediaPlatforms.data.map((platform) => {
        if (socialMediaPlatformModalOperation.platform.id === platform.id) {
          return response.data;
        }

        return platform;
      });

      setSocialMediaPlatformForm({
        ...socialMediaPlatformForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setDatatableSocialMediaPlatforms({
        ...datatableSocialMediaPlatforms,
        data: [...parsedPlatforms],
      });

      setIsSocialMediaPlatformToastOpen(true);
      toggleSocialMediaPlatformModal();

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // unprocessable entities
        setSocialMediaPlatformForm({
          ...socialMediaPlatformForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setSocialMediaPlatformForm({ ...socialMediaPlatformForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handleSocialMediaPlatformArchive(id) {
    const request = await dispatch(archive(id));

    if (!request.failed) {
      return swalSuccess.fire({
        icon: "success",
        title: intl.formatMessage({
          id: "socialMediaPlatforms.list.dataTable.actions.archive.messages.success.messageHeader",
        }),
        text: intl.formatMessage({
          id: "socialMediaPlatforms.list.dataTable.actions.archive.messages.success.messageBody",
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

  async function handleSocialMediaPlatformUnarchive(id) {
    const request = await dispatch(unarchive(id));

    if (!request.failed) {
      return swalSuccess.fire({
        icon: "success",
        title: intl.formatMessage({
          id: "socialMediaPlatforms.list.dataTable.actions.unarchive.messages.success.messageHeader",
        }),
        text: intl.formatMessage({
          id: "socialMediaPlatforms.list.dataTable.actions.unarchive.messages.success.messageBody",
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
      <Grid container={true}>
        <Grid item={true} xs={6}>
          {authContext.can("socialMediaPlatforms.store") && (
            <SoftButton
              color="warning"
              disabled={isSocialMediaPlatformModalOpen}
              startIcon={<AddLinkOutlinedIcon />}
              sx={{ mx: 1, my: 3, display: "flex" }}
              onClick={(e) => {
                e.preventDefault();

                setSocialMediaPlatformModalOperation({
                  ...socialMediaPlatformModalOperation,
                  operation: "create",
                  platform: {},
                });
                toggleSocialMediaPlatformModal();
              }}
            >
              <FormattedMessage id="socialMediaPlatforms.list.dataTable.header.createButtonText" />
            </SoftButton>
          )}
        </Grid>
      </Grid>
    );
  }

  const columns = [
    {
      field: "name",
      headerName: intl.formatMessage({
        id: "socialMediaPlatforms.list.dataTable.header.nameColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params) => trans(params.row.name, intl.locale),
    },
    {
      field: "actions",
      headerName: intl.formatMessage({
        id: "socialMediaPlatforms.list.dataTable.header.actionsColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <Stack direction="row">
            {true === params.row.archived && authContext.can("socialMediaPlatforms.unarchive") && (
              <IconButton
                color="error"
                onClick={(e) => {
                  e.preventDefault();

                  swalWarning.fire({
                    icon: "question",
                    title: intl.formatMessage({
                      id: "socialMediaPlatforms.list.dataTable.actions.unarchive.headerText",
                    }),
                    text: intl.formatMessage({
                      id: "socialMediaPlatforms.list.dataTable.actions.unarchive.bodyText",
                    }),
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                    confirmButtonText: intl.formatMessage({
                      id: "socialMediaPlatforms.list.dataTable.actions.unarchive.confirmText",
                    }),
                    cancelButtonText: intl.formatMessage({
                      id: "socialMediaPlatforms.list.dataTable.actions.unarchive.cancelText",
                    }),
                    preConfirm: async () => {
                      await handleSocialMediaPlatformUnarchive(params.row.id);

                      const parsedPlatforms = datatableSocialMediaPlatforms.data.map((platform) => {
                        if (params.row.id === platform.id) {
                          return {
                            ...platform,
                            archived: false,
                          };
                        }

                        return platform;
                      });

                      setDatatableSocialMediaPlatforms({
                        ...datatableSocialMediaPlatforms,
                        data: [...parsedPlatforms],
                      });
                    },
                  });
                }}
              >
                <RestoreFromTrashOutlinedIcon />
              </IconButton>
            )}

            {false === params.row.archived && (
              <>
                {authContext.can("socialMediaPlatforms.update") && (
                  <IconButton
                    color="info"
                    onClick={(e) => {
                      e.preventDefault();

                      setSocialMediaPlatformModalOperation({
                        ...socialMediaPlatformModalOperation,
                        operation: "update",
                        platform: params.row,
                      });
                      toggleSocialMediaPlatformModal();
                    }}
                  >
                    <EditOutlinedIcon color="info" />
                  </IconButton>
                )}

                {authContext.can("socialMediaPlatforms.archive") && (
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.preventDefault();

                      swalDanger.fire({
                        icon: "question",
                        title: intl.formatMessage({
                          id: "socialMediaPlatforms.list.dataTable.actions.archive.headerText",
                        }),
                        text: intl.formatMessage({
                          id: "socialMediaPlatforms.list.dataTable.actions.archive.bodyText",
                        }),
                        showCancelButton: true,
                        showLoaderOnConfirm: true,
                        confirmButtonText: intl.formatMessage({
                          id: "socialMediaPlatforms.list.dataTable.actions.archive.confirmText",
                        }),
                        cancelButtonText: intl.formatMessage({
                          id: "socialMediaPlatforms.list.dataTable.actions.archive.cancelText",
                        }),
                        preConfirm: async () => {
                          await handleSocialMediaPlatformArchive(params.row.id);

                          const parsedPlatforms = datatableSocialMediaPlatforms.data.map(
                            (platform) => {
                              if (params.row.id === platform.id) {
                                return {
                                  ...platform,
                                  archived: true,
                                };
                              }

                              return platform;
                            }
                          );

                          setDatatableSocialMediaPlatforms({
                            ...datatableSocialMediaPlatforms,
                            data: [...parsedPlatforms],
                          });
                        },
                      });
                    }}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                )}
              </>
            )}
          </Stack>
        </>
      ),
    },
  ];

  useEffect(() => {
    document.title = intl.formatMessage({ id: "socialMediaPlatforms.pages.list.title" });

    if (!isUserAuthenticated) {
      navigate("/");
    }

    if (isUserAuthenticated) {
      fetchDatatableSocialMediaPlatforms(
        datatableSocialMediaPlatforms.currentPage,
        datatableSocialMediaPlatforms.perPage,
        {
          sortColumn: "id",
          sortDirection: "desc",
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  if (!authContext.can("socialMediaPlatforms.browse")) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Snackbar
        autoHideDuration={6000}
        open={isSocialMediaPlatformToastOpen}
        onClose={handleSocialMediaPlatformToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleSocialMediaPlatformToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {"update" === socialMediaPlatformModalOperation.operation ? (
            <FormattedMessage id="socialMediaPlatforms.forms.edit.success.messageBody" />
          ) : (
            <FormattedMessage id="socialMediaPlatforms.forms.create.success.messageBody" />
          )}
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
              rows={datatableSocialMediaPlatforms.data}
              rowCount={datatableSocialMediaPlatforms.total}
              logLevel={false}
              pageSize={datatableSocialMediaPlatforms.perPage}
              paginationMode="server"
              sortingMode="server"
              columns={columns}
              autoHeight={true}
              stickyHeader={true}
              disableColumnMenu={true}
              loading={datatableSocialMediaPlatforms.isLoading}
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
                fetchDatatableSocialMediaPlatforms(page + 1, datatableSocialMediaPlatforms.perPage)
              }
              onSortModelChange={(model) =>
                model.length > 0
                  ? fetchDatatableSocialMediaPlatforms(
                      datatableSocialMediaPlatforms.currentPage,
                      datatableSocialMediaPlatforms.perPage,
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
        fullWidth={true}
        fullScreen={fullScreen}
        open={isSocialMediaPlatformModalOpen}
        onClose={toggleSocialMediaPlatformModal}
      >
        <DialogContent dividers={true}>
          <Form
            initialValues={{
              name_en:
                "update" === socialMediaPlatformModalOperation.operation
                  ? socialMediaPlatformModalOperation.platform.name.en
                  : "",
              name_ar:
                "update" === socialMediaPlatformModalOperation.operation
                  ? socialMediaPlatformModalOperation.platform.name.ar
                  : "",
            }}
            onSubmit={async (values, form) => {
              if ("create" === socialMediaPlatformModalOperation.operation) {
                const created = await handleSocialMediaPlatformCreate(values);

                if (created) {
                  form.restart();
                }
              }

              if ("update" === socialMediaPlatformModalOperation.operation) {
                const updated = await handleSocialMediaPlatformUpdate(values);

                if (updated) {
                  form.restart();
                }
              }
            }}
            render={({ handleSubmit, submitting, errors, touched }) => (
              <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                {!socialMediaPlatformForm.isSubmitting && socialMediaPlatformForm.hasError && (
                  <Grid container={true} sx={{ mb: 2 }}>
                    <Grid item={true} xs={12}>
                      <Alert variant="filled" severity="error">
                        <FormattedMessage id="global.errors.api.remoteServerFailed" />
                      </Alert>
                    </Grid>
                  </Grid>
                )}

                <SoftBox mb={2}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.name_english.labelText" /> (&#42;)
                    </SoftTypography>

                    <Field
                      name="name_en"
                      validateFields={[]}
                      validate={async (value) =>
                        await validateFormInput(value, {
                          required: {
                            error: intl.formatMessage({
                              id: "forms.input.name_english.errorMessages.required",
                            }),
                          },
                          max: {
                            length: 200,
                            error: intl.formatMessage({
                              id: "forms.input.name_english.errorMessages.max",
                            }),
                          },
                        })
                      }
                    >
                      {(fieldProps) => (
                        <TextField
                          errors={errors}
                          fullWidth={true}
                          touched={touched}
                          meta={fieldProps.meta}
                          input={fieldProps.input}
                          disabled={submitting || socialMediaPlatformForm.isSubmitting}
                          hasUnprocessableEntities={
                            socialMediaPlatformForm.hasUnprocessableEntities
                          }
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.name_arabic.labelText" /> (&#42;)
                    </SoftTypography>

                    <Field
                      name="name_ar"
                      validateFields={[]}
                      validate={async (value) =>
                        await validateFormInput(value, {
                          required: {
                            error: intl.formatMessage({
                              id: "forms.input.name_arabic.errorMessages.required",
                            }),
                          },
                          max: {
                            length: 200,
                            error: intl.formatMessage({
                              id: "forms.input.name_arabic.errorMessages.max",
                            }),
                          },
                        })
                      }
                    >
                      {(fieldProps) => (
                        <TextField
                          errors={errors}
                          fullWidth={true}
                          touched={touched}
                          meta={fieldProps.meta}
                          input={fieldProps.input}
                          disabled={submitting || socialMediaPlatformForm.isSubmitting}
                          hasUnprocessableEntities={
                            socialMediaPlatformForm.hasUnprocessableEntities
                          }
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
                        disabled={submitting || socialMediaPlatformForm.isSubmitting}
                      >
                        {"update" === socialMediaPlatformModalOperation.operation ? (
                          <FormattedMessage id="socialMediaPlatforms.forms.edit.updateButtonText" />
                        ) : (
                          <FormattedMessage id="socialMediaPlatforms.forms.create.createButtonText" />
                        )}
                      </SoftButton>

                      <SoftButton
                        type="submit"
                        color="secondary"
                        onClick={toggleSocialMediaPlatformModal}
                        disabled={submitting || socialMediaPlatformForm.isSubmitting}
                      >
                        {"update" === socialMediaPlatformModalOperation.operation ? (
                          <FormattedMessage id="socialMediaPlatforms.forms.edit.cancelButtonText" />
                        ) : (
                          <FormattedMessage id="socialMediaPlatforms.forms.create.cancelButtonText" />
                        )}
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

export default injectIntl(SocialMediaPlatformsPage);
