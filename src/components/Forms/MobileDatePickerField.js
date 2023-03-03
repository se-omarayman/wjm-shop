import PropTypes from "prop-types";

import moment from "moment";

// @mui
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
// -- components
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

// lodash
import get from "lodash/get";

// redux
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

function CustomMobileDatePicker({
  input,
  label,
  component,
  type,
  disabled,
  readOnly,
  classes,
  fullWidth,
  placeholder,
  meta,
  touched,
  errors,
  hasUnprocessableEntities,
  noErrorHelperText,
}) {
  const notifications = useSelector((state) => state.notifications);

  return (
    <>
      <MobileDatePicker
        {...input}
        value={input.value}
        inputFormat="dd/MM/yyyy"
        onChange={(e) => input.onChange(moment(e).format("YYYY-MM-DD HH:mm:ss"))}
        error={Boolean(
          (meta.error && meta.touched) ||
            (!(get(errors, input.name, false) && get(touched, input.name, false)) &&
              hasUnprocessableEntities &&
              get(notifications.api.error, `data.errors.${input.name}[0]`, false))
        )}
        renderInput={(params) => (
          <TextField
            autoComplete="off"
            name={input.name}
            type={type || "text"}
            label={label || undefined}
            disabled={disabled || false}
            readOnly={readOnly || false}
            classes={classes || undefined}
            component={component || undefined}
            fullWidth={fullWidth || undefined}
            placeholder={placeholder || undefined}
            {...params}
          />
        )}
      />

      {!noErrorHelperText && (
        <FormHelperText
          sx={{ px: "14px" }}
          error={Boolean(
            (!disabled && meta.error && meta.touched) ||
              (!disabled &&
                !(get(errors, input.name, false) && get(touched, input.name, false)) &&
                hasUnprocessableEntities &&
                get(notifications.api.error, `data.errors.${input.name}[0]`, false))
          )}
        >
          {!(get(errors, input.name, false) && get(touched, input.name, false)) &&
          hasUnprocessableEntities &&
          get(notifications.api.error, `data.errors.${input.name}[0]`, false)
            ? get(notifications.api.error, `data.errors.${input.name}[0]`, "")
            : null}
          {get(errors, input.name, false) && get(touched, input.name, false)
            ? get(errors, input.name, "")
            : null}
        </FormHelperText>
      )}
    </>
  );
}

CustomMobileDatePicker.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  component: PropTypes.node,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  classes: PropTypes.object,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  meta: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  hasUnprocessableEntities: PropTypes.bool,
  InputProps: PropTypes.object,
  noErrorHelperText: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default CustomMobileDatePicker;
