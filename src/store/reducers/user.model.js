/*eslint no-fallthrough: 0*/
/*eslint no-case-declarations: 0*/

// Authentication action constants
import {
  // Redux
  // -- Session
  SESSION_VERIFYING,
  SESSION_VERIFIED,
  SESSION_NOT_VERIFIED,
  // -- Login
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  // -- Logout
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
} from "constants/authentication.actions";

// Define initial reducer state
const initState = {
  error: false,
  data: {
    id: 0,
    name: "",
    email: "",
  },
};

const user = (state = initState, { type, payload }) => {
  switch (type) {
    // LOGIN
    case LOGIN_SUCCESS:
      const loginSuccessData = Object.assign(state, {
        error: false,
        data: {
          id: payload.data.id,
          name: payload.data.name,
          email: payload.data.email,
        },
      });

      return {
        ...state,
        ...loginSuccessData,
      };
    // SESSION -> VERIFYING
    case SESSION_VERIFYING:
      const sessionVerifyingData = Object.assign(state, {
        error: false,
      });

      return {
        ...state,
        ...sessionVerifyingData,
      };
    // SESSION -> VERIFIED
    case SESSION_VERIFIED:
      const sessionVerifiedData = Object.assign(state, {
        error: false,
        data: {
          id: payload.data.id,
          name: payload.data.name,
          email: payload.data.email,
        },
      });

      return {
        ...state,
        ...sessionVerifiedData,
      };
    // LOGIN
    case LOGIN_ERROR:
    // LOGOUT
    case LOGOUT_ERROR:
      const loginOrLogoutErrorData = Object.assign(state, {
        error: true,
      });

      return {
        ...state,
        ...loginOrLogoutErrorData,
      };
    // Clear store
    case LOGOUT_SUCCESS:
    case SESSION_NOT_VERIFIED:
      const logoutOrSessionNotVerifiedData = Object.assign(state, {
        error: false,
        data: {
          id: "",
          name: "",
          email: "",
        },
      });

      return {
        ...state,
        ...logoutOrSessionNotVerifiedData,
      };
    default:
      return state;
  }
};

export default user;
