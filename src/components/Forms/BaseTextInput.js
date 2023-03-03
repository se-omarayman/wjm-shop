import PropTypes from 'prop-types';
import { Fragment } from 'react';

// @mui
import { Input, FormHelperText } from '@mui/material';
// lodash
import get from 'lodash/get';
// redux
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

function BaseTextInput({
    input,
    type,
    disabled,
    classes,
    fullWidth,
    placeholder,
    meta,
    touched,
    errors,
    hasUnprocessableEntities,
}) {
    const notifications = useSelector((state) => state.notifications);

    return (
        <Fragment>
            <Input
                {...input}
                autoComplete="off"
                id={input.name}
                name={input.name}
                type={type || 'text'}
                disabled={disabled || false}
                classes={classes || undefined}
                fullWidth={fullWidth || undefined}
                placeholder={placeholder || undefined}
            />

            <FormHelperText
                sx={{ px: '14px' }}
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
                    ? get(notifications.api.error, `data.errors.${input.name}[0]`, '')
                    : null}
                {get(errors, input.name, false) && get(touched, input.name, false)
                    ? get(errors, input.name, '')
                    : null}
            </FormHelperText>
        </Fragment>
    );
}

BaseTextInput.propTypes = {
    input: PropTypes.object.isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    classes: PropTypes.object,
    fullWidth: PropTypes.bool,
    placeholder: PropTypes.string,
    meta: PropTypes.object,
    touched: PropTypes.object,
    errors: PropTypes.object,
    hasUnprocessableEntities: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default BaseTextInput;
