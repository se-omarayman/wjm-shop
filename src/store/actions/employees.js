// axios
import http from "utils/axios";

// action constants
import {
  // create
  EMPLOYEE_CREATE_REQUEST,
  EMPLOYEE_CREATE_SUCCESS,
  EMPLOYEE_CREATE_INVALID,
  EMPLOYEE_CREATE_ERROR,
  // update personal information
  EMPLOYEE_PERSONAL_INFORMATION_UPDATE_REQUEST,
  EMPLOYEE_PERSONAL_INFORMATION_UPDATE_SUCCESS,
  EMPLOYEE_PERSONAL_INFORMATION_UPDATE_INVALID,
  EMPLOYEE_PERSONAL_INFORMATION_UPDATE_ERROR,
  // update password
  EMPLOYEE_PASSWORD_UPDATE_REQUEST,
  EMPLOYEE_PASSWORD_UPDATE_SUCCESS,
  EMPLOYEE_PASSWORD_UPDATE_INVALID,
  EMPLOYEE_PASSWORD_UPDATE_ERROR,
  // update permissions
  EMPLOYEE_PERMISSIONS_UPDATE_REQUEST,
  EMPLOYEE_PERMISSIONS_UPDATE_SUCCESS,
  EMPLOYEE_PERMISSIONS_UPDATE_INVALID,
  EMPLOYEE_PERMISSIONS_UPDATE_ERROR,
  // archive
  EMPLOYEE_ARCHIVE_SUCCESS,
  EMPLOYEE_ARCHIVE_ERROR,
  // unarchive
  EMPLOYEE_UNARCHIVE_SUCCESS,
  EMPLOYEE_UNARCHIVE_ERROR,
} from "constants/employees.actions";

// API constants
import {
  API_EMPLOYEES_CREATE_ROUTE_PATH,
  API_EMPLOYEES_PERSONAL_INFORMATION_UPDATE_ROUTE_PATH,
  API_EMPLOYEES_PASSWORD_UPDATE_ROUTE_PATH,
  API_EMPLOYEES_PERMISSIONS_UPDATE_ROUTE_PATH,
  API_EMPLOYEES_ARCHIVE_ROUTE_PATH,
  API_EMPLOYEES_UNARCHIVE_ROUTE_PATH,
} from "constants/employees.api";

