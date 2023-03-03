import PropTypes from "prop-types";
import { useState, createContext } from "react";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    checked: false,
    authenticated: false,
    permissions: [],
  });

  const login = (permissions) => {
    setAuthState({
      ...authState,
      authenticated: true,
      permissions: [...permissions],
    });
  };

  const logout = () => {
    setAuthState({
      ...authState,
      authenticated: false,
      permissions: [],
    });
  };

  // mark auth status as checked
  const checked = () => {
    setAuthState({
      ...authState,
      checked: false,
    });
  };

  // checks if the session status is checked or not
  const isChecked = () => {
    return authState.checked;
  };

  // checks if the user is authenticated or not
  const isUserAuthenticated = () => {
    if (!authState.authenticated) {
      return false;
    }

    return true;
  };

  // permission check
  const can = (permission) => {
    return authState.permissions.find((p) => p === permission) ? true : false;
  };

  return (
    <Provider
      value={{
        authState,
        login,
        logout,
        checked,
        isChecked,
        isUserAuthenticated,
        can,
      }}
    >
      {children}
    </Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export { AuthContext, AuthProvider };
