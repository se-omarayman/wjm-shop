/*eslint no-case-declarations: 0*/
// Action constants
import {
    // Session status
    SESSION_VERIFYING,
    SESSION_VERIFIED,
    SESSION_NOT_VERIFIED,
    // Login
    LOGIN_ERROR,
    // Logout
    LOGOUT_ERROR,
} from '../../constants/authentication.actions';

// Define initial reducer state
const initState = {
    checked: false,
    verifying: false,
    verified: false,
};

const session = (state = initState, { type, checking, payload }) => {
    switch (type) {
        case SESSION_VERIFYING:
            const sessionVerifyingData = Object.assign(state, {
                checked: false,
                verifying: true,
                verified: false,
            });

            return {
                ...state,
                ...sessionVerifyingData,
            };
        case SESSION_VERIFIED:
            const sessionVerifiedData = Object.assign(state, {
                checked: true,
                verifying: false,
                verified: true,
            });

            return {
                ...state,
                ...sessionVerifiedData,
            };
        case SESSION_NOT_VERIFIED:
        case LOGIN_ERROR:
        case LOGOUT_ERROR:
            const sessionNotVerifiedLoginOrLogoutErrorData = Object.assign(state, {
                checked: true,
                verifying: false,
                verified: false,
            });

            return {
                ...state,
                ...sessionNotVerifiedLoginOrLogoutErrorData,
            };
        default:
            return state;
    }
};

export default session;
