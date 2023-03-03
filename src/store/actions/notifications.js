// Action constants
import {
  NOTIFICATIONS_API_SUCCESS_CLOSE,
  NOTIFICATIONS_API_ERROR_CLOSE,
} from "constants/notifications.actions";

export const closeSuccessApiNotification = () => {
  return (dispatch) => {
    dispatch({
      type: NOTIFICATIONS_API_SUCCESS_CLOSE,
    });
  };
};

export const closeErrorApiNotification = () => {
  return (dispatch) => {
    dispatch({
      type: NOTIFICATIONS_API_ERROR_CLOSE,
    });
  };
};
