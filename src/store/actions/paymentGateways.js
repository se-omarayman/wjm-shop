// axios
import http from "utils/axios";

// action constants
import {
  // create
  PAYMENT_GATEWAY_CREATE_REQUEST,
  PAYMENT_GATEWAY_CREATE_SUCCESS,
  PAYMENT_GATEWAY_CREATE_INVALID,
  PAYMENT_GATEWAY_CREATE_ERROR,
  // update
  PAYMENT_GATEWAY_UPDATE_REQUEST,
  PAYMENT_GATEWAY_UPDATE_SUCCESS,
  PAYMENT_GATEWAY_UPDATE_INVALID,
  PAYMENT_GATEWAY_UPDATE_ERROR,
  // archive
  PAYMENT_GATEWAY_ARCHIVE_SUCCESS,
  PAYMENT_GATEWAY_ARCHIVE_ERROR,
  // unarchive
  PAYMENT_GATEWAY_UNARCHIVE_SUCCESS,
  PAYMENT_GATEWAY_UNARCHIVE_ERROR,
} from "constants/paymentGateways.actions";

// api constants
import {
  API_PAYMENT_GATEWAYS_CREATE_ROUTE_PATH,
  API_PAYMENT_GATEWAYS_UPDATE_ROUTE_PATH,
  API_PAYMENT_GATEWAYS_ARCHIVE_ROUTE_PATH,
  API_PAYMENT_GATEWAYS_UNARCHIVE_ROUTE_PATH,
} from "constants/paymentGateways.api";

export const create = (data) => {
  return async (dispatch) => {
    dispatch({
      type: PAYMENT_GATEWAY_CREATE_REQUEST,
    });

    try {
      const response = await http.put(API_PAYMENT_GATEWAYS_CREATE_ROUTE_PATH, data);

      dispatch({
        type: PAYMENT_GATEWAY_CREATE_SUCCESS,
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
            type: PAYMENT_GATEWAY_CREATE_INVALID,
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
          type: PAYMENT_GATEWAY_CREATE_ERROR,
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
      type: PAYMENT_GATEWAY_UPDATE_REQUEST,
    });

    try {
      const response = await http.patch(
        API_PAYMENT_GATEWAYS_UPDATE_ROUTE_PATH.replace(":id", id),
        data
      );

      dispatch({
        type: PAYMENT_GATEWAY_UPDATE_SUCCESS,
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
            type: PAYMENT_GATEWAY_UPDATE_INVALID,
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
          type: PAYMENT_GATEWAY_UPDATE_ERROR,
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
      const response = await http.patch(API_PAYMENT_GATEWAYS_ARCHIVE_ROUTE_PATH.replace(":id", id));

      dispatch({
        type: PAYMENT_GATEWAY_ARCHIVE_SUCCESS,
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
          type: PAYMENT_GATEWAY_ARCHIVE_ERROR,
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
        API_PAYMENT_GATEWAYS_UNARCHIVE_ROUTE_PATH.replace(":id", id)
      );

      dispatch({
        type: PAYMENT_GATEWAY_UNARCHIVE_SUCCESS,
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
          type: PAYMENT_GATEWAY_UNARCHIVE_ERROR,
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
