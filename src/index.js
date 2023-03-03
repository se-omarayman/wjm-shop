/**
=========================================================
* Soft UI Dashboard React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// @mui
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

// axios
import { AxiosInterceptor } from "utils/axios";

// redux
import { Provider as ReduxProvider } from "react-redux";
import store from "store/store";

// soft ui dashboard react context provider
import { SoftUIControllerProvider } from "contexts/softUI";
//
import { IntlProviderWrapper } from "contexts/LocalizationContext";
import { AuthProvider } from "contexts/AuthContext";
//
import App from "App";

// authentication wrapper
import AuthWrapper from "components/AuthWrapper";

ReactDOM.render(
  <BrowserRouter>
    <SoftUIControllerProvider>
      <ReduxProvider store={store}>
        <AuthProvider>
          <AuthWrapper>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <IntlProviderWrapper>
                <AxiosInterceptor>
                  <App />
                </AxiosInterceptor>
              </IntlProviderWrapper>
            </LocalizationProvider>
          </AuthWrapper>
        </AuthProvider>
      </ReduxProvider>
    </SoftUIControllerProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
