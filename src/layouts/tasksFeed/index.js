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

// material
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";

// axios
import axios from "utils/axios";

// Contexts
import { AuthContext } from "contexts/AuthContext";

// i18n
import { injectIntl } from "react-intl";
import { trans } from "utils/i18n";

// Soft UI Dashboard React
import DashboardLayout from "containers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import Footer from "components/Footer";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import TimelineItem from "components/Timeline/TimelineItem";

// Constants
import { API_ANNOUNCEMENTS_LIST_ROUTE_PATH } from "constants/announcements.api";
import { API_CUSTOMER_SERVICE_TASKS_LIST_ROUTE_PATH } from "constants/customerServiceTasks.api";
import { API_SOCIAL_MEDIA_TASKS_LIST_ROUTE_PATH } from "constants/socialMediaTasks.api";
import { API_SALE_TASKS_LIST_ROUTE_PATH } from "constants/saleTasks.api";

// ----------------------------------------------------------------------

function TasksFeedPage({ intl }) {
  // state
  const [datatableCustomerServiceTasks, setDatatableCustomerServiceTasks] = useState({
    perPage: 3,
    currentPage: 1,
    lastPage: 1,
    isLoading: false,
    data: [],
    from: 0,
    to: 0,
    total: 0,
  });

  const [datatableSocialMediaTasks, setDatatableSocialMediaTasks] = useState({
    perPage: 3,
    currentPage: 1,
    lastPage: 1,
    isLoading: false,
    data: [],
    from: 0,
    to: 0,
    total: 0,
  });

  const [datatableSaleTasks, setDatatableSaleTasks] = useState({
    perPage: 3,
    currentPage: 1,
    lastPage: 1,
    isLoading: false,
    data: [],
    from: 0,
    to: 0,
    total: 0,
  });

  const [announcements, setAnnouncements] = useState({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    data: [],
  });

  // hooks
  const navigate = useNavigate();

  // contexts
  const authContext = useContext(AuthContext);

  function fetchDatatableCustomerServiceTasks(pageNumber, pageSize, options = {}) {
    setDatatableCustomerServiceTasks({ ...datatableCustomerServiceTasks, isLoading: true });

    axios
      .get(API_CUSTOMER_SERVICE_TASKS_LIST_ROUTE_PATH, {
        params: {
          paginate: true,
          tasks_feed: true,
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
      .get(API_SOCIAL_MEDIA_TASKS_LIST_ROUTE_PATH, {
        params: {
          paginate: true,
          tasks_feed: true,
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
      .get(API_SALE_TASKS_LIST_ROUTE_PATH, {
        params: {
          paginate: true,
          tasks_feed: true,
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

  function fetchAnnouncements() {
    setAnnouncements({
      ...announcements,
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    axios
      .get(API_ANNOUNCEMENTS_LIST_ROUTE_PATH, {
        params: {
          active: true,
        },
      })
      .then((res) => {
        const response = res.data;

        setAnnouncements({
          ...announcements,
          isLoading: false,
          isLoaded: true,
          hasError: false,
          data: [...response.data],
        });
      })
      .catch(() => {
        setAnnouncements({
          ...announcements,
          isLoading: false,
          isLoaded: false,
          hasError: true,
        });
      });
  }

  useEffect(() => {
    if (!authContext.isUserAuthenticated()) {
      navigate("/");
    }

    if (authContext.isUserAuthenticated()) {
      fetchAnnouncements();

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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.isUserAuthenticated()]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card className="h-100">
        <SoftBox pt={3} px={3}>
          {announcements.data.map((announcement) => (
            <SoftBox mt={1} mb={2} key={announcement.id}>
              <SoftTypography variant="button" color="text" fontWeight="regular">
                <SoftTypography display="inline" variant="body2" verticalAlign="middle">
                  <Icon sx={{ fontWeight: "bold", color: ({ palette: { error } }) => error.main }}>
                    notification_important
                  </Icon>
                </SoftTypography>
                &nbsp;
                <SoftTypography variant="button" color="text" fontWeight="medium">
                  {announcement.announcement}
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          ))}
        </SoftBox>
        <SoftBox p={2}>
          {datatableCustomerServiceTasks.data.map((service) => (
            <TimelineItem
              key={service.id}
              color="success"
              icon="support_agent"
              title={`#${service.order_id}, ${service.title} - ${service.employee.name}`}
              dateTime={service.created_at}
            />
          ))}

          {datatableSocialMediaTasks.data.map((task) => (
            <TimelineItem
              key={task.id}
              color="success"
              icon="share"
              title={`${trans(task.social_media_platform.name, intl.locale)}, ${task.title} - ${
                task.employee.name
              }`}
              dateTime={task.created_at}
            />
          ))}

          {datatableSaleTasks.data.map((sale) => (
            <TimelineItem
              key={sale.id}
              color="success"
              icon="point_of_sale"
              title={`#${sale.serial_number}, ${sale.name} - ${sale.employee.name}`}
              dateTime={sale.created_at}
            />
          ))}
        </SoftBox>
      </Card>

      <Footer />
    </DashboardLayout>
  );
}

TasksFeedPage.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TasksFeedPage);
