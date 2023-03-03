import { useState, useEffect } from "react";

// axios
import axios from "axios";

// i18n
import { useIntl } from "react-intl";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api/",
  baseURL: "https://wjmshop.net/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const AxiosInterceptor = ({ children }) => {
  // state
  const [isSet, setIsSet] = useState(false);

  // hooks
  const intl = useIntl();

  useEffect(() => {
    axiosInstance.interceptors.request.use(function (config) {
      config.headers["X-Localization"] = intl.locale;

      return config;
    });

    const resInterceptor = (response) => response;

    const errInterceptor = (error) => Promise.reject(error);

    const interceptor = axiosInstance.interceptors.response.use(resInterceptor, errInterceptor);

    setIsSet(true);

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [intl.locale]);

  return isSet && children;
};

export default axiosInstance;
export { AxiosInterceptor };
