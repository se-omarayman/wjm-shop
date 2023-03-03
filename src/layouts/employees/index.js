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
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// material
import { DataGrid, enUS, arSD } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
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

// Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// axios
import axios from "utils/axios";

// Redux
import { useDispatch } from "react-redux";
import { create, archive, unarchive } from "store/actions/employees";
import { closeSuccessApiNotification } from "store/actions/notifications";

// Contexts
import { AuthContext } from "contexts/AuthContext";

// i18n
import { injectIntl, FormattedMessage } from "react-intl";

// Sweet alert
import { swalSuccess, swalWarning, swalError, swalDanger } from "utils/swal";

// Forms
import { Form, Field } from "react-final-form";
import validateFormInput from "utils/validateFormInput";

// Constants
import { API_EMPLOYEES_LIST_ROUTE_PATH } from "constants/employees.api";

// Soft UI Dashboard React
import DashboardLayout from "containers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Footer from "components/Footer";
import SoftButton from "components/SoftButton";
//
import TextField from "components/Forms/TextField";

function CustomLinearProgress() {
  return <LinearProgress color="warning" variant="indeterminate" />;
}

function EmployeesIndexPage({ intl }) {
  // state
  const [employeeModalOperation, setEmployeeModalOperation] = useState({
    operation: "create",
    employee: {},
  });

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const [datatableEmployees, setDatatableEmployees] = useState({
    perPage: 15,
    currentPage: 1,
    lastPage: 1,
    isLoading: false,
    data: [],
    from: 0,
    to: 0,
    total: 0,
  });

  const [isEmployeeToastOpen, setIsEmployeeToastOpen] = useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  // hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // contexts
  const authContext = useContext(AuthContext);

  const toggleEmployeeModal = () => {
    setIsEmployeeModalOpen(!isEmployeeModalOpen);
  };

  const handleEmployeeToastClose = () => {
    setIsEmployeeToastOpen(false);
    closeSuccessApiNotification();
  };

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  function fetchDatatableEmployees(pageNumber, pageSize, options = {}) {
    setDatatableEmployees({ ...datatableEmployees, isLoading: true });

    axios
      .get(API_EMPLOYEES_LIST_ROUTE_PATH, {
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

        setDatatableEmployees({
          ...datatableEmployees,
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

  async function handleEmployeeCreate(data) {
    setEmployeeForm({ hasUnprocessableEntities: false, isSubmitting: true, hasError: false });

    const payload = {
      ...data,
    };

    const request = await dispatch(create(payload));

    if (!request.failed) {
      const response = request.response.data;

      setEmployeeForm({
        ...employeeForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setDatatableEmployees({
        ...datatableEmployees,
        data: [...datatableEmployees.data, response.data],
      });

      setIsEmployeeToastOpen(true);
      toggleEmployeeModal();

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // Unprocessable entities
        setEmployeeForm({
          ...employeeForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setEmployeeForm({ ...employeeForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handleEmployeeArchive(id) {
    const request = await dispatch(archive(id));

    if (!request.failed) {
      return swalSuccess.fire({
        icon: "success",
        title: intl.formatMessage({
          id: "employees.list.dataTable.actions.archive.messages.success.messageHeader",
        }),
        text: intl.formatMessage({
          id: "employees.list.dataTable.actions.archive.messages.success.messageBody",
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

  async function handleEmployeeUnarchive(id) {
    const request = await dispatch(unarchive(id));

    if (!request.failed) {
      return swalSuccess.fire({
        icon: "success",
        title: intl.formatMessage({
          id: "employees.list.dataTable.actions.unarchive.messages.success.messageHeader",
        }),
        text: intl.formatMessage({
          id: "employees.list.dataTable.actions.unarchive.messages.success.messageBody",
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
          {authContext.can("employees.store") && (
            <SoftButton
              color="warning"
              disabled={isEmployeeModalOpen}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ mx: 1, my: 3, display: "flex" }}
              onClick={(e) => {
                e.preventDefault();

                setEmployeeModalOperation({
                  ...employeeModalOperation,
                  operation: "create",
                  employee: {},
                });
                toggleEmployeeModal();
              }}
            >
              <FormattedMessage id="employees.list.dataTable.header.createButtonText" />
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
        id: "employees.list.dataTable.header.nameColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params) => params.row.name,
    },
    {
      field: "email",
      headerName: intl.formatMessage({
        id: "employees.list.dataTable.header.emailColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params) => params.row.email,
    },
    {
      field: "actions",
      headerName: intl.formatMessage({
        id: "employees.list.dataTable.header.actionsColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <Stack direction="row">
            {true === params.row.archived && authContext.can("employees.unarchive") && (
              <IconButton
                color="error"
                onClick={(e) => {
                  e.preventDefault();

                  swalWarning.fire({
                    icon: "question",
                    title: intl.formatMessage({
                      id: "employees.list.dataTable.actions.unarchive.headerText",
                    }),
                    text: intl.formatMessage({
                      id: "employees.list.dataTable.actions.unarchive.bodyText",
                    }),
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                    confirmButtonText: intl.formatMessage({
                      id: "employees.list.dataTable.actions.unarchive.confirmText",
                    }),
                    cancelButtonText: intl.formatMessage({
                      id: "employees.list.dataTable.actions.unarchive.cancelText",
                    }),
                    preConfirm: async () => {
                      await handleEmployeeUnarchive(params.row.slug);

                      const parsedEmployees = datatableEmployees.data.map((employee) => {
                        if (params.row.id === employee.id) {
                          return {
                            ...employee,
                            archived: false,
                          };
                        }

                        return employee;
                      });

                      setDatatableEmployees({
                        ...datatableEmployees,
                        data: [...parsedEmployees],
                      });
                    },
                  });
                }}
              >
                <RestartAltIcon />
              </IconButton>
            )}

            {false === params.row.archived && (
              <>
                {(authContext.can("employees.update") || authContext.can("employees.browse")) && (
                  <Link component={IconButton} color="info" to={`/employees/${params.row.slug}`}>
                    <EditIcon sx={{ height: 22, width: 22, mt: 1 }} color="info" />
                  </Link>
                )}

                {authContext.can("employees.archive") && (
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.preventDefault();

                      swalDanger.fire({
                        icon: "question",
                        title: intl.formatMessage({
                          id: "employees.list.dataTable.actions.archive.headerText",
                        }),
                        text: intl.formatMessage({
                          id: "employees.list.dataTable.actions.archive.bodyText",
                        }),
                        showCancelButton: true,
                        showLoaderOnConfirm: true,
                        confirmButtonText: intl.formatMessage({
                          id: "employees.list.dataTable.actions.archive.confirmText",
                        }),
                        cancelButtonText: intl.formatMessage({
                          id: "employees.list.dataTable.actions.archive.cancelText",
                        }),
                        preConfirm: async () => {
                          await handleEmployeeArchive(params.row.slug);

                          const parsedEmployees = datatableEmployees.data.map((employee) => {
                            if (params.row.id === employee.id) {
                              return {
                                ...employee,
                                archived: true,
                              };
                            }

                            return employee;
                          });

                          setDatatableEmployees({
                            ...datatableEmployees,
                            data: [...parsedEmployees],
                          });
                        },
                      });
                    }}
                  >
                    <DeleteForeverIcon />
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
    document.title = intl.formatMessage({ id: "employees.pages.list.title" });

    if (!authContext.isUserAuthenticated()) {
      navigate("/");
    }

    if (authContext.isUserAuthenticated()) {
      fetchDatatableEmployees(datatableEmployees.currentPage, datatableEmployees.perPage, {
        sortColumn: "id",
        sortDirection: "desc",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.isUserAuthenticated()]);

  if (!authContext.can("employees.browse")) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Snackbar
        autoHideDuration={6000}
        open={isEmployeeToastOpen}
        onClose={handleEmployeeToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert onClose={handleEmployeeToastClose} severity="success" sx={{ width: "100%" }}>
          <FormattedMessage id="employees.forms.create.success.messageBody" />
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
              rows={datatableEmployees.data}
              rowCount={datatableEmployees.total}
              logLevel={false}
              pageSize={datatableEmployees.perPage}
              paginationMode="server"
              sortingMode="server"
              columns={columns}
              autoHeight={true}
              stickyHeader={true}
              disableColumnMenu={true}
              loading={datatableEmployees.isLoading}
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
              onPageChange={(page) => fetchDatatableEmployees(page + 1, datatableEmployees.perPage)}
              onSortModelChange={(model) =>
                model.length > 0
                  ? fetchDatatableEmployees(
                      datatableEmployees.currentPage,
                      datatableEmployees.perPage,
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
        open={isEmployeeModalOpen}
        onClose={toggleEmployeeModal}
      >
        <DialogContent dividers={true}>
          <Form
            initialValues={{
              name: "",
              email: "",
              password: "",
              password_confirmation: "",
            }}
            onSubmit={async (values, form) => {
              const created = await handleEmployeeCreate(values);

              if (created) {
                form.restart();
              }
            }}
            render={({ handleSubmit, submitting, errors, touched, values }) => (
              <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                {!employeeForm.isSubmitting && employeeForm.hasError && (
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
                          fullWidth={true}
                          touched={touched}
                          meta={fieldProps.meta}
                          input={fieldProps.input}
                          disabled={submitting || employeeForm.isSubmitting}
                          hasUnprocessableEntities={employeeForm.hasUnprocessableEntities}
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.email.labelText" /> (&#42;)
                    </SoftTypography>

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
                          max: {
                            length: 200,
                            error: intl.formatMessage({
                              id: "forms.input.email.errorMessages.max",
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
                          disabled={submitting || employeeForm.isSubmitting}
                          hasUnprocessableEntities={employeeForm.hasUnprocessableEntities}
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.password.labelText" /> (&#42;)
                    </SoftTypography>

                    <Field
                      name="password"
                      validate={async (value) =>
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
                          fullWidth={true}
                          touched={touched}
                          meta={fieldProps.meta}
                          input={fieldProps.input}
                          hasUnprocessableEntities={employeeForm.hasUnprocessableEntities}
                          type="password"
                          disabled={submitting || employeeForm.isSubmitting}
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.password_confirmation.labelText" /> (&#42;)
                    </SoftTypography>

                    <Field
                      name="password_confirmation"
                      validate={async (value) =>
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
                          fullWidth={true}
                          touched={touched}
                          meta={fieldProps.meta}
                          input={fieldProps.input}
                          hasUnprocessableEntities={employeeForm.hasUnprocessableEntities}
                          type="password"
                          disabled={submitting || employeeForm.isSubmitting}
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
                        disabled={submitting || employeeForm.isSubmitting}
                      >
                        {"update" === employeeModalOperation.operation ? (
                          <FormattedMessage id="employees.forms.edit.updateButtonText" />
                        ) : (
                          <FormattedMessage id="employees.forms.create.createButtonText" />
                        )}
                      </SoftButton>

                      <SoftButton
                        type="submit"
                        color="secondary"
                        onClick={toggleEmployeeModal}
                        disabled={submitting || employeeForm.isSubmitting}
                      >
                        <FormattedMessage id="employees.forms.create.cancelButtonText" />
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

EmployeesIndexPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EmployeesIndexPage);
