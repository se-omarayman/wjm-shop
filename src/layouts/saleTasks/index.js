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
import { create, destroy } from "store/actions/saleTasks";
import { closeSuccessApiNotification } from "store/actions/notifications";

// contexts
import { AuthContext } from "contexts/AuthContext";

// i18n
import { injectIntl, FormattedMessage } from "react-intl";

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
import FileField from "components/Forms/FileField";

// constants
import { API_SALE_TASKS_LIST_ROUTE_PATH } from "constants/saleTasks.api";

// ----------------------------------------------------------------------

function CustomLinearProgress() {
  return <LinearProgress color="warning" variant="indeterminate" />;
}

// ----------------------------------------------------------------------

SaleTasksIndexPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

function SaleTasksIndexPage({ intl }) {
  // state
  const [saleTaskModalOperation, setSaleTaskModalOperation] = useState({
    operation: "create",
    task: {},
  });

  const [isSaleTaskModalOpen, setIsSaleTaskModalOpen] = useState(false);

  const [isSaleTaskToastOpen, setIsSaleTaskToastOpen] = useState(false);

  const [saleTaskForm, setSaleTaskForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [datatableSaleTasks, setDatatableSaleTasks] = useState({
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

  const toggleSaleTaskModal = () => {
    setIsSaleTaskModalOpen(!isSaleTaskModalOpen);
  };

  const handleSaleTaskToastClose = () => {
    setIsSaleTaskToastOpen(false);
    closeSuccessApiNotification();
  };

  function fetchDatatableSaleTasks(pageNumber, pageSize, options = {}) {
    setDatatableSaleTasks({ ...datatableSaleTasks, isLoading: true });

    axios
      .get(API_SALE_TASKS_LIST_ROUTE_PATH, {
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

        setDatatableSaleTasks({
          ...datatableSaleTasks,
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

  async function handleSaleTaskCreate(data) {
    setSaleTaskForm({
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

      setSaleTaskForm({
        ...saleTaskForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setDatatableSaleTasks({
        ...datatableSaleTasks,
        data: [...datatableSaleTasks.data, response.data],
      });

      setIsSaleTaskToastOpen(true);
      toggleSaleTaskModal();

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // unprocessable entities
        setSaleTaskForm({
          ...saleTaskForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setSaleTaskForm({ ...saleTaskForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handleSaleTaskDestroy(slug) {
    const request = await dispatch(destroy(slug));

    if (!request.failed) {
      return swalSuccess.fire({
        icon: "success",
        title: intl.formatMessage({
          id: "saleTasks.list.dataTable.actions.destroy.messages.success.messageHeader",
        }),
        text: intl.formatMessage({
          id: "saleTasks.list.dataTable.actions.destroy.messages.success.messageBody",
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
          {authContext.can("tasks.sale.store") && (
            <SoftButton
              color="warning"
              disabled={isSaleTaskModalOpen}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ mx: 1, my: 3, display: "flex" }}
              onClick={(e) => {
                e.preventDefault();

                setSaleTaskModalOperation({
                  ...saleTaskModalOperation,
                  operation: "create",
                  customer: {},
                });
                toggleSaleTaskModal();
              }}
            >
              <FormattedMessage id="saleTasks.list.dataTable.header.createButtonText" />
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
        id: "saleTasks.list.dataTable.header.nameColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <SoftTypography>{params.row.name}</SoftTypography>

          <MuiLink target="_blank" href={params.row.url}>
            <LaunchOutlinedIcon color="info" sx={{ mt: 0.8, height: 18, width: 18 }} />
          </MuiLink>
        </Stack>
      ),
    },
    {
      field: "created_at",
      headerName: intl.formatMessage({
        id: "saleTasks.list.dataTable.header.createdAtColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params) => <Moment format="YYYY/MM/DD">{params.row.date}</Moment>,
    },
    {
      field: "actions",
      headerName: intl.formatMessage({
        id: "saleTasks.list.dataTable.header.actionsColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <Stack direction="row">
            {authContext.can("tasks.sale.update") && (
              <Link color="info" to={`/sale-tasks/${params.row.slug}`}>
                <EditIcon sx={{ height: 22, width: 22, mr: 1, mt: 1 }} color="info" />
              </Link>
            )}

            <MuiLink
              color="info"
              target="_blank"
              href={`http://localhost:8000/modules/saletasks/images/${params.row.image}`}
            >
              <DownloadForOfflineOutlinedIcon sx={{ height: 22, width: 22, mt: 1 }} color="info" />
            </MuiLink>

            {authContext.can("tasks.sale.destroy") && (
              <IconButton
                color="error"
                onClick={(e) => {
                  e.preventDefault();

                  swalDanger.fire({
                    icon: "question",
                    title: intl.formatMessage({
                      id: "saleTasks.list.dataTable.actions.destroy.headerText",
                    }),
                    text: intl.formatMessage({
                      id: "saleTasks.list.dataTable.actions.destroy.bodyText",
                    }),
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                    confirmButtonText: intl.formatMessage({
                      id: "saleTasks.list.dataTable.actions.destroy.confirmText",
                    }),
                    cancelButtonText: intl.formatMessage({
                      id: "saleTasks.list.dataTable.actions.destroy.cancelText",
                    }),
                    preConfirm: async () => {
                      await handleSaleTaskDestroy(params.row.slug);

                      const parsedSocialMedias = datatableSaleTasks.data.filter(
                        (service) => params.row.id !== service.id
                      );

                      setDatatableSaleTasks({
                        ...datatableSaleTasks,
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
    document.title = intl.formatMessage({ id: "saleTasks.pages.list.title" });

    if (!isUserAuthenticated) {
      navigate("/");
    }

    if (isUserAuthenticated) {
      fetchDatatableSaleTasks(datatableSaleTasks.currentPage, datatableSaleTasks.perPage, {
        sortColumn: "id",
        sortDirection: "desc",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  if (!authContext.can("tasks.sale.browse")) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Snackbar
        autoHideDuration={6000}
        open={isSaleTaskToastOpen}
        onClose={handleSaleTaskToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert onClose={handleSaleTaskToastClose} severity="success" sx={{ width: "100%" }}>
          <FormattedMessage id="saleTasks.forms.create.success.messageBody" />
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
              rows={datatableSaleTasks.data}
              rowCount={datatableSaleTasks.total}
              logLevel={false}
              pageSize={datatableSaleTasks.perPage}
              paginationMode="server"
              sortingMode="server"
              columns={columns}
              autoHeight
              stickyHeader
              disableColumnMenu
              loading={datatableSaleTasks.isLoading}
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
              onPageChange={(page) => fetchDatatableSaleTasks(page + 1, datatableSaleTasks.perPage)}
              onSortModelChange={(model) =>
                model.length > 0
                  ? fetchDatatableSaleTasks(
                      datatableSaleTasks.currentPage,
                      datatableSaleTasks.perPage,
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
        open={isSaleTaskModalOpen}
        onClose={toggleSaleTaskModal}
      >
        <DialogContent dividers>
          <Form
            initialValues={{
              name: "",
              url: "",
              serial_number: "",
            }}
            onSubmit={async (values, form) => {
              const created = await handleSaleTaskCreate(values);

              if (created) {
                form.restart();
              }
            }}
            render={({ handleSubmit, submitting, errors, touched }) => (
              <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                {!saleTaskForm.isSubmitting && saleTaskForm.hasError && (
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
                          disabled={submitting || saleTaskForm.isSubmitting}
                          hasUnprocessableEntities={saleTaskForm.hasUnprocessableEntities}
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.saleTasks.image.labelText" /> (&#42;)
                    </SoftTypography>

                    <Field
                      name="image"
                      validateFields={[]}
                      validate={async (value) =>
                        await validateFormInput(value, {
                          required: {
                            error: intl.formatMessage({
                              id: "forms.input.saleTasks.image.errorMessages.required",
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
                          disabled={submitting || saleTaskForm.isSubmitting}
                          hasUnprocessableEntities={saleTaskForm.hasUnprocessableEntities}
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
                          disabled={submitting || saleTaskForm.isSubmitting}
                          hasUnprocessableEntities={saleTaskForm.hasUnprocessableEntities}
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.saleTasks.serialNumber.labelText" /> (&#42;)
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
                          disabled={submitting || saleTaskForm.isSubmitting}
                          hasUnprocessableEntities={saleTaskForm.hasUnprocessableEntities}
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
                        disabled={submitting || saleTaskForm.isSubmitting}
                      >
                        <FormattedMessage id="saleTasks.forms.create.createButtonText" />
                      </SoftButton>

                      <SoftButton
                        type="submit"
                        color="secondary"
                        onClick={toggleSaleTaskModal}
                        disabled={submitting || saleTaskForm.isSubmitting}
                      >
                        <FormattedMessage id="saleTasks.forms.create.cancelButtonText" />
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

export default injectIntl(SaleTasksIndexPage);
