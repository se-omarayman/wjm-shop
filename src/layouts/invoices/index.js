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
import DownloadIcon from "@mui/icons-material/Download";

// axios
import axios from "utils/axios";

// redux
import { useDispatch } from "react-redux";
import { create, update, destroy } from "store/actions/invoices";
import { closeSuccessApiNotification } from "store/actions/notifications";

// contexts
import { AuthContext } from "contexts/AuthContext";

// i18n
import { injectIntl, FormattedMessage } from "react-intl";
import { trans } from "utils/i18n";

// sweet alert
import { swalSuccess, swalError, swalDanger } from "utils/swal";

// forms
import { Form, Field } from "react-final-form";
import validateFormInput from "utils/validateFormInput";

// currency format
import CurrencyFormat from "react-currency-format";

// moment
import Moment from "react-moment";

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
import MiniStatisticsCard from "components/Cards/StatisticsCards/MiniStatisticsCard";
//
import Status from "./components/status";

// constants
import { API_MERCHANT_PLATFORMS_LIST_ROUTE_PATH } from "constants/merchantPlatforms.api";
import { API_PAYMENT_GATEWAYS_LIST_ROUTE_PATH } from "constants/paymentGateways.api";
import { API_INVOICES_LIST_ROUTE_PATH } from "constants/invoices.api";

// ----------------------------------------------------------------------

function CustomLinearProgress() {
  return <LinearProgress color="warning" variant="indeterminate" />;
}

// ----------------------------------------------------------------------

InvoicesIndexPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

