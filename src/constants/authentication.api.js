// authentication
// -- local authentication
export const API_LOGIN_AUTHENTICATE_ROUTE_PATH = "/employee/employees/users/auth/login";
// current authenticated user
export const API_CURRENT_USER_ROUTE_PATH = "/employee/employees/users/auth/user";
export const API_CURRENT_USER_UPDATE_PASSWORD_ROUTE_PATH =
  "/employee/employees/users/auth/user/update-password";
// logout
export const API_LOGOUT_ROUTE_PATH = "/employee/employees/users/auth/logout";
// password recovery
export const API_FORGOT_RECOVERY_CREATE_ROUTE_PATH =
  "/employee/employees/users/auth/password/email";
export const API_FORGOT_PASSWORD_FIND_ROUTE_PATH =
  "/employee/employees/users/auth/password/find/:token?email=:email";
export const API_RESET_PASSWORD_ROUTE_PATH = "/employee/employees/users/auth/password/reset";
