import PropTypes from "prop-types";

// @mui
import SoftInput from "components/SoftInput";
import FormHelperText from "@mui/material/FormHelperText";

// lodash
import get from "lodash/get";

// redux
import { useSelector } from "react-redux";

// currency
import CurrencyFormat from "react-currency-format";

// ----------------------------------------------------------------------

function NumberField({
  input,
  label,
  component,
  type,
  disabled,
  format,
  mask,
  classes,
  fullWidth,
  placeholder,
  meta,
  touched,
  errors,
  hasUnprocessableEntities,
  inputProps,
  decimalScale,
  fixedDecimalScale,
  allowNegative,
}) {
  const notifications = useSelector((state) => state.notifications);

  return (
    <>
      <CurrencyFormat
        {...input}
        autoComplete="off"
        id={input.name}
        name={input.name}
        type={type || "text"}
        customInput={SoftInput}
        mask={mask || undefined}
        label={label || undefined}
        format={format || undefined}
        disabled={disabled || false}
        classes={classes || undefined}
        component={component || undefined}
        fullWidth={fullWidth || undefined}
        inputProps={inputProps || undefined}
        // InputProps={{
        //     InputProps: InputProps ? { ...InputProps } : {},
        //     sx: { borderRadius: '8px', border: '1px solid #CACACA' },
        // }}
        placeholder={placeholder || undefined}
        decimalScale={0 === decimalScale ? 0 : decimalScale || 2}
        fixedDecimalScale={fixedDecimalScale || true}
        thousandSpacing="3"
        decimalSeparator="."
        allowNegative={allowNegative || true}
        displayType="input"
        onValueChange={(values) => {
          input.onChange(values.floatValue);
        }}
        error={Boolean(
          (meta.error && meta.touched) ||
            (!(get(errors, input.name, false) && get(touched, input.name, false)) &&
              hasUnprocessableEntities &&
              get(notifications.api.error, `data.errors.${input.name}[0]`, false))
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

NumberField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  component: PropTypes.node,
  type: PropTypes.string,
  mask: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  classes: PropTypes.object,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  meta: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  hasUnprocessableEntities: PropTypes.bool,
  inputProps: PropTypes.object,
  InputProps: PropTypes.object,
  decimalScale: PropTypes.number,
  fixedDecimalScale: PropTypes.bool,
  allowNegative: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default NumberField;