function InvoicesIndexPage({ intl }) {
  // state
  const [invoiceModalOperation, setInvoiceModalOperation] = useState({
    operation: "create",
    task: {},
  });

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [isInvoiceToastOpen, setIsInvoiceToastOpen] = useState(false);

  const [invoiceForm, setInvoiceForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [datatableInvoices, setDatatableInvoices] = useState({
    perPage: 15,
    currentPage: 1,
    lastPage: 1,
    isLoading: false,
    data: [],
    from: 0,
    to: 0,
    total: 0,
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
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // contexts
  // -- auth
  const authContext = useContext(AuthContext);
  const isUserAuthenticated = authContext.isUserAuthenticated();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const toggleInvoiceModal = () => {
    setIsInvoiceModalOpen(!isInvoiceModalOpen);
  };

  const handleInvoiceToastClose = () => {
    setIsInvoiceToastOpen(false);
    closeSuccessApiNotification();
  };

  function fetchDatatableInvoices(pageNumber, pageSize, options = {}) {
    setDatatableInvoices({ ...datatableInvoices, isLoading: true });

    axios
      .get(API_INVOICES_LIST_ROUTE_PATH, {
        params: {
          paginate: true,
          page: pageNumber,
          per_page: pageSize,
          search: options.globalSearch ?? "",
          date_from: options.globalDateFrom ?? "",
          date_to: options.globalDateTo ?? "",
          merchant_platform_id: options.globalMerchantPlatform ?? "",
          payment_gateway_id: options.globalPaymentGateway ?? "",
          sort_column: options.sortColumn ?? "",
          sort_order: options.sortDirection ?? "",
        },
      })
      .then((res) => {
        const response = res.data;

        setDatatableInvoices({
          ...datatableInvoices,
          isLoading: false,
          perPage: response.data.per_page,
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          data: [...response.data.data],
          from: response.data.from ?? 0,
          to: response.data.to ?? 0,
          total: response.data.total,
          totalBuyAmount: response.total_buy_amount,
          totalSellAmount: response.total_sell_amount,
          totalNetProfit: response.total_net_profit,
        });
      })
      .catch(() => {
        //
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

  async function handleInvoiceCreate(data) {
    setInvoiceForm({
      hasUnprocessableEntities: false,
      isSubmitting: true,
      hasError: false,
    });

    const payload = {
      ...data,
      merchant_platform_id: data.merchant_platform_id.id,
      payment_gateway_id: data.payment_gateway_id.id,
    };

    const request = await dispatch(create(payload));

    if (!request.failed) {
      const response = request.response.data;

      setInvoiceForm({
        ...invoiceForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setDatatableInvoices({
        ...datatableInvoices,
        data: [{ ...response.data, is_fresh: true }, ...datatableInvoices.data],
      });

      setIsInvoiceToastOpen(true);
      toggleInvoiceModal();

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // unprocessable entities
        setInvoiceForm({
          ...invoiceForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setInvoiceForm({ ...invoiceForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handleUpdate(index, data) {
    const payload = {
      ...data,
      merchant_platform_id: data.merchant_platform.id,
      payment_gateway_id: data.payment_gateway.id,
      status: index === 0 ? "is_fresh" : index === 1 ? "is_delivered" : "is_cancelled",
      is_fresh: index === 0 ? true : false,
      is_delivered: index === 1 ? true : false,
      is_cancelled: index === 2 ? true : false,
    };

    const response = await dispatch(update(data.slug, payload));

    setDatatableInvoices({
      ...datatableInvoices,
      data: datatableInvoices.data.map((inv) => {
        if (inv.id === response.response.data.data.id) {
          return response.response.data.data;
        }

        return inv;
      }),
    });
  }

  async function handleInvoiceDestroy(slug) {
    const request = await dispatch(destroy(slug));

    if (!request.failed) {
      return swalSuccess.fire({
        icon: "success",
        title: intl.formatMessage({
          id: "invoices.list.dataTable.actions.destroy.messages.success.messageHeader",
        }),
        text: intl.formatMessage({
          id: "invoices.list.dataTable.actions.destroy.messages.success.messageBody",
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
      <>
        <Grid container>
          <Grid item xs={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              {authContext.can("invoices.store") && (
                <SoftButton
                  color="warning"
                  disabled={isInvoiceModalOpen}
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ mx: 1, my: 3, display: "flex" }}
                  onClick={(e) => {
                    e.preventDefault();

                    setInvoiceModalOperation({
                      ...invoiceModalOperation,
                      operation: "create",
                      customer: {},
                    });
                    toggleInvoiceModal();
                  }}
                >
                  <FormattedMessage id="invoices.list.dataTable.header.createButtonText" />
                </SoftButton>
              )}

              <SoftButton
                color="success"
                disabled={isInvoiceModalOpen}
                startIcon={<DownloadIcon />}
                sx={{ mx: 1, my: 3, display: "flex", height: "41px" }}
                component="a"
                target="_blank"
                href="https://wjmshop.net/employee/invoices/download"
              >
                <FormattedMessage id="invoices.list.dataTable.header.downloadButtonText" />
              </SoftButton>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} lg={6} />
        </Grid>
      </>
    );
  }

  const columns = [
    {
      field: "counter",
      headerName: intl.formatMessage({
        id: "invoices.list.dataTable.header.idColumnName",
      }),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      flex: 1,
      valueGetter: (params) => params.row.counter,
    },
    {
      field: "customer_name",
      headerName: intl.formatMessage({
        id: "invoices.list.dataTable.header.customerNameColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      valueGetter: (params) => params.row.customer_name,
    },
    {
      field: "order_id",
      headerName: intl.formatMessage({
        id: "invoices.list.dataTable.header.orderIdColumnName",
      }),
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <SoftTypography variant="body2">{params.row.order_id}</SoftTypography>
          {"/"}
          <SoftTypography variant="body2">
            {params.row.is_fresh
              ? intl.formatMessage({
                  id: "forms.input.invoices.status.options.fresh.labelText",
                })
              : params.row.is_delivered
              ? intl.formatMessage({
                  id: "forms.input.invoices.status.options.delivered.labelText",
                })
              : intl.formatMessage({
                  id: "forms.input.invoices.status.options.cancelled.labelText",
                })}
          </SoftTypography>
        </>
      ),
    },
    {
      field: "merchant_platform",
      headerName: intl.formatMessage({
        id: "invoices.list.dataTable.header.merchantPlatformColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      valueGetter: (params) => trans(params.row.merchant_platform.name, intl.locale),
    },
    {
      field: "net_profit",
      headerName: intl.formatMessage({
        id: "invoices.list.dataTable.header.netProfitColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <CurrencyFormat
          decimalScale={2}
          displayType="text"
          thousandSeparator=","
          fixedDecimalScale={true}
          value={params.row.selling_price - params.row.buying_price}
        />
      ),
    },
    {
      field: "date",
      headerName: intl.formatMessage({
        id: "invoices.list.dataTable.header.dateColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      renderCell: (params) => <Moment format="YYYY/MM/DD">{params.row.date}</Moment>,
    },
    {
      field: "status",
      headerName: intl.formatMessage({
        id: "invoices.list.dataTable.header.statusColumnName",
      }),
      minWidth: 250,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Status
          model={params.row}
          options={[
            intl.formatMessage({ id: "invoices.status.fresh.labelText" }),
            intl.formatMessage({ id: "invoices.status.delivered.labelText" }),
            intl.formatMessage({ id: "invoices.status.cancelled.labelText" }),
          ]}
          fresh={params.row.is_fresh}
          cancelled={params.row.is_cancelled}
          delivered={params.row.is_delivered}
          handleUpdate={handleUpdate}
        />
      ),
    },
    {
      field: "actions",
      headerName: intl.formatMessage({
        id: "invoices.list.dataTable.header.actionsColumnName",
      }),
      minWidth: 130,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <Stack direction="row">
            {authContext.can("invoices.update") && (
              <Link color="info" to={`/invoices/${params.row.slug}`}>
                <EditIcon sx={{ height: 22, width: 22, mt: 1 }} color="info" />
              </Link>
            )}

            {authContext.can("invoices.destroy") && (
              <IconButton
                color="error"
                onClick={(e) => {
                  e.preventDefault();

                  swalDanger.fire({
                    icon: "question",
                    title: intl.formatMessage({
                      id: "invoices.list.dataTable.actions.destroy.headerText",
                    }),
                    text: intl.formatMessage({
                      id: "invoices.list.dataTable.actions.destroy.bodyText",
                    }),
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                    confirmButtonText: intl.formatMessage({
                      id: "invoices.list.dataTable.actions.destroy.confirmText",
                    }),
                    cancelButtonText: intl.formatMessage({
                      id: "invoices.list.dataTable.actions.destroy.cancelText",
                    }),
                    preConfirm: async () => {
                      await handleInvoiceDestroy(params.row.slug);

                      const parsedInvoices = datatableInvoices.data.filter(
                        (invoice) => params.row.id !== invoice.id
                      );

                      setDatatableInvoices({
                        ...datatableInvoices,
                        data: [...parsedInvoices],
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
    document.title = intl.formatMessage({ id: "invoices.pages.list.title" });

    if (!isUserAuthenticated) {
      navigate("/");
    }

    if (isUserAuthenticated) {
      fetchDatatableInvoices(datatableInvoices.currentPage, datatableInvoices.perPage, {
        sortColumn: "id",
        sortDirection: "desc",
      });

      fetchPaymentGateways();

      fetchMerchantPlatforms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  if (!authContext.can("invoices.browse")) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Snackbar
        autoHideDuration={6000}
        open={isInvoiceToastOpen}
        onClose={handleInvoiceToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert onClose={handleInvoiceToastClose} severity="success" sx={{ width: "100%" }}>
          <FormattedMessage id="invoices.forms.create.success.messageBody" />
        </Alert>
      </Snackbar>

      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} xl={4}>
              <MiniStatisticsCard
                title={{
                  text: intl.formatMessage({ id: "invoices.stats.totalSellAmount.labelText" }),
                }}
                count={datatableInvoices.isLoading ? 0 : datatableInvoices.totalSellAmount}
                icon={{ color: "warning", component: "paid" }}
              />
            </Grid>
            <Grid item xs={12} sm={4} xl={4}>
              <MiniStatisticsCard
                title={{
                  text: intl.formatMessage({ id: "invoices.stats.totalBuyAmount.labelText" }),
                }}
                count={datatableInvoices.isLoading ? 0 : datatableInvoices.totalBuyAmount}
                icon={{ color: "error", component: "public" }}
              />
            </Grid>
            <Grid item xs={12} sm={4} xl={4}>
              <MiniStatisticsCard
                title={{
                  text: intl.formatMessage({ id: "invoices.stats.totalNetProfit.labelText" }),
                }}
                count={datatableInvoices.isLoading ? 0 : datatableInvoices.totalNetProfit}
                icon={{ color: "success", component: "emoji_events" }}
              />
            </Grid>
          </Grid>
        </SoftBox>

        <Card>
          <SoftBox>
            <Grid container px={2}>
              <Grid item xs={12}>
                <Form
                  onSubmit={(values) => {
                    fetchDatatableInvoices(
                      datatableInvoices.currentPage,
                      datatableInvoices.perPage,
                      {
                        globalSearch: values.search,
                        globalDateFrom: values?.date_from,
                        globalDateTo: values?.date_to,
                        globalMerchantPlatform: values.merchant_platform_id?.id,
                        globalPaymentGateway: values.payment_gateway_id?.id,
                      }
                    );
                  }}
                  render={({ handleSubmit, submitting, errors, touched }) => (
                    <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                      <SoftBox mb={2}>
                        <Grid container mt={0.5} spacing={2}>
                          <Grid item xs={12}>
                            <SoftBox mb={1} ml={0.5}>
                              <SoftTypography component="label" variant="caption" fontWeight="bold">
                                <FormattedMessage id="forms.input.invoices.search.labelText" />{" "}
                                (&#42;)
                              </SoftTypography>

                              <Field validateFields={[]} name="search">
                                {(fieldProps) => (
                                  <TextField
                                    errors={errors}
                                    fullWidth
                                    touched={touched}
                                    meta={fieldProps.meta}
                                    input={fieldProps.input}
                                    disabled={submitting}
                                    hasUnprocessableEntities={false}
                                  />
                                )}
                              </Field>
                            </SoftBox>
                          </Grid>
                        </Grid>

                        <Grid container>
                          <Grid item md={6} xs={12} px={1}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              <FormattedMessage id="forms.input.invoices.dateFrom.labelText" />{" "}
                              (&#42;)
                            </SoftTypography>

                            <Field name="date_from" validateFields={[]}>
                              {(fieldProps) => (
                                <MobileDatePickerField
                                  errors={errors}
                                  fullWidth
                                  touched={touched}
                                  meta={fieldProps.meta}
                                  input={fieldProps.input}
                                  disabled={submitting}
                                  hasUnprocessableEntities={false}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item md={6} xs={12} px={1}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                              <FormattedMessage id="forms.input.invoices.dateTo.labelText" />{" "}
                              (&#42;)
                            </SoftTypography>

                            <Field name="date_to" validateFields={[]}>
                              {(fieldProps) => (
                                <MobileDatePickerField
                                  errors={errors}
                                  fullWidth
                                  touched={touched}
                                  meta={fieldProps.meta}
                                  input={fieldProps.input}
                                  disabled={submitting}
                                  hasUnprocessableEntities={false}
                                />
                              )}
                            </Field>
                          </Grid>
                        </Grid>

                        <Grid container mt={0.5} spacing={2}>
                          <Grid item md={6} xs={12}>
                            <SoftBox mb={1} ml={0.5}>
                              <SoftTypography component="label" variant="caption" fontWeight="bold">
                                <FormattedMessage id="forms.input.invoices.merchantPlatform.labelText" />{" "}
                                (&#42;)
                              </SoftTypography>

                              <Field validateFields={[]} name="merchant_platform_id">
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
                                      merchantPlatforms.hasError
                                    }
                                    placeholder={intl.formatMessage({
                                      id: "forms.input.invoices.merchantPlatform.placeholder",
                                    })}
                                    options={merchantPlatforms.data.map((platform) => ({
                                      label: trans(platform.name, intl.locale),
                                      id: platform.id,
                                    }))}
                                    disabled={
                                      submitting ||
                                      merchantPlatforms.isLoading ||
                                      !merchantPlatforms.isLoaded ||
                                      merchantPlatforms.hasError
                                    }
                                    hasUnprocessableEntities={false}
                                  />
                                )}
                              </Field>
                            </SoftBox>
                          </Grid>

                          <Grid item md={6} sx={12}>
                            <SoftBox mb={1} ml={0.5}>
                              <SoftTypography component="label" variant="caption" fontWeight="bold">
                                <FormattedMessage id="forms.input.invoices.paymentGateway.labelText" />{" "}
                                (&#42;)
                              </SoftTypography>

                              <Field validateFields={[]} name="payment_gateway_id">
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
                                    options={paymentGateways.data.map((paymentGateway) => ({
                                      label: trans(paymentGateway.name, intl.locale),
                                      id: paymentGateway.id,
                                    }))}
                                    disabled={
                                      submitting ||
                                      paymentGateways.isLoading ||
                                      !paymentGateways.isLoaded ||
                                      paymentGateways.hasError
                                    }
                                    hasUnprocessableEntities={false}
                                  />
                                )}
                              </Field>
                            </SoftBox>
                          </Grid>
                        </Grid>
                      </SoftBox>

                      <SoftBox mb={2}>
                        <SoftBox mb={1}>
                          <SoftButton type="submit" color="warning" disabled={submitting}>
                            <FormattedMessage id="invoices.list.dataTable.header.searchButtonText" />
                          </SoftButton>
                        </SoftBox>

                        <Divider />
                      </SoftBox>
                    </SoftBox>
                  )}
                />
              </Grid>
            </Grid>
          </SoftBox>

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
              rows={datatableInvoices.data}
              rowCount={datatableInvoices.total}
              logLevel={false}
              pageSize={datatableInvoices.perPage}
              paginationMode="server"
              sortingMode="server"
              columns={columns}
              autoHeight
              stickyHeader
              disableColumnMenu
              loading={datatableInvoices.isLoading}
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
              onPageChange={(page) => fetchDatatableInvoices(page + 1, datatableInvoices.perPage)}
              onSortModelChange={(model) =>
                model.length > 0
                  ? fetchDatatableInvoices(
                      datatableInvoices.currentPage,
                      datatableInvoices.perPage,
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
        open={isInvoiceModalOpen}
        onClose={toggleInvoiceModal}
      >
        <DialogContent dividers>
          <Form
            onSubmit={async (values, form) => {
              const created = await handleInvoiceCreate(values);

              if (created) {
                form.restart();
              }
            }}
            render={({ handleSubmit, submitting, errors, touched }) => (
              <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                {!invoiceForm.isSubmitting && invoiceForm.hasError && (
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <Alert variant="filled" severity="error">
                        <FormattedMessage id="global.errors.api.remoteServerFailed" />
                      </Alert>
                    </Grid>
                  </Grid>
                )}

                <SoftBox mb={2}>
                  <Grid container>
                    <Grid item md={6} sx={12}>
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
                                merchantPlatforms.hasError
                              }
                              placeholder={intl.formatMessage({
                                id: "forms.input.invoices.merchantPlatform.placeholder",
                              })}
                              options={merchantPlatforms.data.map((platform) => ({
                                label: trans(platform.name, intl.locale),
                                id: platform.id,
                              }))}
                              disabled={
                                submitting ||
                                invoiceForm.isSubmitting ||
                                merchantPlatforms.isLoading ||
                                !merchantPlatforms.isLoaded ||
                                merchantPlatforms.hasError
                              }
                              hasUnprocessableEntities={invoiceForm.hasUnprocessableEntities}
                            />
                          )}
                        </Field>
                      </SoftBox>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item md={6} sx={12}>
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
                              options={paymentGateways.data.map((paymentGateway) => ({
                                label: trans(paymentGateway.name, intl.locale),
                                id: paymentGateway.id,
                              }))}
                              disabled={
                                submitting ||
                                invoiceForm.isSubmitting ||
                                paymentGateways.isLoading ||
                                !paymentGateways.isLoaded ||
                                paymentGateways.hasError
                              }
                              hasUnprocessableEntities={invoiceForm.hasUnprocessableEntities}
                            />
                          )}
                        </Field>
                      </SoftBox>
                    </Grid>
                  </Grid>

                  <SoftBox mb={1} ml={0.5}>
                    <Grid container>
                      <Grid item md={6} sx={12}>
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
                              disabled={submitting || invoiceForm.isSubmitting}
                              hasUnprocessableEntities={invoiceForm.hasUnprocessableEntities}
                            />
                          )}
                        </Field>
                      </Grid>
                    </Grid>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.invoices.customerName.labelText" /> (&#42;)
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
                          disabled={submitting || invoiceForm.isSubmitting}
                          hasUnprocessableEntities={invoiceForm.hasUnprocessableEntities}
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
                          disabled={submitting || invoiceForm.isSubmitting}
                          hasUnprocessableEntities={invoiceForm.hasUnprocessableEntities}
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
                          disabled={submitting || invoiceForm.isSubmitting}
                          hasUnprocessableEntities={invoiceForm.hasUnprocessableEntities}
                        />
                      )}
                    </Field>
                  </SoftBox>

                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      <FormattedMessage id="forms.input.invoices.sellingPrice.labelText" /> (&#42;)
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
                          disabled={submitting || invoiceForm.isSubmitting}
                          hasUnprocessableEntities={invoiceForm.hasUnprocessableEntities}
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
                        disabled={submitting || invoiceForm.isSubmitting}
                      >
                        <FormattedMessage id="invoices.forms.create.createButtonText" />
                      </SoftButton>

                      <SoftButton
                        type="submit"
                        color="secondary"
                        onClick={toggleInvoiceModal}
                        disabled={submitting || invoiceForm.isSubmitting}
                      >
                        <FormattedMessage id="invoices.forms.create.cancelButtonText" />
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

export default injectIntl(InvoicesIndexPage);
