// HTTP
import http from "utils/axios";

// Login action constants
import {
  // Session status
  SESSION_VERIFYING,
  SESSION_VERIFIED,
  SESSION_NOT_VERIFIED,
  // Login
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  // Logout
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
  // Password reset
  PASSWORD_RESET_INVALID,
  // Password update
  PASSWORD_UPDATE_REQUEST,
  PASSWORD_UPDATE_SUCCESS,
  PASSWORD_UPDATE_INVALID,
  PASSWORD_UPDATE_ERROR,
} from "constants/authentication.actions";

// API constants
import {
  API_LOGIN_AUTHENTICATE_ROUTE_PATH,
  API_CURRENT_USER_ROUTE_PATH,
  API_CURRENT_USER_UPDATE_PASSWORD_ROUTE_PATH,
  API_FORGOT_RECOVERY_CREATE_ROUTE_PATH,
  API_FORGOT_PASSWORD_FIND_ROUTE_PATH,
  API_RESET_PASSWORD_ROUTE_PATH,
  API_LOGOUT_ROUTE_PATH,
} from "constants/authentication.api";

export const authenticate = (credentials) => async (dispatch) => {
  try {
    const response = await http.post(API_LOGIN_AUTHENTICATE_ROUTE_PATH, credentials);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data,
    });

    dispatch({
      type: SESSION_VERIFIED,
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
      if (401 === e.response.status) {
        // Invalid credentials
        dispatch({
          type: SESSION_NOT_VERIFIED,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // Catch all server side errors here
      dispatch({
        type: LOGIN_ERROR,
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

    dispatch({
      type: LOGIN_ERROR,
    });

    // If we reached this line -> we probably have an un-handled exception
    return {
      failed: true,
      hasResponse: false,
      error: e,
    };
  }
};

export const check = () => async (dispatch) => {
  dispatch({
    type: SESSION_VERIFYING,
  });

  try {
    const response = await http.get(API_CURRENT_USER_ROUTE_PATH);

    dispatch({
      type: SESSION_VERIFIED,
      checking: true,
      payload: {
        data: response.data,
      },
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
      if (401 === e.response.status) {
        // Invalid credentials
        dispatch({
          type: SESSION_NOT_VERIFIED,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

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

    dispatch({
      type: LOGIN_ERROR,
    });

    // If we reached this line -> we probably have an un-handled exception
    return {
      failed: true,
      hasResponse: false,
      error: e,
    };
  }
};

export const forgotPassword = (data) => async () => {
  try {
    const response = await http.put(API_FORGOT_RECOVERY_CREATE_ROUTE_PATH, data);

    return {
      failed: false,
      hasResponse: true,
      response,
    };
  } catch (e) {
    return {
      failed: true,
      hasResponse: e.response !== null || e.response !== false,
      error: e,
    };
  }
};

export const validatePasswordResetToken = (token, email) => async () => {
  try {
    const url = API_FORGOT_PASSWORD_FIND_ROUTE_PATH.replace(":token", token).replace(
      ":email",
      email
    );

    const response = await http.get(url);

    return {
      failed: false,
      hasResponse: true,
      response,
    };
  } catch (e) {
    // If we sent the request successfully, but the response has an error
    if (e.response) {
      // If we sent the request successfully, but the response has an error
      if (404 === e.response.status) {
        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }
    }

    // If we sent the request successfully, but we never received a response
    if (e.request) {
      // Do something here...
    }

    // If we reached this line -> we probably have an un-handled exception
    return {
      failed: true,
      hasResponse: false,
      error: e,
    };
  }
};

export const resetPassword = (credentials) => async (dispatch) => {
  try {
    const response = await http.patch(API_RESET_PASSWORD_ROUTE_PATH, credentials);

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
          type: PASSWORD_RESET_INVALID,
          error: true,
          payload: e.response,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // If we get a 404 response code, then the token has expired after we
      // have loaded the reset password view
      if (404 === e.response.status) {
        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

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

    // Otherwise, something prevented the request from begin send
    return {
      failed: true,
      hasResponse: false,
      error: e,
    };
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await http.post(API_LOGOUT_ROUTE_PATH);

    dispatch({
      type: LOGOUT_SUCCESS,
    });

    dispatch({
      type: SESSION_NOT_VERIFIED,
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
      if (401 === e.response.status) {
        // Invalid credentials
        dispatch({
          type: SESSION_NOT_VERIFIED,
        });

        return {
          failed: true,
          hasResponse: true,
          error: e,
        };
      }

      // Catch all server side errors here
      dispatch({
        type: LOGOUT_ERROR,
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

export const updatePassword = (data) => async (dispatch) => {
  dispatch({
    type: PASSWORD_UPDATE_REQUEST,
  });

  try {
    const response = await http.patch(API_CURRENT_USER_UPDATE_PASSWORD_ROUTE_PATH, data);

    dispatch({
      type: PASSWORD_UPDATE_SUCCESS,
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
          type: PASSWORD_UPDATE_INVALID,
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
        type: PASSWORD_UPDATE_ERROR,
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
