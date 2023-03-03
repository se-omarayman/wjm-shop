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

// material
// -- data tables
import { DataGrid, enUS, arSD } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
// -- icons
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// axios
import axios from "utils/axios";

// Redux
import { useDispatch } from "react-redux";
import {
  updatePersonalInformation,
  updatePassword,
  updatePermissions,
} from "store/actions/employees";
import { destroyCustomerService } from "store/actions/customerServiceTasks";
import { destroySocialMediaTask } from "store/actions/socialMediaTasks";
import { destroySaleTask } from "store/actions/saleTasks";
import { closeSuccessApiNotification } from "store/actions/notifications";

// Contexts
import { AuthContext } from "contexts/AuthContext";

// i18n
import { injectIntl, FormattedMessage } from "react-intl";
import { trans } from "utils/i18n";

// Forms
import { Form, Field } from "react-final-form";
import validateFormInput from "utils/validateFormInput";

// moment
import Moment from "react-moment";

// sweet alert
import { swalSuccess, swalError, swalDanger } from "utils/swal";

// Soft UI Dashboard React
import DashboardLayout from "containers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Footer from "components/Footer";
import SoftButton from "components/SoftButton";
//
import TextField from "components/Forms/TextField";

// Constants
import { API_EMPLOYEES_SHOW_ROUTE_PATH } from "constants/employees.api";
import { API_PERMISSIONS_LIST_ROUTE_PATH } from "constants/permissions.api";
import { API_EMPLOYEE_CUSTOMER_SERVICE_TASKS_LIST_ROUTE_PATH } from "constants/customerServiceTasks.api";
import { API_EMPLOYEE_SOCIAL_MEDIA_TASKS_LIST_ROUTE_PATH } from "constants/socialMediaTasks.api";
import { API_EMPLOYEE_SALE_TASKS_LIST_ROUTE_PATH } from "constants/saleTasks.api";

// ----------------------------------------------------------------------

function CustomLinearProgress() {
  return <LinearProgress color="warning" variant="indeterminate" />;
}

