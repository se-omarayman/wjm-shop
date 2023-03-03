import PropTypes from "prop-types";

// @mui
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";

// lodash
import get from "lodash/get";

// redux
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

function SelectField({
  input,
  options,
  disabled,
  loading,
  disableClearable,
  multiple,
  placeholder,
  meta,
  touched,
  errors,
  isOptionEqualToValue,
  hasUnprocessableEntities,
}) {
  // redux
  const notifications = useSelector((state) => state.notifications);

  return (
    <>
      <Autocomplete
        {...input}
        fullWidth
        defaultValue={null}
        options={options}
        autoComplete={false}
        loading={loading || false}
        disabled={disabled || false}
        multiple={multiple || false}
        disableClearable={disableClearable || false}
        isOptionEqualToValue={isOptionEqualToValue || undefined}
        onChange={(e, option) => {
          e.preventDefault();

          input.onChange(option);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            name={input.name}
            inputProps={{
              ...params.inputProps,
              autoComplete: "off",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="warning" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

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
    </>
  );
}

SelectField.propTypes = {
  input: PropTypes.object.isRequired,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  disableClearable: PropTypes.bool,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
  meta: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isOptionEqualToValue: PropTypes.func,
  hasUnprocessableEntities: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default SelectField;
