import { useState } from "react";

import PropTypes from "prop-types";

import { MuiFileInput } from "mui-file-input";

// @mui
// -- components
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
//
import SoftInput from "components/SoftInput";

// lodash
import get from "lodash/get";

// redux
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

FileField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  component: PropTypes.node,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  multiline: PropTypes.bool,
  classes: PropTypes.object,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  meta: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  hasUnprocessableEntities: PropTypes.bool,
  InputProps: PropTypes.object,
  noErrorHelperText: PropTypes.bool,
};

function FileField({
  input,
  label,
  component,
  type,
  disabled,
  readOnly,
  multiline,
  classes,
  fullWidth,
  placeholder,
  rows,
  meta,
  touched,
  errors,
  hasUnprocessableEntities,
  noErrorHelperText,
}) {
  const notifications = useSelector((state) => state.notifications);

  return (
    <>
      <MuiFileInput
        {...input}
        name={input.name}
        label={label || undefined}
        disabled={disabled || false}
        fullWidth={fullWidth || undefined}
        value={input.value}
        sx={{
          display: "block",
          "& .css-1am6x5l, & .rtl-1am6x5l": {
            width: "100%",
          },
        }}
        onChange={(e) => input.onChange(e)}
        error={Boolean(
          (meta.error && meta.touched) ||
            (!(get(errors, input.name, false) && get(touched, input.name, false)) &&
              hasUnprocessableEntities &&
              get(notifications.api.error, `data.errors.${input.name}[0]`, false))
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

// ----------------------------------------------------------------------

export default FileField;
