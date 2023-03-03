// axios
import http from "utils/axios";

// action constants
import {
  // create
  MERCHANT_PLATFORM_CREATE_REQUEST,
  MERCHANT_PLATFORM_CREATE_SUCCESS,
  MERCHANT_PLATFORM_CREATE_INVALID,
  MERCHANT_PLATFORM_CREATE_ERROR,
  // update
  MERCHANT_PLATFORM_UPDATE_REQUEST,
  MERCHANT_PLATFORM_UPDATE_SUCCESS,
  MERCHANT_PLATFORM_UPDATE_INVALID,
  MERCHANT_PLATFORM_UPDATE_ERROR,
  // archive
  MERCHANT_PLATFORM_ARCHIVE_SUCCESS,
  MERCHANT_PLATFORM_ARCHIVE_ERROR,
  // unarchive
  MERCHANT_PLATFORM_UNARCHIVE_SUCCESS,
  MERCHANT_PLATFORM_UNARCHIVE_ERROR,
} from "constants/merchantPlatforms.actions";

// api constants
import {
  API_MERCHANT_PLATFORMS_CREATE_ROUTE_PATH,
  API_MERCHANT_PLATFORMS_UPDATE_ROUTE_PATH,
  API_MERCHANT_PLATFORMS_ARCHIVE_ROUTE_PATH,
  API_MERCHANT_PLATFORMS_UNARCHIVE_ROUTE_PATH,
} from "constants/merchantPlatforms.api";

export const create = (data) => {
  return async (dispatch) => {
    dispatch({
      type: MERCHANT_PLATFORM_CREATE_REQUEST,
    });

    try {
      const response = await http.put(API_MERCHANT_PLATFORMS_CREATE_ROUTE_PATH, data);

      dispatch({
        type: MERCHANT_PLATFORM_CREATE_SUCCESS,
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
            type: MERCHANT_PLATFORM_CREATE_INVALID,
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
          type: MERCHANT_PLATFORM_CREATE_ERROR,
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

export const update = (id, data) => {
  return async (dispatch) => {
    dispatch({
      type: MERCHANT_PLATFORM_UPDATE_REQUEST,
    });

    try {
      const response = await http.patch(
        API_MERCHANT_PLATFORMS_UPDATE_ROUTE_PATH.replace(":id", id),
        data
      );

      dispatch({
        type: MERCHANT_PLATFORM_UPDATE_SUCCESS,
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
            type: MERCHANT_PLATFORM_UPDATE_INVALID,
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
          type: MERCHANT_PLATFORM_UPDATE_ERROR,
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

export const archive = (id) => {
  return async (dispatch) => {
    try {
      const response = await http.patch(
        API_MERCHANT_PLATFORMS_ARCHIVE_ROUTE_PATH.replace(":id", id)
      );

      dispatch({
        type: MERCHANT_PLATFORM_ARCHIVE_SUCCESS,
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
          type: MERCHANT_PLATFORM_ARCHIVE_ERROR,
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

export const unarchive = (id) => {
  return async (dispatch) => {
    try {
      const response = await http.patch(
        API_MERCHANT_PLATFORMS_UNARCHIVE_ROUTE_PATH.replace(":id", id)
      );

      dispatch({
        type: MERCHANT_PLATFORM_UNARCHIVE_SUCCESS,
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
          type: MERCHANT_PLATFORM_UNARCHIVE_ERROR,
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