export const create = (data) => {
  return async (dispatch) => {
    dispatch({
      type: EMPLOYEE_CREATE_REQUEST,
    });

    try {
      const response = await http.put(API_EMPLOYEES_CREATE_ROUTE_PATH, data);

      dispatch({
        type: EMPLOYEE_CREATE_SUCCESS,
        success: true,
        payload: response.data,
      });

      return {
        failed: false,
        hasResponse: true,
        response,
      };
    } catch (e) {
      // If we sent the request successfully, but the response has an error
      if (e.response) {
        // If we sent the request successfully, but the response has an error
        if (422 === e.response.status) {
          // Unprocessable entity
          dispatch({
            type: EMPLOYEE_CREATE_INVALID,
            error: true,
            payload: e.response,
          });

          return {
            failed: true,
            hasResponse: true,
            error: e,
          };
        }

        // Catch all server side errors here
        dispatch({
          type: EMPLOYEE_CREATE_ERROR,
          error: true,
          payload: e.response,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // If we sent the request successfully, but we never received a response
      if (e.request) {
        // Do something here
      }

      // If we reached this line -> we probably have an un-handled exception
      return {
        failed: true,
        hasResponse: false,
        error: e,
      };
    }
  };
};

export const updatePersonalInformation = (slug, data) => {
  return async (dispatch) => {
    dispatch({
      type: EMPLOYEE_PERSONAL_INFORMATION_UPDATE_REQUEST,
    });

    try {
      const response = await http.patch(
        API_EMPLOYEES_PERSONAL_INFORMATION_UPDATE_ROUTE_PATH.replace(":slug", slug),
        data
      );

      dispatch({
        type: EMPLOYEE_PERSONAL_INFORMATION_UPDATE_SUCCESS,
        success: true,
        payload: response.data,
      });

      return {
        failed: false,
        hasResponse: true,
        response,
      };
    } catch (e) {
      // If we sent the request successfully, but the response has an error
      if (e.response) {
        // If we sent the request successfully, but the response has an error
        if (422 === e.response.status) {
          // Unprocessable entity
          dispatch({
            type: EMPLOYEE_PERSONAL_INFORMATION_UPDATE_INVALID,
            error: true,
            payload: e.response,
          });

          return {
            failed: true,
            hasResponse: true,
            error: e,
          };
        }

        // Catch all server side errors here
        dispatch({
          type: EMPLOYEE_PERSONAL_INFORMATION_UPDATE_ERROR,
          error: true,
          payload: e.response,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // If we sent the request successfully, but we never received a response
      if (e.request) {
        // Do something here
      }

      // If we reached this line -> we probably have an un-handled exception
      return {
        failed: true,
        hasResponse: false,
        error: e,
      };
    }
  };
};

export const updatePassword = (slug, data) => {
  return async (dispatch) => {
    dispatch({
      type: EMPLOYEE_PASSWORD_UPDATE_REQUEST,
    });

    try {
      const response = await http.patch(
        API_EMPLOYEES_PASSWORD_UPDATE_ROUTE_PATH.replace(":slug", slug),
        data
      );

      dispatch({
        type: EMPLOYEE_PASSWORD_UPDATE_SUCCESS,
        success: true,
        payload: response.data,
      });

      return {
        failed: false,
        hasResponse: true,
        response,
      };
    } catch (e) {
      // If we sent the request successfully, but the response has an error
      if (e.response) {
        // If we sent the request successfully, but the response has an error
        if (422 === e.response.status) {
          // Unprocessable entity
          dispatch({
            type: EMPLOYEE_PASSWORD_UPDATE_INVALID,
            error: true,
            payload: e.response,
          });

          return {
            failed: true,
            hasResponse: true,
            error: e,
          };
        }

        // Catch all server side errors here
        dispatch({
          type: EMPLOYEE_PASSWORD_UPDATE_ERROR,
          error: true,
          payload: e.response,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // If we sent the request successfully, but we never received a response
      if (e.request) {
        // Do something here
      }

      // If we reached this line -> we probably have an un-handled exception
      return {
        failed: true,
        hasResponse: false,
        error: e,
      };
    }
  };
};

export const updatePermissions = (slug, data) => {
  return async (dispatch) => {
    dispatch({
      type: EMPLOYEE_PERMISSIONS_UPDATE_REQUEST,
    });

    try {
      const response = await http.patch(
        API_EMPLOYEES_PERMISSIONS_UPDATE_ROUTE_PATH.replace(":slug", slug),
        data
      );

      dispatch({
        type: EMPLOYEE_PERMISSIONS_UPDATE_SUCCESS,
        success: true,
        payload: response.data,
      });

      return {
        failed: false,
        hasResponse: true,
        response,
      };
    } catch (e) {
      // If we sent the request successfully, but the response has an error
      if (e.response) {
        // If we sent the request successfully, but the response has an error
        if (422 === e.response.status) {
          // Unprocessable entity
          dispatch({
            type: EMPLOYEE_PERMISSIONS_UPDATE_INVALID,
            error: true,
            payload: e.response,
          });

          return {
            failed: true,
            hasResponse: true,
            error: e,
          };
        }

        // Catch all server side errors here
        dispatch({
          type: EMPLOYEE_PERMISSIONS_UPDATE_ERROR,
          error: true,
          payload: e.response,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // If we sent the request successfully, but we never received a response
      if (e.request) {
        // Do something here
      }

      // If we reached this line -> we probably have an un-handled exception
      return {
        failed: true,
        hasResponse: false,
        error: e,
      };
    }
  };
};

export const archive = (slug) => {
  return async (dispatch) => {
    try {
      const response = await http.patch(API_EMPLOYEES_ARCHIVE_ROUTE_PATH.replace(":slug", slug));

      dispatch({
        type: EMPLOYEE_ARCHIVE_SUCCESS,
        success: true,
        payload: response.data,
      });

      return {
        failed: false,
        hasResponse: true,
        response,
      };
    } catch (e) {
      // If we sent the request successfully, but the response has an error
      if (e.response) {
        // Catch all server side errors here
        dispatch({
          type: EMPLOYEE_ARCHIVE_ERROR,
          error: true,
          payload: e.response,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // If we sent the request successfully, but we never received a response
      if (e.request) {
        // Do something here
      }

      // If we reached this line -> we probably have an un-handled exception
      return {
        failed: true,
        hasResponse: false,
        error: e,
      };
    }
  };
};

export const unarchive = (slug) => {
  return async (dispatch) => {
    try {
      const response = await http.patch(API_EMPLOYEES_UNARCHIVE_ROUTE_PATH.replace(":slug", slug));

      dispatch({
        type: EMPLOYEE_UNARCHIVE_SUCCESS,
        success: true,
        payload: response.data,
      });

      return {
        failed: false,
        hasResponse: true,
        response,
      };
    } catch (e) {
      // If we sent the request successfully, but the response has an error
      if (e.response) {
        // Catch all server side errors here
        dispatch({
          type: EMPLOYEE_UNARCHIVE_ERROR,
          error: true,
          payload: e.response,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // If we sent the request successfully, but we never received a response
      if (e.request) {
        // Do something here
      }

      // If we reached this line -> we probably have an un-handled exception
      return {
        failed: true,
        hasResponse: false,
        error: e,
      };
    }
  };
};
