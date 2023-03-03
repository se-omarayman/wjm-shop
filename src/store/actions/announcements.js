// axios
import http from "utils/axios";

// action constants
import {
  // create
  ANNOUNCEMENT_CREATE_REQUEST,
  ANNOUNCEMENT_CREATE_SUCCESS,
  ANNOUNCEMENT_CREATE_INVALID,
  ANNOUNCEMENT_CREATE_ERROR,
  // update
  ANNOUNCEMENT_UPDATE_REQUEST,
  ANNOUNCEMENT_UPDATE_SUCCESS,
  ANNOUNCEMENT_UPDATE_INVALID,
  ANNOUNCEMENT_UPDATE_ERROR,
  // destroy
  ANNOUNCEMENT_DESTROY_SUCCESS,
  ANNOUNCEMENT_DESTROY_ERROR,
} from "constants/announcements.actions";

// api constants
import {
  API_ANNOUNCEMENTS_CREATE_ROUTE_PATH,
  API_ANNOUNCEMENTS_UPDATE_ROUTE_PATH,
  API_ANNOUNCEMENTS_DESTROY_ROUTE_PATH,
} from "constants/announcements.api";

export const create = (data) => async (dispatch) => {
  dispatch({
    type: ANNOUNCEMENT_CREATE_REQUEST,
  });

  try {
    const response = await http.put(API_ANNOUNCEMENTS_CREATE_ROUTE_PATH, data);

    dispatch({
      type: ANNOUNCEMENT_CREATE_SUCCESS,
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
          type: ANNOUNCEMENT_CREATE_INVALID,
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
        type: ANNOUNCEMENT_CREATE_ERROR,
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
    type: ANNOUNCEMENT_UPDATE_REQUEST,
  });

  try {
    const response = await http.patch(
      API_ANNOUNCEMENTS_UPDATE_ROUTE_PATH.replace(":slug", slug),
      data
    );

    dispatch({
      type: ANNOUNCEMENT_UPDATE_SUCCESS,
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
          type: ANNOUNCEMENT_UPDATE_INVALID,
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
        type: ANNOUNCEMENT_UPDATE_ERROR,
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
    const response = await http.delete(API_ANNOUNCEMENTS_DESTROY_ROUTE_PATH.replace(":slug", slug));

    dispatch({
      type: ANNOUNCEMENT_DESTROY_SUCCESS,
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
        type: ANNOUNCEMENT_DESTROY_ERROR,
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
