// axios
import http from "utils/axios";

// action constants
import {
  // create
  INVOICE_CREATE_REQUEST,
  INVOICE_CREATE_SUCCESS,
  INVOICE_CREATE_INVALID,
  INVOICE_CREATE_ERROR,
  // update
  INVOICE_UPDATE_REQUEST,
  INVOICE_UPDATE_SUCCESS,
  INVOICE_UPDATE_INVALID,
  INVOICE_UPDATE_ERROR,
  // destroy
  INVOICE_DESTROY_SUCCESS,
  INVOICE_DESTROY_ERROR,
} from "constants/invoices.actions";

// api constants
import {
  API_INVOICES_CREATE_ROUTE_PATH,
  API_INVOICES_UPDATE_ROUTE_PATH,
  API_INVOICES_DESTROY_ROUTE_PATH,
} from "constants/invoices.api";

export const create = (data) => async (dispatch) => {
  dispatch({
    type: INVOICE_CREATE_REQUEST,
  });

  try {
    const response = await http.put(API_INVOICES_CREATE_ROUTE_PATH, data);

    dispatch({
      type: INVOICE_CREATE_SUCCESS,
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
          type: INVOICE_CREATE_INVALID,
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
        type: INVOICE_CREATE_ERROR,
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
    type: INVOICE_UPDATE_REQUEST,
  });

  try {
    const response = await http.patch(API_INVOICES_UPDATE_ROUTE_PATH.replace(":slug", slug), data);

    dispatch({
      type: INVOICE_UPDATE_SUCCESS,
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
          type: INVOICE_UPDATE_INVALID,
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
        type: INVOICE_UPDATE_ERROR,
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
    const response = await http.delete(API_INVOICES_DESTROY_ROUTE_PATH.replace(":slug", slug));

    dispatch({
      type: INVOICE_DESTROY_SUCCESS,
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
        type: INVOICE_DESTROY_ERROR,
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
