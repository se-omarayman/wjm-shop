// Root reducer
import rootReducer from "./reducers";

// Thunk middleware
import thunk from "redux-thunk";

// Redux stuff
import { createStore, applyMiddleware, compose } from "redux";

// Throttle helper from lodash
import throttle from "lodash/throttle";

// Helpers
import { loadState, persistState } from "./persist";

let composeEnhancers = compose;
const enhancers = [applyMiddleware(thunk)];

// If Redux Dev Tools Extensions are installed, enable them
/* istanbul ignore next */
if (process.env.MIX_ENV !== "production" && typeof window === "object") {
  /* eslint-disable no-underscore-dangle */
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
  /* eslint-enable */
}

// Fetch persisted state from local storage
const persistedState = loadState();

// Create the store
const store = createStore(rootReducer, persistedState, composeEnhancers(...enhancers));

// Hook to store operations => store white list states in local storage
// store.subscribe(
//     throttle(() => {
//         persistState({
//             _resources: store.getState()._resources,
//             _preferences: store.getState()._preferences,
//         });
//     }, 1000)
// );

export default store;
