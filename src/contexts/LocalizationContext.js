import { useState, useEffect, createContext } from "react";

import PropTypes from "prop-types";

// contexts
import { useSoftUIController, setDirection } from "contexts/softUI";

// i18n
import { IntlProvider } from "react-intl";

// langs
// -- navigation
import navigationEN_US from "lang/navigation.en-US.json";
import navigationAR_SA from "lang/navigation.ar-SA.json";
// -- errors
import errorsEN_US from "lang/errors.en-US.json";
import errorsAR_SA from "lang/errors.ar-SA.json";
// -- forms
import formsEN_US from "lang/forms.en-US.json";
import formsAR_SA from "lang/forms.ar-SA.json";
// -- footer
import footerEN_US from "lang/footer.en-US.json";
import footerAR_SA from "lang/footer.ar-SA.json";
// -- login
import loginEN_US from "lang/login.en-US.json";
import loginAR_SA from "lang/login.ar-SA.json";
// -- forgot password
import forgotPasswordEN_US from "lang/forgotPassword.en-US.json";
import forgotPasswordAR_SA from "lang/forgotPassword.ar-SA.json";
// -- reset password
import resetPasswordEN_US from "lang/resetPassword.en-US.json";
import resetPasswordAR_SA from "lang/resetPassword.ar-SA.json";
// -- customer service tasks
import customerServiceTasksEN_US from "lang/customerServiceTasks.en-US.json";
import customerServiceTasksAR_SA from "lang/customerServiceTasks.ar-SA.json";
// -- social media tasks
import socialMediaTasksEN_US from "lang/socialMediaTasks.en-US.json";
import socialMediaTasksAR_SA from "lang/socialMediaTasks.ar-SA.json";
// -- sale tasks
import saleTasksEN_US from "lang/saleTasks.en-US.json";
import saleTasksAR_SA from "lang/saleTasks.ar-SA.json";
// -- invoices
import invoicesEN_US from "lang/invoices.en-US.json";
import invoicesAR_SA from "lang/invoices.ar-SA.json";
// -- merchant platforms
import merchantPlatformsEN_US from "lang/merchantPlatforms.en-US.json";
import merchantPlatformsAR_SA from "lang/merchantPlatforms.ar-SA.json";
// -- payment gateways
import paymentGatewaysEN_US from "lang/paymentGateways.en-US.json";
import paymentGatewaysAR_SA from "lang/paymentGateways.ar-SA.json";
// -- social media platforms
import socialMediaPlatformsEN_US from "lang/socialMediaPlatforms.en-US.json";
import socialMediaPlatformsAR_SA from "lang/socialMediaPlatforms.ar-SA.json";
// -- employees
import employeesEN_US from "lang/employees.en-US.json";
import employeesAR_SA from "lang/employees.ar-SA.json";
// -- announcements
import announcementsEN_US from "lang/announcements.en-US.json";
import announcementsAR_SA from "lang/announcements.ar-SA.json";

// ----------------------------------------------------------------------

// all languages
const i18nMessages = {
  "en-US": {
    ...navigationEN_US,
    ...errorsEN_US,
    ...formsEN_US,
    ...footerEN_US,
    ...loginEN_US,
    ...forgotPasswordEN_US,
    ...resetPasswordEN_US,
    ...customerServiceTasksEN_US,
    ...socialMediaTasksEN_US,
    ...saleTasksEN_US,
    ...invoicesEN_US,
    ...merchantPlatformsEN_US,
    ...paymentGatewaysEN_US,
    ...socialMediaPlatformsEN_US,
    ...employeesEN_US,
    ...announcementsEN_US,
  },
  "ar-SA": {
    ...navigationAR_SA,
    ...errorsAR_SA,
    ...formsAR_SA,
    ...footerAR_SA,
    ...loginAR_SA,
    ...forgotPasswordAR_SA,
    ...resetPasswordAR_SA,
    ...customerServiceTasksAR_SA,
    ...socialMediaTasksAR_SA,
    ...saleTasksAR_SA,
    ...invoicesAR_SA,
    ...merchantPlatformsAR_SA,
    ...paymentGatewaysAR_SA,
    ...socialMediaPlatformsAR_SA,
    ...employeesAR_SA,
    ...announcementsAR_SA,
  },
};

// context
const Context = createContext();

// ----------------------------------------------------------------------

const IntlProviderWrapper = ({ children }) => {
  const storageLocale = window.localStorage.getItem("defaultLocale");
  const storageDirection = window.localStorage.getItem("defaultDirection");

  // state
  const [direction, setLocalStateDirection] = useState(storageDirection || "ltr");

  const [locale, setLocale] = useState(storageLocale || "en-US");

  const [messages, setMessages] = useState(i18nMessages[storageLocale || "en-US"]);

  // contexts
  const [, dispatch] = useSoftUIController();

  // switch language
  const switchLanguage = (lang) => {
    setLocale(lang);

    setMessages(i18nMessages[lang]);

    const targetDirection = "ar-SA" === lang ? "rtl" : "ltr";

    window.localStorage.setItem("defaultLocale", lang);

    setLocalStateDirection(targetDirection);

    window.localStorage.setItem("defaultDirection", targetDirection);

    setDirection(dispatch, targetDirection);
  };

  useEffect(() => {
    setDirection(dispatch, direction);
  }, []);

  return (
    <Context.Provider value={{ locale, switchLanguage }}>
      <IntlProvider key={locale} locale={locale} messages={messages} defaultLocale="en-US">
        {children}
      </IntlProvider>
    </Context.Provider>
  );
};

IntlProviderWrapper.propTypes = {
  children: PropTypes.object.isRequired,
};

export { IntlProviderWrapper, Context as IntlContext };
