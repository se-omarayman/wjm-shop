// axios
import http from "utils/axios";

// action constants
import {
  // create
  SOCIAL_MEDIA_TASK_CREATE_REQUEST,
  SOCIAL_MEDIA_TASK_CREATE_SUCCESS,
  SOCIAL_MEDIA_TASK_CREATE_INVALID,
  SOCIAL_MEDIA_TASK_CREATE_ERROR,
  // update
  SOCIAL_MEDIA_TASK_UPDATE_REQUEST,
  SOCIAL_MEDIA_TASK_UPDATE_SUCCESS,
  SOCIAL_MEDIA_TASK_UPDATE_INVALID,
  SOCIAL_MEDIA_TASK_UPDATE_ERROR,
  // destroy
  SOCIAL_MEDIA_TASK_DESTROY_SUCCESS,
  SOCIAL_MEDIA_TASK_DESTROY_ERROR,
} from "constants/socialMediaTasks.actions";

// api constants
import {
  API_SOCIAL_MEDIA_TASKS_CREATE_ROUTE_PATH,
  API_SOCIAL_MEDIA_TASKS_UPDATE_ROUTE_PATH,
  API_SOCIAL_MEDIA_TASKS_DESTROY_ROUTE_PATH,
  API_EMPLOYEE_SOCIAL_MEDIA_TASKS_DESTROY_ROUTE_PATH,
} from "constants/socialMediaTasks.api";

export const create = (data) => async (dispatch) => {
  dispatch({
    type: SOCIAL_MEDIA_TASK_CREATE_REQUEST,
  });

  try {
    const formData = new FormData();
    formData.append("_method", "PUT");

    formData.append("social_media_platform_id", data.social_media_platform_id);
    formData.append("title", data.title);
    formData.append("url", data.url);
    formData.append("image", data.image);

    const response = await http.post(API_SOCIAL_MEDIA_TASKS_CREATE_ROUTE_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: SOCIAL_MEDIA_TASK_CREATE_SUCCESS,
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
          type: SOCIAL_MEDIA_TASK_CREATE_INVALID,
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
        type: SOCIAL_MEDIA_TASK_CREATE_ERROR,
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
    type: SOCIAL_MEDIA_TASK_UPDATE_REQUEST,
  });

  try {
    const formData = new FormData();
    formData.append("_method", "PATCH");

    formData.append("social_media_platform_id", data.social_media_platform_id);
    formData.append("title", data.title);
    formData.append("url", data.url);

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await http.post(
      API_SOCIAL_MEDIA_TASKS_UPDATE_ROUTE_PATH.replace(":slug", slug),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({
      type: SOCIAL_MEDIA_TASK_UPDATE_SUCCESS,
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
          type: SOCIAL_MEDIA_TASK_UPDATE_INVALID,
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
        type: SOCIAL_MEDIA_TASK_UPDATE_ERROR,
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
      API_SOCIAL_MEDIA_TASKS_DESTROY_ROUTE_PATH.replace(":slug", slug)
    );

    dispatch({
      type: SOCIAL_MEDIA_TASK_DESTROY_SUCCESS,
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
        type: SOCIAL_MEDIA_TASK_DESTROY_ERROR,
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

export const destroySocialMediaTask = (slug) => async (dispatch) => {
  try {
    const response = await http.delete(
      API_EMPLOYEE_SOCIAL_MEDIA_TASKS_DESTROY_ROUTE_PATH.replace(":slug", slug)
    );

    dispatch({
      type: SOCIAL_MEDIA_TASK_DESTROY_SUCCESS,
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
        type: SOCIAL_MEDIA_TASK_DESTROY_ERROR,
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
