import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";

// redux
import { useDispatch } from "react-redux";
import { check } from "store/actions/authentication";
// contexts
import { AuthContext } from "contexts/AuthContext";

// ----------------------------------------------------------------------

const AuthWrapprt = ({ children }) => {
  // state
  const [loading, setLoading] = useState(true);

  // hooks
  const dispatch = useDispatch();

  // contexts
  const authContext = useContext(AuthContext);

  // trigger on component mount
  useEffect(() => {
    async function fetchData() {
      const request = await dispatch(check());

      if (!request.failed) {
        authContext.login(request.response.data.data.permissions);
      }

      if (request.failed && request.hasResponse && 401 === request.error.response.status) {
        authContext.logout();
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (!loading) {
    return <>{children}</>;
  }

  return null;
};

AuthWrapprt.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AuthWrapprt;