// ----------------------------------------------------------------------

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function EmployeesEditPage({ intl }) {
  // state
  const [employee, setEmployee] = useState({
    isLoading: false,
    hasError: false,
    data: {},
  });

  const [isPersonalInformationSuccessNoticeOpen, setIsPersonalInformationSuccessNoticeOpen] =
    useState(false);

  const [personalInformationForm, setPersonalInformationForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [isPasswordSuccessNoticeOpen, setIsPasswordSuccessNoticeOpen] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [isPermissionsSuccessNoticeOpen, setIsPermissionsSuccessNoticeOpen] = useState(false);

  const [permissionsForm, setPermissionsForm] = useState({
    hasUnprocessableEntities: false,
    isSubmitting: false,
    hasError: false,
  });

  const [selectedTab, setSelectedTab] = useState(0);

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

  const [permissions, setPermissions] = useState({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    data: [],
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // hooks
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // contexts
  const authContext = useContext(AuthContext);

  const handlePersonalInformationSuccessNoticeClose = () => {
    setIsPersonalInformationSuccessNoticeOpen(false);
    closeSuccessApiNotification();
  };

  const handlePasswordSuccessNoticeClose = () => {
    setIsPasswordSuccessNoticeOpen(false);
    closeSuccessApiNotification();
  };

  async function handlePersonalInformationUpdate(data) {
    setPersonalInformationForm({
      hasUnprocessableEntities: false,
      isSubmitting: true,
      hasError: false,
    });

    const payload = {
      ...data,
    };

    const request = await dispatch(updatePersonalInformation(slug, payload));

    if (!request.failed) {
      const response = request.response.data;

      setPersonalInformationForm({
        ...personalInformationForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setEmployee({
        ...employee,
        data: { ...employee.data, ...response.data },
      });

      setIsPersonalInformationSuccessNoticeOpen(true);

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // Unprocessable entities
        setPersonalInformationForm({
          ...personalInformationForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setPersonalInformationForm({ ...personalInformationForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handlePasswordUpdate(data) {
    setPasswordForm({
      hasUnprocessableEntities: false,
      isSubmitting: true,
      hasError: false,
    });

    const payload = {
      ...data,
    };

    const request = await dispatch(updatePassword(slug, payload));

    if (!request.failed) {
      setPasswordForm({
        ...passwordForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setIsPasswordSuccessNoticeOpen(true);

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // Unprocessable entities
        setPasswordForm({
          ...passwordForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setPasswordForm({ ...passwordForm, isSubmitting: false, hasError: true });

    return false;
  }

  async function handlePermissionsUpdate(data) {
    setPermissionsForm({
      hasUnprocessableEntities: false,
      isSubmitting: true,
      hasError: false,
    });

    const payload = {
      ...data,
    };

    const request = await dispatch(updatePermissions(slug, payload));

    if (!request.failed) {
      setPermissionsForm({
        ...permissionsForm,
        hasUnprocessableEntities: false,
        isSubmitting: false,
        hasError: false,
      });

      setIsPermissionsSuccessNoticeOpen(true);

      return true;
    }

    if (request.failed && request.hasResponse) {
      if (422 === request.error.response.status) {
        // Unprocessable entities
        setPermissionsForm({
          ...permissionsForm,
          hasUnprocessableEntities: true,
          isSubmitting: false,
          hasError: false,
        });

        return false;
      }
    }

    setPermissionsForm({ ...permissionsForm, isSubmitting: false, hasError: true });

    return false;
  }

  function fetchDatatableCustomerServiceTasks(pageNumber, pageSize, options = {}) {
    setDatatableCustomerServiceTasks({ ...datatableCustomerServiceTasks, isLoading: true });

    axios
      .get(API_EMPLOYEE_CUSTOMER_SERVICE_TASKS_LIST_ROUTE_PATH.replace(":slug", slug), {
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

  function fetchDatatableSocialMediaTasks(pageNumber, pageSize, options = {}) {
    setDatatableSocialMediaTasks({ ...datatableSocialMediaTasks, isLoading: true });

    axios
      .get(API_EMPLOYEE_SOCIAL_MEDIA_TASKS_LIST_ROUTE_PATH.replace(":slug", slug), {
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

  function fetchDatatableSaleTasks(pageNumber, pageSize, options = {}) {
    setDatatableSaleTasks({ ...datatableSaleTasks, isLoading: true });

    axios
      .get(API_EMPLOYEE_SALE_TASKS_LIST_ROUTE_PATH.replace(":slug", slug), {
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

  function fetchPermissions() {
    setPermissions({
      ...permissions,
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    axios
      .get(API_PERMISSIONS_LIST_ROUTE_PATH)
      .then((res) => {
        const response = res.data;

        setPermissions({
          ...permissions,
          isLoading: false,
          isLoaded: true,
          hasError: false,
          data: [...response.data],
        });
      })
      .catch(() => {
        setPermissions({
          ...permissions,
          isLoading: false,
          isLoaded: false,
          hasError: true,
        });
      });
  }

  async function handleCustomerServiceTaskDestroy(slug) {
    const request = await dispatch(destroyCustomerService(slug));

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

  async function handleSocialMediaTaskDestroy(slug) {
    const request = await dispatch(destroySocialMediaTask(slug));

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

  async function handleSaleTaskDestroy(slug) {
    const request = await dispatch(destroySaleTask(slug));

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

  function QuickCustomerServiceSearchToolbar() {
    return (
      <Grid container>
        <Grid item xs={6} />
      </Grid>
    );
  }

  const customerServiceColumns = [
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
            {authContext.can("employees.update") && (
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

  function QuickSocialMediaTasksSearchToolbar() {
    return (
      <Grid container>
        <Grid item xs={6} />
      </Grid>
    );
  }

  const socialMediaTasksColumns = [
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
            {authContext.can("employees.update") && (
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

  function QuickSaleTasksSearchToolbar() {
    return (
      <Grid container>
        <Grid item xs={6} />
      </Grid>
    );
  }

  const saleTasksColumns = [
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
            <MuiLink
              color="info"
              target="_blank"
              href={`http://localhost:8000/modules/saletasks/images/${params.row.image}`}
            >
              <DownloadForOfflineOutlinedIcon sx={{ height: 22, width: 22, mt: 1 }} color="info" />
            </MuiLink>

            {authContext.can("employees.update") && (
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
    setEmployee({
      ...employee,
      isLoading: true,
    });

    if (!authContext.isUserAuthenticated()) {
      navigate("/");
    }

    if (authContext.isUserAuthenticated()) {
      axios
        .get(API_EMPLOYEES_SHOW_ROUTE_PATH.replace(":slug", slug))
        .then((res) => {
          document.title = intl.formatMessage(
            {
              id: "employees.pages.edit.title",
            },
            {
              name: res.data.data.name,
            }
          );

          setEmployee({
            ...employee,
            isLoading: false,
            data: { ...employee.data, ...res.data.data },
          });
        })
        .catch(() => {
          setEmployee({
            ...employee,
            hasError: true,
          });
        });

      fetchDatatableCustomerServiceTasks(
        datatableCustomerServiceTasks.currentPage,
        datatableCustomerServiceTasks.perPage,
        {
          sortColumn: "id",
          sortDirection: "desc",
        }
      );

      fetchDatatableSocialMediaTasks(
        datatableSocialMediaTasks.currentPage,
        datatableSocialMediaTasks.perPage,
        {
          sortColumn: "id",
          sortDirection: "desc",
        }
      );

      fetchDatatableSaleTasks(datatableSaleTasks.currentPage, datatableSaleTasks.perPage, {
        sortColumn: "id",
        sortDirection: "desc",
      });

      fetchPermissions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.isUserAuthenticated()]);

  if (!authContext.can("employees.browse")) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
          >
            <Tab
              label={intl.formatMessage({ id: "employees.tabs.information.headerText" })}
              {...a11yProps(0)}
            />
            <Tab
              label={intl.formatMessage({ id: "employees.tabs.customerService.headerText" })}
              {...a11yProps(1)}
            />
            <Tab
              label={intl.formatMessage({ id: "employees.tabs.socialMedia.headerText" })}
              {...a11yProps(2)}
            />
            <Tab
              label={intl.formatMessage({ id: "employees.tabs.sale.headerText" })}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          <SoftBox py={3}>
            <Card>
              <SoftBox p={3}>
                {!personalInformationForm.isSubmitting && personalInformationForm.hasError && (
                  <SoftBox mb={1.5}>
                    <Alert variant="filled" severity="error">
                      <FormattedMessage id="global.errors.api.remoteServerFailed" />
                    </Alert>
                  </SoftBox>
                )}

                {!personalInformationForm.isSubmitting &&
                  !personalInformationForm.hasError &&
                  isPersonalInformationSuccessNoticeOpen && (
                    <SoftBox mb={1.5}>
                      <Alert
                        onClose={handlePersonalInformationSuccessNoticeClose}
                        severity="success"
                        variant="filled"
                      >
                        <FormattedMessage id="employees.forms.edit.success.messageBody" />
                      </Alert>
                    </SoftBox>
                  )}

                <Form
                  initialValues={{
                    name: employee.data?.name,
                    email: employee.data?.email,
                  }}
                  onSubmit={async (values, form) => {
                    const updated = await handlePersonalInformationUpdate(values);

                    if (updated) {
                      form.reset();
                    }
                  }}
                  render={({ handleSubmit, submitting, errors, touched }) => (
                    <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                      <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <SoftTypography variant="h6">
                          <FormattedMessage id="employees.forms.edit.personalInformation.headerText" />
                        </SoftTypography>
                      </SoftBox>

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
                                disabled={
                                  submitting ||
                                  personalInformationForm.isSubmitting ||
                                  employee.hasError ||
                                  employee.isLoading ||
                                  !authContext.can("employees.update")
                                }
                                hasUnprocessableEntities={
                                  personalInformationForm.hasUnprocessableEntities
                                }
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
                                disabled={
                                  submitting ||
                                  personalInformationForm.isSubmitting ||
                                  employee.hasError ||
                                  employee.isLoading ||
                                  !authContext.can("employees.update")
                                }
                                hasUnprocessableEntities={
                                  personalInformationForm.hasUnprocessableEntities
                                }
                              />
                            )}
                          </Field>
                        </SoftBox>
                      </SoftBox>

                      {authContext.can("employees.update") && (
                        <SoftBox mb={2}>
                          <SoftBox mt={4} mb={1}>
                            <Divider />
                            <SoftButton
                              type="submit"
                              color="warning"
                              disabled={
                                submitting ||
                                personalInformationForm.isSubmitting ||
                                employee.hasError ||
                                employee.isLoading
                              }
                            >
                              <FormattedMessage id="employees.forms.edit.updateButtonText" />
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

          <SoftBox py={3}>
            <Card>
              <SoftBox p={3}>
                {!passwordForm.isSubmitting && passwordForm.hasError && (
                  <SoftBox mb={1.5}>
                    <Alert variant="filled" severity="error">
                      <FormattedMessage id="global.errors.api.remoteServerFailed" />
                    </Alert>
                  </SoftBox>
                )}

                {!passwordForm.isSubmitting &&
                  !passwordForm.hasError &&
                  isPasswordSuccessNoticeOpen && (
                    <SoftBox mb={1.5}>
                      <Alert
                        onClose={handlePasswordSuccessNoticeClose}
                        severity="success"
                        variant="filled"
                      >
                        <FormattedMessage id="employees.forms.edit.success.messageBody" />
                      </Alert>
                    </SoftBox>
                  )}

                <Form
                  initialValues={{
                    password: "",
                    password_confirmation: "",
                  }}
                  onSubmit={async (values, form) => {
                    const updated = await handlePasswordUpdate(values);

                    if (updated) {
                      form.restart();
                    }
                  }}
                  render={({ handleSubmit, submitting, errors, touched, values }) => (
                    <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                      <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <SoftTypography variant="h6">
                          <FormattedMessage id="employees.forms.edit.security.headerText" />
                        </SoftTypography>
                      </SoftBox>

                      <SoftBox mb={2}>
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
                                disabled={
                                  submitting ||
                                  passwordForm.isSubmitting ||
                                  employee.hasError ||
                                  employee.isLoading ||
                                  !authContext.can("employees.update")
                                }
                                hasUnprocessableEntities={passwordForm.hasUnprocessableEntities}
                                type="password"
                              />
                            )}
                          </Field>
                        </SoftBox>

                        <SoftBox mb={1} ml={0.5}>
                          <SoftTypography component="label" variant="caption" fontWeight="bold">
                            <FormattedMessage id="forms.input.password_confirmation.labelText" />{" "}
                            (&#42;)
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
                                disabled={
                                  submitting ||
                                  passwordForm.isSubmitting ||
                                  employee.hasError ||
                                  employee.isLoading ||
                                  !authContext.can("employees.update")
                                }
                                hasUnprocessableEntities={passwordForm.hasUnprocessableEntities}
                                type="password"
                              />
                            )}
                          </Field>
                        </SoftBox>
                      </SoftBox>

                      {authContext.can("employees.update") && (
                        <SoftBox mb={2}>
                          <SoftBox mt={4} mb={1}>
                            <Divider />
                            <SoftButton
                              type="submit"
                              color="warning"
                              disabled={
                                submitting ||
                                passwordForm.isSubmitting ||
                                employee.hasError ||
                                employee.isLoading
                              }
                            >
                              <FormattedMessage id="employees.forms.edit.updateButtonText" />
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

          <SoftBox py={3}>
            <Card>
              <SoftBox p={3}>
                {!permissionsForm.isSubmitting && permissionsForm.hasError && (
                  <SoftBox mb={1.5}>
                    <Alert variant="filled" severity="error">
                      <FormattedMessage id="global.errors.api.remoteServerFailed" />
                    </Alert>
                  </SoftBox>
                )}

                {!permissionsForm.isSubmitting &&
                  !permissionsForm.hasError &&
                  isPermissionsSuccessNoticeOpen && (
                    <SoftBox mb={1.5}>
                      <Alert
                        onClose={handlePasswordSuccessNoticeClose}
                        severity="success"
                        variant="filled"
                      >
                        <FormattedMessage id="employees.forms.edit.success.messageBody" />
                      </Alert>
                    </SoftBox>
                  )}

                <Form
                  initialValues={{
                    permissions: employee.data.permissions,
                  }}
                  onSubmit={(values) => {
                    handlePermissionsUpdate(values);
                  }}
                  render={({ handleSubmit, submitting }) => (
                    <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                      <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <SoftTypography variant="h6">
                          <FormattedMessage id="employees.forms.edit.permissions.headerText" />
                        </SoftTypography>
                      </SoftBox>

                      <SoftBox mb={2}>
                        {permissions.data.map((per) => (
                          <Field name="permissions" key={per.id} type="checkbox" value={per.name}>
                            {(fieldProps) => (
                              <FormGroup>
                                <FormControlLabel
                                  {...fieldProps.input}
                                  control={
                                    <Checkbox
                                      {...fieldProps.input}
                                      defaultChecked={employee.data.permissions.includes(per.name)}
                                    />
                                  }
                                  label={trans(per.display_name, intl.locale)}
                                />
                              </FormGroup>
                            )}
                          </Field>
                        ))}
                      </SoftBox>

                      {authContext.can("employees.update") && (
                        <SoftBox mb={2}>
                          <SoftBox mt={4} mb={1}>
                            <Divider />
                            <SoftButton
                              type="submit"
                              color="warning"
                              disabled={
                                submitting ||
                                permissionsForm.isSubmitting ||
                                employee.hasError ||
                                employee.isLoading
                              }
                            >
                              <FormattedMessage id="employees.forms.edit.updateButtonText" />
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
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <SoftBox
            sx={{
              p: 3,
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
              columns={customerServiceColumns}
              autoHeight
              stickyHeader
              disableColumnMenu
              loading={datatableCustomerServiceTasks.isLoading}
              filterMode="server"
              initialState={{
                sorting: { sortModel: [{ field: "id", sort: "desc" }] },
              }}
              components={{
                Toolbar: QuickCustomerServiceSearchToolbar,
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
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <SoftBox
            sx={{
              p: 3,
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
              columns={socialMediaTasksColumns}
              autoHeight
              stickyHeader
              disableColumnMenu
              loading={datatableSocialMediaTasks.isLoading}
              filterMode="server"
              initialState={{
                sorting: { sortModel: [{ field: "id", sort: "desc" }] },
              }}
              components={{
                Toolbar: QuickSocialMediaTasksSearchToolbar,
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
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
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
              columns={saleTasksColumns}
              autoHeight
              stickyHeader
              disableColumnMenu
              loading={datatableSaleTasks.isLoading}
              filterMode="server"
              initialState={{
                sorting: { sortModel: [{ field: "id", sort: "desc" }] },
              }}
              components={{
                Toolbar: QuickSaleTasksSearchToolbar,
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
        </TabPanel>
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

EmployeesEditPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EmployeesEditPage);
