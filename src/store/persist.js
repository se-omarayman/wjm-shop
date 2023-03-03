/**
 * Load persisted application state from local storage.
 *
 * @return {String|undefined}
 */
const loadState = () => {
    try {
        const serializedState = window.localStorage.getItem('com.postgait.store');

        if (serializedState === null) {
            return undefined;
        }

        return JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
};

/**
 * Store application state in local storage.
 *
 * @param  {Object} state
 *
 * @return {Void}
 */
const persistState = (state) => {
    try {
        const serializedState = JSON.stringify(state);

        window.localStorage.setItem('com.postgait.store', serializedState);
    } catch (e) {
        // ignore write errors
    }
};

export { loadState, persistState };
