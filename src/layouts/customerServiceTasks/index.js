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

// axios
import axios from "utils/axios";

// redux
import { useDispatch } from "react-redux";
import { create, destroy } from "store/actions/customerServiceTasks";
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

// constants
import { API_CUSTOMER_SERVICE_TASKS_LIST_ROUTE_PATH } from "constants/customerServiceTasks.api";

// ----------------------------------------------------------------------

function CustomLinearProgress() {
  return <LinearProgress color="warning" variant="indeterminate" />;
}

// ----------------------------------------------------------------------

CustomerServiceTasksIndexPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

function CustomerServiceTasksIndexPage({ intl }) {
  // state
  const [customerServiceTaskModalOperation, setCustomerServiceTaskModalOperation] = useState({
    operation: "create",
    customer: {},
  });

  const [isCustomerServiceTaskModalOpen, setIsCustomerServiceTaskModalOpen] = useState(false);

  const [isCustomerServiceTaskToastOpen, setIsCustomerServiceTaskToastOpen] = useState(false);

  const [customerServiceTaskForm, setCustomerServiceTaskForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [datatableCustomerServiceTasks, setDatatableCustomerServiceTasks] = useState({
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

  const toggleCustomerServiceTaskModal = () => {
    setIsCustomerServiceTaskModalOpen(!isCustomerServiceTaskModalOpen);
  };

  const handleCustomerServiceTaskToastClose = () => {
    setIsCustomerServiceTaskToastOpen(false);
    closeSuccessApiNotification();
  };

  function fetchDatatableCustomerServiceTasks(pageNumber, pageSize, options = {}) {
    setDatatableCustomerServiceTasks({ ...datatableCustomerServiceTasks, isLoading: true });

    axios
      .get(API_CUSTOMER_SERVICE_TASKS_LIST_ROUTE_PATH, {
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

        setDatatableCustomerServiceTasks({
          ...datatableCustomerServiceTasks,
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

  async function handleCustomerServiceTaskCreate(data) {
    setCustomerServiceTaskForm({
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

      setCustomerServiceTaskForm({
        ...customerServiceTaskForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setDatatableCustomerServiceTasks({
        ...datatableCustomerServiceTasks,
        data: [...datatableCustomerServiceTasks.data, response.data],
      });

      setIsCustomerServiceTaskToastOpen(true);
      toggleCustomerServiceTaskModal();

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // unprocessable entities
        setCustomerServiceTaskForm({
          ...customerServiceTaskForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setCustomerServiceTaskForm({ ...customerServiceTaskForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handleCustomerServiceTaskDestroy(slug) {
    const request = await dispatch(destroy(slug));

    if (!request.failed) {
      return swalSuccess.fire({
        icon: "success",
        title: intl.formatMessage({
          id: "customerServiceTasks.list.dataTable.actions.destroy.messages.success.messageHeader",
        }),
        text: intl.formatMessage({
          id: "customerServiceTasks.list.dataTable.actions.destroy.messages.success.messageBody",
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
          {authContext.can("tasks.customerService.store") && (
            <SoftButton
              color="warning"
              disabled={isCustomerServiceTaskModalOpen}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ mx: 1, my: 3, display: "flex" }}
              onClick={(e) => {
                e.preventDefault();

                setCustomerServiceTaskModalOperation({
                  ...customerServiceTaskModalOperation,
                  operation: "create",
                  customer: {},
                });
                toggleCustomerServiceTaskModal();
              }}
            >
              <FormattedMessage id="customerServiceTasks.list.dataTable.header.createButtonText" />
            </SoftButton>
          )}
        </Grid>
      </Grid>
    );
  }

  const columns = [
    {
      field: "id",
      headerName: intl.formatMessage({
        id: "customerServiceTasks.list.dataTable.header.idColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params) => params.row.order_id,
    },
    {
      field: "title",
      headerName: intl.formatMessage({
        id: "customerServiceTasks.list.dataTable.header.titleColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params) => params.row.title,
    },
    {
      field: "customer_name",
      headerName: intl.formatMessage({
        id: "customerServiceTasks.list.dataTable.header.customerNameColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params) => params.row.customer_name,
    },
    {
      field: "created_at",
      headerName: intl.formatMessage({
        id: "customerServiceTasks.list.dataTable.header.createdAtColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params) => <Moment format="YYYY/MM/DD">{params.row.created_at}</Moment>,
    },
    {
      field: "actions",
      headerName: intl.formatMessage({
        id: "customerServiceTasks.list.dataTable.header.actionsColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <Stack direction="row">
            {authContext.can("tasks.customerService.update") && (
              <Link color="info" to={`/customer-service-tasks/${params.row.slug}`}>
                <EditIcon sx={{ height: 22, width: 22, mt: 1 }} color="info" />
              </Link>
            )}

            {authContext.can("tasks.customerService.destroy") && (
              <IconButton
                color="error"
                onClick={(e) => {
                  e.preventDefault();

                  swalDanger.fire({
                    icon: "question",
                    title: intl.formatMessage({
                      id: "customerServiceTasks.list.dataTable.actions.destroy.headerText",
                    }),
                    text: intl.formatMessage({
                      id: "customerServiceTasks.list.dataTable.actions.destroy.bodyText",
                    }),
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                    confirmButtonText: intl.formatMessage({
                      id: "customerServiceTasks.list.dataTable.actions.destroy.confirmText",
                    }),
                    cancelButtonText: intl.formatMessage({
                      id: "customerServiceTasks.list.dataTable.actions.destroy.cancelText",
                    }),
                    preConfirm: async () => {
                      await handleCustomerServiceTaskDestroy(params.row.slug);

                      const parsedCustomerServices = datatableCustomerServiceTasks.data.filter(
                        (service) => params.row.id !== service.id
                      );

                      setDatatableCustomerServiceTasks({
                        ...datatableCustomerServiceTasks,
                        data: [...parsedCustomerServices],
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
    document.title = intl.formatMessage({ id: "customerServiceTasks.pages.list.title" });

    if (!isUserAuthenticated) {
      navigate("/");
    }

    if (isUserAuthenticated) {
      fetchDatatableCustomerServiceTasks(
        datatableCustomerServiceTasks.currentPage,
        datatableCustomerServiceTasks.perPage,
        {
          sortColumn: "id",
          sortDirection: "desc",
        }
      );
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
        open={isCustomerServiceTaskToastOpen}
        onClose={handleCustomerServiceTaskToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleCustomerServiceTaskToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          <FormattedMessage id="customerServiceTasks.forms.create.success.messageBody" />
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
              rows={datatableCustomerServiceTasks.data}
              rowCount={datatableCustomerServiceTasks.total}
              logLevel={false}
              pageSize={datatableCustomerServiceTasks.perPage}
              paginationMode="server"
              sortingMode="server"
              columns={columns}
              autoHeight
              stickyHeader
              disableColumnMenu
              loading={datatableCustomerServiceTasks.isLoading}
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
                fetchDatatableCustomerServiceTasks(page + 1, datatableCustomerServiceTasks.perPage)
              }
              onSortModelChange={(model) =>
                model.length > 0
                  ? fetchDatatableCustomerServiceTasks(
                      datatableCustomerServiceTasks.currentPage,
                      datatableCustomerServiceTasks.perPage,
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
        open={isCustomerServiceTaskModalOpen}
        onClose={toggleCustomerServiceTaskModal}
      >
        <DialogContent dividers>
          <Form
            initialValues={{
              title: "",
              customer_name: "",
              description: "",
            }}
            onSubmit={async (values, form) => {
              const created = await handleCustomerServiceTaskCreate(values);

              if (created) {
                form.restart();
              }
            }}
            render={({ handleSubmit, submitting, errors, touched }) => (
              <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                {!customerServiceTaskForm.isSubmitting && customerServiceTaskForm.hasError && (
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
                          disabled={submitting || customerServiceTaskForm.isSubmitting}
                          hasUnprocessableEntities={
                            customerServiceTaskForm.hasUnprocessableEntities
                          }
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.customerServiceTasks.customerName.labelText" />{" "}
                      (&#42;)
                    </SoftTypography>

                    <Field
                      name="customer_name"
                      validateFields={[]}
                      validate={async (value) =>
                        await validateFormInput(value, {
                          required: {
                            error: intl.formatMessage({
                              id: "forms.input.customerServiceTasks.customerName.errorMessages.required",
                            }),
                          },
                          max: {
                            length: 200,
                            error: intl.formatMessage({
                              id: "forms.input.customerServiceTasks.customerName.errorMessages.max",
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
                          disabled={submitting || customerServiceTaskForm.isSubmitting}
                          hasUnprocessableEntities={
                            customerServiceTaskForm.hasUnprocessableEntities
                          }
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.customerServiceTasks.orderId.labelText" />{" "}
                      (&#42;)
                    </SoftTypography>

                    <Field
                      name="order_id"
                      validateFields={[]}
                      validate={async (value) =>
                        await validateFormInput(value, {
                          required: {
                            error: intl.formatMessage({
                              id: "forms.input.customerServiceTasks.orderId.errorMessages.required",
                            }),
                          },
                          max: {
                            length: 200,
                            error: intl.formatMessage({
                              id: "forms.input.customerServiceTasks.orderId.errorMessages.max",
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
                          disabled={submitting || customerServiceTaskForm.isSubmitting}
                          hasUnprocessableEntities={
                            customerServiceTaskForm.hasUnprocessableEntities
                          }
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.description.labelText" /> (&#42;)
                    </SoftTypography>

                    <Field
                      name="description"
                      validateFields={[]}
                      validate={async (value) =>
                        await validateFormInput(value, {
                          required: {
                            error: intl.formatMessage({
                              id: "forms.input.description.errorMessages.required",
                            }),
                          },
                          max: {
                            length: 16000,
                            error: intl.formatMessage({
                              id: "forms.input.description.errorMessages.max",
                            }),
                          },
                        })
                      }
                    >
                      {(fieldProps) => (
                        <TextField
                          errors={errors}
                          fullWidth
                          multiline
                          rows={10}
                          touched={touched}
                          meta={fieldProps.meta}
                          input={fieldProps.input}
                          disabled={submitting || customerServiceTaskForm.isSubmitting}
                          hasUnprocessableEntities={
                            customerServiceTaskForm.hasUnprocessableEntities
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
                        disabled={submitting || customerServiceTaskForm.isSubmitting}
                      >
                        <FormattedMessage id="customerServiceTasks.forms.create.createButtonText" />
                      </SoftButton>

                      <SoftButton
                        type="submit"
                        color="secondary"
                        onClick={toggleCustomerServiceTaskModal}
                        disabled={submitting || customerServiceTaskForm.isSubmitting}
                      >
                        <FormattedMessage id="customerServiceTasks.forms.create.cancelButtonText" />
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

export default injectIntl(CustomerServiceTasksIndexPage);
