// axios
import http from "utils/axios";

// action constants
import {
  // create
  SOCIAL_MEDIA_PLATFORM_CREATE_REQUEST,
  SOCIAL_MEDIA_PLATFORM_CREATE_SUCCESS,
  SOCIAL_MEDIA_PLATFORM_CREATE_INVALID,
  SOCIAL_MEDIA_PLATFORM_CREATE_ERROR,
  // update
  SOCIAL_MEDIA_PLATFORM_UPDATE_REQUEST,
  SOCIAL_MEDIA_PLATFORM_UPDATE_SUCCESS,
  SOCIAL_MEDIA_PLATFORM_UPDATE_INVALID,
  SOCIAL_MEDIA_PLATFORM_UPDATE_ERROR,
  // archive
  SOCIAL_MEDIA_PLATFORM_ARCHIVE_SUCCESS,
  SOCIAL_MEDIA_PLATFORM_ARCHIVE_ERROR,
  // unarchive
  SOCIAL_MEDIA_PLATFORM_UNARCHIVE_SUCCESS,
  SOCIAL_MEDIA_PLATFORM_UNARCHIVE_ERROR,
} from "constants/socialMediaPlatforms.actions";

// api constants
import {
  API_SOCIAL_MEDIA_PLATFORMS_CREATE_ROUTE_PATH,
  API_SOCIAL_MEDIA_PLATFORMS_UPDATE_ROUTE_PATH,
  API_SOCIAL_MEDIA_PLATFORMS_ARCHIVE_ROUTE_PATH,
  API_SOCIAL_MEDIA_PLATFORMS_UNARCHIVE_ROUTE_PATH,
} from "constants/socialMediaPlatforms.api";

export const create = (data) => {
  return async (dispatch) => {
    dispatch({
      type: SOCIAL_MEDIA_PLATFORM_CREATE_REQUEST,
    });

    try {
      const response = await http.put(API_SOCIAL_MEDIA_PLATFORMS_CREATE_ROUTE_PATH, data);

      dispatch({
        type: SOCIAL_MEDIA_PLATFORM_CREATE_SUCCESS,
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
            type: SOCIAL_MEDIA_PLATFORM_CREATE_INVALID,
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
          type: SOCIAL_MEDIA_PLATFORM_CREATE_ERROR,
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
      type: SOCIAL_MEDIA_PLATFORM_UPDATE_REQUEST,
    });

    try {
      const response = await http.patch(
        API_SOCIAL_MEDIA_PLATFORMS_UPDATE_ROUTE_PATH.replace(":id", id),
        data
      );

      dispatch({
        type: SOCIAL_MEDIA_PLATFORM_UPDATE_SUCCESS,
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
            type: SOCIAL_MEDIA_PLATFORM_UPDATE_INVALID,
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
          type: SOCIAL_MEDIA_PLATFORM_UPDATE_ERROR,
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
        API_SOCIAL_MEDIA_PLATFORMS_ARCHIVE_ROUTE_PATH.replace(":id", id)
      );

      dispatch({
        type: SOCIAL_MEDIA_PLATFORM_ARCHIVE_SUCCESS,
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
          type: SOCIAL_MEDIA_PLATFORM_ARCHIVE_ERROR,
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
        API_SOCIAL_MEDIA_PLATFORMS_UNARCHIVE_ROUTE_PATH.replace(":id", id)
      );

      dispatch({
        type: SOCIAL_MEDIA_PLATFORM_UNARCHIVE_SUCCESS,
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
          type: SOCIAL_MEDIA_PLATFORM_UNARCHIVE_ERROR,
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
