// axios
import http from "utils/axios";

// action constants
import {
  // create
  CUSTOMER_SERVICE_TASK_CREATE_REQUEST,
  CUSTOMER_SERVICE_TASK_CREATE_SUCCESS,
  CUSTOMER_SERVICE_TASK_CREATE_INVALID,
  CUSTOMER_SERVICE_TASK_CREATE_ERROR,
  // update
  CUSTOMER_SERVICE_TASK_UPDATE_REQUEST,
  CUSTOMER_SERVICE_TASK_UPDATE_SUCCESS,
  CUSTOMER_SERVICE_TASK_UPDATE_INVALID,
  CUSTOMER_SERVICE_TASK_UPDATE_ERROR,
  // destroy
  CUSTOMER_SERVICE_TASK_DESTROY_SUCCESS,
  CUSTOMER_SERVICE_TASK_DESTROY_ERROR,
} from "constants/customerServiceTasks.actions";

// api constants
import {
  API_CUSTOMER_SERVICE_TASKS_CREATE_ROUTE_PATH,
  API_CUSTOMER_SERVICE_TASKS_UPDATE_ROUTE_PATH,
  API_CUSTOMER_SERVICE_TASKS_DESTROY_ROUTE_PATH,
  API_EMPLOYEE_CUSTOMER_SERVICE_TASKS_DESTROY_ROUTE_PATH,
} from "constants/customerServiceTasks.api";

export const create = (data) => async (dispatch) => {
  dispatch({
    type: CUSTOMER_SERVICE_TASK_CREATE_REQUEST,
  });

  try {
    const response = await http.put(API_CUSTOMER_SERVICE_TASKS_CREATE_ROUTE_PATH, data);

    dispatch({
      type: CUSTOMER_SERVICE_TASK_CREATE_SUCCESS,
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
        // unprocessable entity
        dispatch({
          type: CUSTOMER_SERVICE_TASK_CREATE_INVALID,
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
        type: CUSTOMER_SERVICE_TASK_CREATE_ERROR,
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

export const update = (slug, data) => async (dispatch) => {
  dispatch({
    type: CUSTOMER_SERVICE_TASK_UPDATE_REQUEST,
  });

  try {
    const response = await http.patch(
      API_CUSTOMER_SERVICE_TASKS_UPDATE_ROUTE_PATH.replace(":slug", slug),
      data
    );

    dispatch({
      type: CUSTOMER_SERVICE_TASK_UPDATE_SUCCESS,
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
        // unprocessable entity
        dispatch({
          type: CUSTOMER_SERVICE_TASK_UPDATE_INVALID,
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
        type: CUSTOMER_SERVICE_TASK_UPDATE_ERROR,
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

export const destroy = (slug) => async (dispatch) => {
  try {
    const response = await http.delete(
      API_CUSTOMER_SERVICE_TASKS_DESTROY_ROUTE_PATH.replace(":slug", slug)
    );

    dispatch({
      type: CUSTOMER_SERVICE_TASK_DESTROY_SUCCESS,
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
        type: CUSTOMER_SERVICE_TASK_DESTROY_ERROR,
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

export const destroyCustomerService = (slug) => async (dispatch) => {
  try {
    const response = await http.delete(
      API_EMPLOYEE_CUSTOMER_SERVICE_TASKS_DESTROY_ROUTE_PATH.replace(":slug", slug)
    );

    dispatch({
      type: CUSTOMER_SERVICE_TASK_DESTROY_SUCCESS,
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
        type: CUSTOMER_SERVICE_TASK_DESTROY_ERROR,
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
