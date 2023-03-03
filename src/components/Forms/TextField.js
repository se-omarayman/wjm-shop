import PropTypes from "prop-types";

// @mui
import SoftInput from "components/SoftInput";
import FormHelperText from "@mui/material/FormHelperText";

// lodash
import get from "lodash/get";

// redux
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

function TextField({
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
      <SoftInput
        {...input}
        autoComplete="off"
        id={input.name}
        name={input.name}
        type={type || "text"}
        rows={rows || undefined}
        label={label || undefined}
        disabled={disabled || false}
        readOnly={readOnly || false}
        multiline={multiline || false}
        classes={classes || undefined}
        component={component || undefined}
        fullWidth={fullWidth || undefined}
        placeholder={placeholder || undefined}
        value={type === "file" ? "" : input.value}
        // InputProps={{
        //   InputProps: InputProps ? { ...InputProps } : {},
        //   sx: { borderRadius: "8px", border: "1px solid #CACACA" },
        // }}
        onChange={(e) => {
          if ("file" === type) {
            return input.onChange(e.target.files[0]);
          }

          input.onChange(e);
        }}
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

TextField.propTypes = {
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

// ----------------------------------------------------------------------

export default TextField;
