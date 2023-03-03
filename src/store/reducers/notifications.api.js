// Lodash helpers
import isArray from 'lodash/isArray';

// Constant(s)
import { NOTIFICATIONS_API_SUCCESS_CLOSE } from '../../constants/notifications.actions';

// Define the initial success reducer state
const initSuccessState = {
    isOpen: false,
    data: {},
};

// Define the initial error reducer state
const initErrorState = {
    code: 0,
    message: '',
    data: {},
};

export const success = (state = initSuccessState, action) => {
    if (action.success && action.payload) {
        return {
            ...state,
            isOpen: true,
            data: { ...state.data, ...action.payload.notification },
        };
    }

    if (NOTIFICATIONS_API_SUCCESS_CLOSE === action.type) {
        return {
            ...state,
            isOpen: false,
            data: {},
        };
    }

    return state;
};

export const error = (state = initErrorState, action) => {
    if (action.error && action.payload) {
        return {
            ...state,
            code: action.payload.status,
            message: action.payload.statusText ?? '',
            data: isArray(action.payload.data) ? {} : action.payload.data,
        };
    }

    if (action.type.includes('SUCCESS')) {
        return {
            ...state,
            code: 0,
            message: '',
            data: {},
        };
    }

    return state;
};
