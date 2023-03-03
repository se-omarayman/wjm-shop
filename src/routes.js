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

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Icons
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";

// Soft UI Dashboard React layouts
// -- silent
import Signin from "layouts/authentication/sign-in";
import ForgotPassword from "layouts/authentication/forgotPassword";
import ResetPassword from "layouts/authentication/resetPassword";
// -- nav
import TasksFeed from "layouts/tasksFeed";
import MerchantPlatforms from "layouts/merchantPlatforms";
import PaymentGateways from "layouts/paymentGateways";
import SocialMediaPlatforms from "layouts/socialMediaPlatforms";
import InvoicesIndex from "layouts/invoices";
import InvoicesEdit from "layouts/invoices/edit";
import CustomerServiceTasksIndex from "layouts/customerServiceTasks";
import CustomerServiceTasksEdit from "layouts/customerServiceTasks/edit";
import SocialMediaTasksIndex from "layouts/socialMediaTasks";
import SocialMediaTasksEdit from "layouts/socialMediaTasks/edit";
import SaleTasksIndex from "layouts/saleTasks";
import SaleTasksEdit from "layouts/saleTasks/edit";
import AnnouncementsIndex from "layouts/announcements";
import AnnouncementsEdit from "layouts/announcements/edit";
import EmployeesIndex from "layouts/employees";
import EmployeesEdit from "layouts/employees/edit";

const routes = [
  // silent routes
  // -- auth
  {
    type: "route",
    name: "navigation.signInLabel",
    key: "signin",
    route: "/",
    component: <Signin />,
  },
  {
    type: "route",
    name: "navigation.forgotPasswordLabel",
    key: "forgot-password",
    route: "/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "route",
    name: "navigation.resetPasswordLabel",
    key: "reset-password",
    route: "/password-recovery/:token",
    component: <ResetPassword />,
  },
  // nav routes
  // -- dashboard
  {
    type: "collapse",
    name: "navigation.tasksFeedLabel",
    key: "tasks-feed",
    route: "/tasks-feed",
    icon: <AssignmentOutlinedIcon />,
    component: <TasksFeed />,
    noCollapse: true,
  },
  // -- customer service tasks
  {
    type: "collapse",
    name: "navigation.customerServiceTasksLabel",
    key: "customer-service-tasks",
    route: "/customer-service-tasks",
    permission: "tasks.customerService.browse",
    icon: <SupportAgentOutlinedIcon />,
    component: <CustomerServiceTasksIndex />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "navigation.customerServiceTasksLabel",
    key: "customer-service-tasks",
    route: "/customer-service-tasks/:slug",
    component: <CustomerServiceTasksEdit />,
    noCollapse: true,
  },
  // -- social media tasks
  {
    type: "collapse",
    name: "navigation.socialMediaTasksLabel",
    key: "social-media-tasks",
    route: "/social-media-tasks",
    permission: "tasks.socialMedia.browse",
    icon: <ShareOutlinedIcon />,
    component: <SocialMediaTasksIndex />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "navigation.socialMediaTasksLabel",
    key: "social-media-tasks",
    route: "/social-media-tasks/:slug",
    component: <SocialMediaTasksEdit />,
    noCollapse: true,
  },
  // -- sale tasks
  {
    type: "collapse",
    name: "navigation.saleTasksLabel",
    key: "sale-tasks",
    route: "/sale-tasks",
    permission: "tasks.sale.browse",
    icon: <PointOfSaleOutlinedIcon />,
    component: <SaleTasksIndex />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "navigation.saleTasksLabel",
    key: "sale-tasks",
    route: "/sale-tasks/:slug",
    component: <SaleTasksEdit />,
    noCollapse: true,
  },
  // -- invoices
  {
    type: "collapse",
    name: "navigation.invoicesLabel",
    key: "invoices",
    route: "/invoices",
    permission: "invoices.browse",
    icon: <ReceiptOutlinedIcon />,
    component: <InvoicesIndex />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "navigation.invoicesLabel",
    key: "invoices",
    route: "/invoices/:slug",
    component: <InvoicesEdit />,
    noCollapse: true,
  },
  // -- announcements
  {
    type: "collapse",
    name: "navigation.announcementsLabel",
    key: "announcements",
    route: "/announcements",
    permission: "announcements.browse",
    icon: <CampaignOutlinedIcon />,
    component: <AnnouncementsIndex />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "navigation.announcementsLabel",
    key: "announcements",
    route: "/announcements/:slug",
    component: <AnnouncementsEdit />,
    noCollapse: true,
  },
  // -- merchant platforms
  {
    type: "collapse",
    name: "navigation.merchantPlatformsLabel",
    key: "merchant-platforms",
    route: "/merchant-platforms",
    permission: "merchantPlatforms.browse",
    icon: <ShoppingCartOutlinedIcon />,
    component: <MerchantPlatforms />,
    noCollapse: true,
  },
  // -- payment gateways
  {
    type: "collapse",
    name: "navigation.paymentGatewaysLabel",
    key: "payment-gateways",
    route: "/payment-gateways",
    permission: "paymentGateways.browse",
    icon: <PaymentOutlinedIcon />,
    component: <PaymentGateways />,
    noCollapse: true,
  },
  // -- social media platforms
  {
    type: "collapse",
    name: "navigation.socialMediaPlatformsLabel",
    key: "social-media-platforms",
    route: "/social-media-platforms",
    permission: "socialMediaPlatforms.browse",
    icon: <LinkOutlinedIcon />,
    component: <SocialMediaPlatforms />,
    noCollapse: true,
  },
  // -- employees
  {
    type: "collapse",
    name: "navigation.employeesLabel",
    key: "employees",
    route: "/employees",
    permission: "employees.browse",
    icon: <GroupOutlinedIcon />,
    component: <EmployeesIndex />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "navigation.employeesLabel",
    key: "employees",
    route: "/employees/:slug",
    component: <EmployeesEdit />,
    noCollapse: true,
  },
];

export default routes;
