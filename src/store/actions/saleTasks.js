// axios
import http from "utils/axios";

// action constants
import {
  // create
  SALE_TASK_CREATE_REQUEST,
  SALE_TASK_CREATE_SUCCESS,
  SALE_TASK_CREATE_INVALID,
  SALE_TASK_CREATE_ERROR,
  // update
  SALE_TASK_UPDATE_REQUEST,
  SALE_TASK_UPDATE_SUCCESS,
  SALE_TASK_UPDATE_INVALID,
  SALE_TASK_UPDATE_ERROR,
  // destroy
  SALE_TASK_DESTROY_SUCCESS,
  SALE_TASK_DESTROY_ERROR,
} from "constants/saleTasks.actions";

// api constants
import {
  API_SALE_TASKS_CREATE_ROUTE_PATH,
  API_SALE_TASKS_UPDATE_ROUTE_PATH,
  API_SALE_TASKS_DESTROY_ROUTE_PATH,
  API_EMPLOYEE_SALE_TASKS_DESTROY_ROUTE_PATH,
} from "constants/saleTasks.api";

export const create = (data) => async (dispatch) => {
  dispatch({
    type: SALE_TASK_CREATE_REQUEST,
  });

  try {
    const formData = new FormData();
    formData.append("_method", "PUT");

    formData.append("name", data.name);
    formData.append("url", data.url);
    formData.append("serial_number", data.serial_number);
    formData.append("image", data.image);

    const response = await http.post(API_SALE_TASKS_CREATE_ROUTE_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: SALE_TASK_CREATE_SUCCESS,
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
          type: SALE_TASK_CREATE_INVALID,
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
        type: SALE_TASK_CREATE_ERROR,
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
    type: SALE_TASK_UPDATE_REQUEST,
  });

  try {
    const formData = new FormData();
    formData.append("_method", "PATCH");

    formData.append("name", data.name);
    formData.append("url", data.url);
    formData.append("serial_number", data.serial_number);

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await http.post(
      API_SALE_TASKS_UPDATE_ROUTE_PATH.replace(":slug", slug),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({
      type: SALE_TASK_UPDATE_SUCCESS,
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
          type: SALE_TASK_UPDATE_INVALID,
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
        type: SALE_TASK_UPDATE_ERROR,
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
    const response = await http.delete(API_SALE_TASKS_DESTROY_ROUTE_PATH.replace(":slug", slug));

    dispatch({
      type: SALE_TASK_DESTROY_SUCCESS,
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
        type: SALE_TASK_DESTROY_ERROR,
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

export const destroySaleTask = (slug) => async (dispatch) => {
  try {
    const response = await http.delete(
      API_EMPLOYEE_SALE_TASKS_DESTROY_ROUTE_PATH.replace(":slug", slug)
    );

    dispatch({
      type: SALE_TASK_DESTROY_SUCCESS,
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
        type: SALE_TASK_DESTROY_ERROR,
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
