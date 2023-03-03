// ** Redux Imports
import { combineReducers } from 'redux';

// ** Reducers Imports
// -- User
import userModel from './user.model';
import userSession from './user.session';
// -- Notifications
import {
    success as successApiNotification,
    error as errorApiNotification,
} from './notifications.api';

const rootReducer = combineReducers({
    authentication: combineReducers({
        user: userModel,
        session: userSession,
    }),
    notifications: combineReducers({
        api: combineReducers({
            success: successApiNotification,
            error: errorApiNotification,
        }),
    }),
});

export default rootReducer;
